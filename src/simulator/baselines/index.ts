/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SimulationPoint, SystemParameters, StimulusType } from '../../shared/types/index';
import { runSimulation } from '../ode';
import { SimulationModel } from '../models/index';

/**
 * Baseline 1: Markovian Baseline
 * Decouples historical variable H(t) / \Delta F by parameterizing beta = 0.
 */
export class MarkovianModel implements SimulationModel {
  name = 'Markovian Decoupled';
  description = 'Decoupled memory variable (beta = 0) retaining true potential and dynamics.';

  simulate(
    par: SystemParameters,
    stimType: StimulusType,
    amp: number,
    freq: number,
    duration = 30,
    dt = 0.05,
    initialY: [number, number, number] = [0, 0, 0],
    startOffset?: number,
    stimDuration?: number,
    stimConfig?: any
  ): SimulationPoint[] {
    const markovParams: SystemParameters = { ...par, beta: 0 };
    return runSimulation(
      markovParams,
      stimType,
      amp,
      freq,
      duration,
      dt,
      initialY,
      startOffset,
      stimDuration,
      stimConfig
    );
  }
}

/**
 * Baseline 2: Linear Harmonic Oscillator Baseline
 * Eliminates the double-well non-linear potential, resolving a simple harmonic oscillator.
 */
export class LinearOscillatorModel implements SimulationModel {
  name = 'Linear Oscillator';
  description = 'Simple harmonic single-well potential (potential = harmonic) with coupled physics.';

  simulate(
    par: SystemParameters,
    stimType: StimulusType,
    amp: number,
    freq: number,
    duration = 30,
    dt = 0.05,
    initialY: [number, number, number] = [0, 0, 0],
    startOffset?: number,
    stimDuration?: number,
    stimConfig?: any
  ): SimulationPoint[] {
    const linearParams: SystemParameters = { ...par, potential: 'harmonic' };
    return runSimulation(
      linearParams,
      stimType,
      amp,
      freq,
      duration,
      dt,
      initialY,
      startOffset,
      stimDuration,
      stimConfig
    );
  }
}

/**
 * Baseline 3: Double-Well without H(t) Memory
 * Forcing double-well potential with beta = 0 to measure purely memoryless transition loops.
 */
export class DoubleWellWithoutMemoryModel implements SimulationModel {
  name = 'Double-Well without Memory';
  description = 'Double-well potential with decoupled history delta F (beta = 0).';

  simulate(
    par: SystemParameters,
    stimType: StimulusType,
    amp: number,
    freq: number,
    duration = 30,
    dt = 0.05,
    initialY: [number, number, number] = [0, 0, 0],
    startOffset?: number,
    stimDuration?: number,
    stimConfig?: any
  ): SimulationPoint[] {
    const doubleWellParams: SystemParameters = { ...par, potential: 'double_well', beta: 0 };
    return runSimulation(
      doubleWellParams,
      stimType,
      amp,
      freq,
      duration,
      dt,
      initialY,
      startOffset,
      stimDuration,
      stimConfig
    );
  }
}

/**
 * Baseline 4: Simple Backlash Hysteresis Model
 * Traditional play hysteresis backlash logic generating standard trajectory coordinates.
 */
export class SimpleHysteresisModel implements SimulationModel {
  name = 'Simple Backlash';
  description = 'Traditional mechanical backlash play hysteresis simulation.';

  simulate(
    par: SystemParameters,
    stimType: StimulusType,
    amp: number,
    freq: number,
    duration = 30,
    dt = 0.05,
    initialY: [number, number, number] = [0, 0, 0],
    startOffset?: number,
    stimDuration?: number,
    stimConfig?: any
  ): SimulationPoint[] {
    // Generate a standard run to get the stimulus E-series first
    const controlPoints = runSimulation(
      { ...par, beta: 0 },
      stimType,
      amp,
      freq,
      duration,
      dt,
      initialY,
      startOffset,
      stimDuration,
      stimConfig
    );

    const backlash = 0.5;
    let currentS = initialY[0];
    const points: SimulationPoint[] = [];

    for (const p of controlPoints) {
      const u = p.E;
      // Traditional backlash formula
      if (u - currentS > backlash) {
        currentS = u - backlash;
      } else if (u - currentS < -backlash) {
        currentS = u + backlash;
      }

      points.push({
        t: p.t,
        E: u,
        S: currentS,
        dS: 0,
        dF: 0,
        Hamiltonian: p.Hamiltonian,
        P_S: 0,
        P_H: 0,
        U_dF: 0,
        V_S: 0
      });
    }

    return points;
  }
}
