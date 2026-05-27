/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const NOISE = {
  name: 'Noise Robustness',
  beta: 2.5,
  tau: 15,
  noise: 'pink',
  noiseAmp: 0.3,
  dt: 0.01,
  t_end: 60,
  tag: 'RESEARCH',
  epistemic_mode: 'exploration',
  not_for_claims: true,
  description: 'Spectral robustness exploratory regime'
} as const;
