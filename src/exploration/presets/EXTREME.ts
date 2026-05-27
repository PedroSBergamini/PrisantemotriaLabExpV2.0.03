/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const EXTREME = {
  name: 'Extreme Persistence',
  beta: 4.5,
  tau: 30,
  dt: 0.005,
  t_end: 80,
  tag: 'UNSAFE',
  epistemic_mode: 'exploration',
  not_for_claims: true,
  description: 'Exploratory long-tail persistence regime'
} as const;
