/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Metric #1 — Residual Energy
 * Measure post-stimulus persistence.
 * ResidualEnergy = integral(S² dt) from stimulus_off_time to simulation_end
 */
export function computeResidualEnergy(
  signal: number[],
  time: number[],
  tStimOff: number,
  dt: number = 0.05
): number {
  let sum = 0;
  for (let i = 0; i < signal.length; i++) {
    if (time[i] >= tStimOff) {
      sum += signal[i] * signal[i] * dt;
    }
  }
  return sum;
}

/**
 * Metric #2 — Relaxation Time
 * Measure how long the system remains dynamically active.
 * First t (after stimulus off) where |S(t)| < 0.01 * max(|S|) and stays below it.
 */
export function computeRelaxationTime(
  signal: number[],
  time: number[],
  tStimOff: number = 0
): number {
  const absoluteMax = Math.max(...signal.map(v => Math.abs(v)));
  if (absoluteMax < 1e-6) return 0;
  const limit = 0.01 * absoluteMax;

  // Search from end backward to find the last crossing of the 1% band
  let index = signal.length - 1;
  while (index >= 0 && Math.abs(signal[index]) < limit) {
    index--;
  }

  const relaxedIndex = index + 1;
  const relaxationTime = relaxedIndex < time.length ? time[relaxedIndex] : time[time.length - 1];

  return Math.max(0, relaxationTime - tStimOff);
}

/**
 * Metric #3 — Clone Divergence
 * Measure trajectory dependence on history.
 * RMS(S_H(t) - S_control(t))
 */
export function computeCloneDivergence(
  signalA: number[],
  signalB: number[]
): number {
  if (signalA.length === 0 || signalB.length === 0) return 0;
  let sumSq = 0;
  const len = Math.min(signalA.length, signalB.length);
  for (let i = 0; i < len; i++) {
    const diff = signalA[i] - signalB[i];
    sumSq += diff * diff;
  }
  return Math.sqrt(sumSq / len);
}

/**
 * Metric #4 — Spectral Stability
 * Measure robustness under colored noise.
 * Calculated as inverse low-frequency variance via DFT bins approach to avoid overengineering.
 */
export function computeSpectralStability(
  signal: number[],
  dt: number = 0.05
): number {
  if (signal.length === 0) return 0;

  const N = signal.length;
  // Discrete low-frequency bins (e.g. from 0.01 Hz to 0.1 Hz) to capture slow drift variance
  const lowFreqs = [0.01, 0.02, 0.04, 0.06, 0.08, 0.10];
  let lowPowerSum = 0;

  for (const f of lowFreqs) {
    let sumCos = 0;
    let sumSin = 0;
    for (let tIdx = 0; tIdx < N; tIdx++) {
      const angle = 2 * Math.PI * f * (tIdx * dt);
      sumCos += signal[tIdx] * Math.sin(angle);
      sumSin += signal[tIdx] * Math.cos(angle);
    }
    const power = (sumCos * sumCos + sumSin * sumSin) / N;
    lowPowerSum += power;
  }

  const variance = lowPowerSum / lowFreqs.length;
  return 1 / (variance + 1e-6);
}
