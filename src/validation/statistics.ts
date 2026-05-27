/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Computes the mean value of an array of numbers.
 */
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Computes the sample standard deviation of an array of numbers.
 */
export function std(values: number[], mu?: number): number {
  if (values.length <= 1) return 0;
  const avg = mu !== undefined ? mu : mean(values);
  const variance = values.reduce((sum, v) => sum + (v - avg) * (v - avg), 0) / (values.length - 1);
  return Math.sqrt(variance);
}
