/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SimulationPoint } from '../../shared/types/index';

/**
 * Computes high-level scientific summaries of a simulation run.
 */
export function summarizeRun(points: SimulationPoint[]): {
  duration: number;
  maxS: number;
  minS: number;
  meanS: number;
  bistabilityIndex: number;
} {
  if (points.length === 0) {
    return { duration: 0, maxS: 0, minS: 0, meanS: 0, bistabilityIndex: 0 };
  }

  const values = points.map(p => p.S);
  const maxS = Math.max(...values);
  const minS = Math.min(...values);
  const meanS = values.reduce((sum, v) => sum + v, 0) / values.length;

  // Estimate density concentration around wells (e.g. at roughly -0.8 and +0.8) to measure bi-stability
  let leftWellPoints = 0;
  let rightWellPoints = 0;
  for (const v of values) {
    if (v < -0.3) leftWellPoints++;
    if (v > 0.3) rightWellPoints++;
  }

  const bistabilityIndex = (leftWellPoints > 0 && rightWellPoints > 0)
    ? (Math.min(leftWellPoints, rightWellPoints) / points.length) * 2
    : 0;

  return {
    duration: points[points.length - 1].t - points[0].t,
    maxS: Number(maxS.toFixed(4)),
    minS: Number(minS.toFixed(4)),
    meanS: Number(meanS.toFixed(4)),
    bistabilityIndex: Number(bistabilityIndex.toFixed(4))
  };
}
