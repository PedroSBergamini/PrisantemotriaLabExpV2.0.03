/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export * from './metrics/index';

export interface MetricSummary {
  mean: number;
  std: number;
}

export const PASS_CRITERIA = {
  PRELIMINARY: (exp: MetricSummary, ctrl: MetricSummary) =>
    exp.mean > (ctrl.mean + ctrl.std),

  STRICT: (exp: MetricSummary, ctrl: MetricSummary) =>
    exp.mean > (ctrl.mean + 2 * ctrl.std)
};

export function evaluatePass(exp: MetricSummary, ctrl: MetricSummary) {
  const preliminary = PASS_CRITERIA.PRELIMINARY(exp, ctrl);

  return {
    preliminary,
    level: preliminary
      ? 'PRELIMINARY_PASS'
      : 'FAIL'
  } as const;
}

