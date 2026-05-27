/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const TRAUMA = {
  name: 'Trauma Saturation',
  beta: 5.0,
  tau: 30,
  amplitude: 4.0,
  dt: 0.005,
  t_end: 80,
  tag: 'EXPERIMENTAL',
  epistemic_mode: 'exploration',
  not_for_claims: true,
  description: 'High-energy exploratory persistence regime'
} as const;
