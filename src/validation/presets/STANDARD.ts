/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const STANDARD = {
  name: 'Standard Validation',
  beta: 1.5,
  tau: 8,
  dt: 0.01,
  t_end: 60,
  repetitions: 20,
  tag: 'BASELINE_VALIDATION',
  epistemic_mode: 'validation',
  scientific_use_only: true
} as const;
