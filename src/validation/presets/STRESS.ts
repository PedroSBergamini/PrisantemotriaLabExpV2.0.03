/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const STRESS = {
  name: 'Stress Test - High-Memory Regime',
  beta: 4.0,
  tau: 25,
  dt: 0.005,
  t_end: 80,
  repetitions: 10,
  tag: 'HIGH_MEMORY_REGIME',
  epistemic_warning: 'Extended persistence regime. Not baseline physics.',
  epistemic_mode: 'validation',
  scientific_use_only: true
} as const;
