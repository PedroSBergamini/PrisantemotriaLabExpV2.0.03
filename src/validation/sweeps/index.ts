/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { runSimulation } from '../../simulator/ode';
import { computeResidualEnergy } from '../metrics/index';
import { SystemParameters } from '../../shared/types/index';

export interface SweepPoint {
  beta: number;
  tauH: number;
  residualEnergy: number;
}

/**
 * Runs a deterministic parameter sweep across beta and tauH parameter spaces.
 * beta ranges from 0 to 5 in steps of 0.5
 * tauH ranges from 1 to 20 in steps of 1.0
 */
export function runParameterSweep(
  baseParams: Omit<SystemParameters, 'beta' | 'tauH'>
): SweepPoint[] {
  const points: SweepPoint[] = [];

  const betas = [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
  const tauHs = Array.from({ length: 20 }, (_, i) => i + 1); // [1, 2, ..., 20]

  const stimType = 'pulse';
  const amp = 2.0;
  const freq = 0.05;
  const duration = 18.0;
  const dt = 0.05;

  const startOffset = 2.0;
  const stimDuration = 3.0;
  const tOff = startOffset + stimDuration; // 5.0
  const stimConfig = {
    type: 'pulse' as const,
    amp,
    freq,
    startOffset,
    duration: stimDuration,
    dutyCycle: 1.0,
    riseTime: 0.5,
    fallTime: 0.5
  };

  for (const beta of betas) {
    for (const tauH of tauHs) {
      // Assemble full SystemParameters package
      const par: SystemParameters = {
        m: baseParams.m ?? 1.0,
        gamma: baseParams.gamma ?? 0.1,
        potential: baseParams.potential ?? 'double_well',
        beta,
        tauH,
        alpha: baseParams.alpha ?? 1.2,
        eta: baseParams.eta ?? 0.4,
        V_height: baseParams.V_height ?? 0.7
      };

      const pointsSeries = runSimulation(
        par,
        stimType,
        amp,
        freq,
        duration,
        dt,
        [0, 0, 0],
        startOffset,
        stimDuration,
        stimConfig
      );

      const signal = pointsSeries.map(p => p.S);
      const times = pointsSeries.map(p => p.t);

      const energy = computeResidualEnergy(signal, times, tOff, dt);

      points.push({
        beta,
        tauH,
        residualEnergy: Number(energy.toFixed(5))
      });
    }
  }

  return points;
}

/**
 * Formats a list of SweepPoints as an RFC-4180 CSV spreadsheet.
 */
export function convertSweepToCSV(points: SweepPoint[]): string {
  const lines: string[] = [];
  lines.push('"Beta (Historical Coupling)","Tau_H (Memory Horizon)","Residual Energy (persistence Integral)"');
  for (const p of points) {
    lines.push(`${p.beta},${p.tauH},${p.residualEnergy}`);
  }
  return lines.join('\n');
}
