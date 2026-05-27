/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SystemParameters, SimulationPoint, PotentialType, StimulusType } from '../types';
import { x_ext, StimulusConfig } from './stimulus';

// Compute Potential V(S)
export function getPotentialEnergy(S: number, par: SystemParameters): number {
  switch (par.potential) {
    case 'harmonic':
      return 0.5 * S * S; // V(S) = 1/2 * S^2
    case 'double_well': {
      // Barrier centered at 0 with minima at -1.5 and 1.5
      // V(S) = height * ((S^2 - 1)^2)
      const S2 = S * S;
      return par.V_height * (S2 - 1) * (S2 - 1);
    }
    case 'soft_asymmetric':
      // V(S) = 1/2 * S^2 + 0.25 * S^3 - 0.05 * S^4
      return 0.5 * S * S + 0.15 * S * S * S;
  }
}

// Compute derivative V'(S) = dV/dS
export function getPotentialForce(S: number, par: SystemParameters): number {
  switch (par.potential) {
    case 'harmonic':
      return S; // dV/dS = S
    case 'double_well': {
      // V'(S) = 4 * height * S * (S^2 - 1)
      return 4 * par.V_height * S * (S * S - 1);
    }
    case 'soft_asymmetric':
      return S + 0.45 * S * S;
  }
}

// Generate stimulus E(t)
export function getStimulus(
  t: number,
  type: StimulusType,
  amplitude: number,
  frequency: number,
  startOffset?: number,
  duration?: number,
  stimConfig?: StimulusConfig
): number {
  if (stimConfig) {
    return x_ext(t, {
      ...stimConfig,
      type: (stimConfig.type === 'step' || stimConfig.type === 'noise') ? 'sine' : (stimConfig.type as any), // Safeguard type check
      amp: amplitude,
      freq: frequency,
      startOffset: startOffset !== undefined ? startOffset : stimConfig.startOffset,
      duration: duration !== undefined ? duration : stimConfig.duration,
    });
  }
  switch (type) {
    case 'sine':
      return x_ext(t, { type: 'sine', amp: amplitude, freq: frequency, startOffset, duration });
    case 'pulse':
      return x_ext(t, { type: 'pulse', amp: amplitude, freq: frequency, dutyCycle: 0.2, startOffset, duration });
    case 'chirp':
      return x_ext(t, { type: 'chirp', amp: amplitude, freq: frequency, startOffset, duration });
    case 'bistable': {
      // Alternating step pulses
      if (startOffset !== undefined && t < startOffset) return 0;
      if (startOffset !== undefined && duration !== undefined && t > startOffset + duration) return 0;
      const period = 1 / (frequency || 0.1);
      const T = startOffset !== undefined ? t - startOffset : t;
      const phase = (T % period) / period;
      if (phase < 0.4) return amplitude;
      if (phase >= 0.5 && phase < 0.9) return -amplitude;
      return 0;
    }
    case 'thermal_noise': {
      // Simulated bandwidth-limited noise using sinusoidal superposition
      if (startOffset !== undefined && t < startOffset) return 0;
      if (startOffset !== undefined && duration !== undefined && t > startOffset + duration) return 0;
      const T = startOffset !== undefined ? t - startOffset : t;
      let noise = 0;
      for (let i = 1; i <= 5; i++) {
        noise += Math.sin(1.7 * i * T + Math.cos(2.3 * i * T)) * (1 / i);
      }
      return (amplitude / 2) * noise;
    }
  }
  return 0;
}

// ODE derivatives function f(Y, t)
// Y state vector: [S, dS, dF]
// Returns d[S, dS, dF]/dt
function derivatives(
  t: number,
  Y: [number, number, number],
  par: SystemParameters,
  stimType: StimulusType,
  amp: number,
  freq: number,
  startOffset?: number,
  duration?: number,
  stimConfig?: StimulusConfig
): [number, number, number] {
  const [S, dS, dF] = Y;
  const E = getStimulus(t, stimType, amp, freq, startOffset, duration, stimConfig);

  // dS/dt = dS
  const dydt_0 = dS;

  // m * S'' + gamma * S' + V'(S) = E(t) + beta * dF
  // S'' = (E + beta * dF - gamma * S' - V'(S)) / m
  const dydt_1 = (E + par.beta * dF - par.gamma * dS - getPotentialForce(S, par)) / par.m;

  // tauH * dF' = -dF + alpha * S' + eta * S
  // dF' = (-dF + alpha * S' + eta * S) / tauH
  const dydt_2 = (-dF + par.alpha * dS + par.eta * S) / par.tauH;

  return [dydt_0, dydt_1, dydt_2];
}

// Single step RK4 integration
export function rk4Step(
  t: number,
  dt: number,
  Y: [number, number, number],
  par: SystemParameters,
  stimType: StimulusType,
  amp: number,
  freq: number,
  startOffset?: number,
  duration?: number,
  stimConfig?: StimulusConfig
): [number, number, number] {
  const k1 = derivatives(t, Y, par, stimType, amp, freq, startOffset, duration, stimConfig);

  const Y_k2: [number, number, number] = [
    Y[0] + 0.5 * dt * k1[0],
    Y[1] + 0.5 * dt * k1[1],
    Y[2] + 0.5 * dt * k1[2],
  ];
  const k2 = derivatives(t + 0.5 * dt, Y_k2, par, stimType, amp, freq, startOffset, duration, stimConfig);

  const Y_k3: [number, number, number] = [
    Y[0] + 0.5 * dt * k2[0],
    Y[1] + 0.5 * dt * k2[1],
    Y[2] + 0.5 * dt * k2[2],
  ];
  const k3 = derivatives(t + 0.5 * dt, Y_k3, par, stimType, amp, freq, startOffset, duration, stimConfig);

  const Y_k4: [number, number, number] = [
    Y[0] + dt * k3[0],
    Y[1] + dt * k3[1],
    Y[2] + dt * k3[2],
  ];
  const k4 = derivatives(t + dt, Y_k4, par, stimType, amp, freq, startOffset, duration, stimConfig);

  return [
    Y[0] + (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
    Y[1] + (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    Y[2] + (dt / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
  ];
}

// Generate complete timeseries run
export function runSimulation(
  par: SystemParameters,
  stimType: StimulusType,
  amp: number,
  freq: number,
  duration: number = 30,
  dt: number = 0.05,
  initialY: [number, number, number] = [0, 0, 0],
  startOffset?: number,
  stimDuration?: number,
  stimConfig?: StimulusConfig
): SimulationPoint[] {
  const steps = Math.floor(duration / dt);
  const data: SimulationPoint[] = [];

  let Y = [...initialY] as [number, number, number];
  let t = 0;

  for (let step = 0; step <= steps; step++) {
    const S = Y[0];
    const dS = Y[1];
    const dF = Y[2];

    const E = getStimulus(t, stimType, amp, freq, startOffset, stimDuration, stimConfig);
    const V_S = getPotentialEnergy(S, par);

    // Calculate Hamiltonian / Energies
    // S' is state velocity. State momentum: P_S = m * S'
    // Historical momentum is modeled corresponding to tauH dynamic:
    // H = P_S^2 / (2m) + V(S) + 0.5 * dF^2 - beta * S * dF
    const P_S = par.m * dS;
    const P_H = par.tauH * dF; // Effective momentum
    const U_dF = 0.5 * dF * dF; // internal store
    const Hamiltonian = (P_S * P_S) / (2 * par.m) + V_S + U_dF - par.beta * S * dF;

    data.push({
      t: Number(t.toFixed(4)),
      E,
      S,
      dS,
      dF,
      Hamiltonian,
      P_S,
      P_H,
      U_dF,
      V_S,
    });

    // Advance
    Y = rk4Step(t, dt, Y, par, stimType, amp, freq, startOffset, stimDuration, stimConfig);
    t += dt;
  }

  return data;
}

// Run Interactive Clone Test
export function runCloneTest(
  par: SystemParameters,
  stimType: StimulusType,
  amp: number,
  freq: number,
  historyADrivingFreq: number,
  historyBDrivingFreq: number,
  dt: number = 0.05,
  startOffset?: number,
  duration?: number,
  stimConfig?: StimulusConfig
): {
  timeSeries: Array<{
    t: number;
    E: number;
    S_A: number;
    S_B: number;
    dF_A: number;
    dF_B: number;
    divergence: number;
  }>;
  finalDivergence: number;
  isCausallyDivergent: boolean;
} {
  // Step 1: Pre-run distinct history A and B with different driving frequencies to prime non-identical memory
  const historyDur = 20;
  const simA = runSimulation(par, stimType, amp, historyADrivingFreq, historyDur, dt, [0, 0, 0], startOffset, duration, stimConfig);
  const simB = runSimulation(par, stimType, amp, historyBDrivingFreq, historyDur, dt, [0, 0, 0], startOffset, duration, stimConfig);

  // Extract final state at t = historyDur
  // We synchronize the INSTANTANEOUS physical state (S_A, dS_A) = (S_B, dS_B)
  // but we PRESERVED their different history fields: dF_A != dF_B
  const finalA = simA[simA.length - 1];
  const finalB = simB[simB.length - 1];

  // Sincronization forcing: S_B will be clones of S_A
  const syncedS = finalA.S;
  const synced_dS = finalA.dS;

  const dF_A_init = finalA.dF;
  const dF_B_init = finalB.dF;

  // Let's run future predictions
  let Y_A: [number, number, number] = [syncedS, synced_dS, dF_A_init];
  let Y_B: [number, number, number] = [syncedS, synced_dS, dF_B_init];

  const testDuration = 15;
  const steps = Math.floor(testDuration / dt);
  const timeSeries = [];
  let t = 0;

  for (let k = 0; k < steps; k++) {
    const E = getStimulus(t, stimType, amp, freq, startOffset, duration, stimConfig); // Common future stimulus
    const div = Math.abs(Y_A[0] - Y_B[0]);

    timeSeries.push({
      t: Number(t.toFixed(4)),
      E,
      S_A: Y_A[0],
      S_B: Y_B[0],
      dF_A: Y_A[2],
      dF_B: Y_B[2],
      divergence: div,
    });

    // Advance both separately with identical parameters, under same common future stimulus
    Y_A = rk4Step(t, dt, Y_A, par, stimType, amp, freq, startOffset, duration, stimConfig);
    Y_B = rk4Step(t, dt, Y_B, par, stimType, amp, freq, startOffset, duration, stimConfig);
    t += dt;
  }

  const finalDiv = timeSeries[timeSeries.length - 1].divergence;

  return {
    timeSeries,
    finalDivergence: finalDiv,
    isCausallyDivergent: finalDiv > 0.05,
  };
}
