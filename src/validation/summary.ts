/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Computes consolidated cross-test statistics from validation run results.
 */
export function computeCrossTestSummary(results: Record<string, any>, total_runtime_s: number = 0) {
  const deltas: number[] = [];
  let totalMetricsCount = 0;
  let metricsPassedCount = 0;
  let overall_pass = true;

  for (const testId of Object.keys(results)) {
    const runResult = results[testId];
    if (runResult && Array.isArray(runResult.metrics)) {
      for (const m of runResult.metrics) {
        deltas.push(m.delta_percent);
        totalMetricsCount++;
        if (m.passed) {
          metricsPassedCount++;
        } else {
          overall_pass = false;
        }
      }
    }
  }

  if (totalMetricsCount === 0) {
    overall_pass = false;
  }

  // Calculate average delta %
  const average_delta_pct = deltas.length > 0 
    ? Number((deltas.reduce((sum, val) => sum + val, 0) / deltas.length).toFixed(2))
    : 0;

  // Calculate median delta %
  let median_delta_pct = 0;
  if (deltas.length > 0) {
    const sorted = [...deltas].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      median_delta_pct = Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2));
    } else {
      median_delta_pct = Number(sorted[mid].toFixed(2));
    }
  }

  const min_delta_pct = deltas.length > 0 ? Math.min(...deltas) : 0;
  const max_delta_pct = deltas.length > 0 ? Math.max(...deltas) : 0;
  
  const pass_rate = totalMetricsCount > 0 
    ? Number((metricsPassedCount / totalMetricsCount).toFixed(4))
    : 0;

  return {
    overall_pass,
    average_delta_pct,
    median_delta_pct,
    min_delta_pct,
    max_delta_pct,
    pass_rate,
    total_runtime_s
  };
}
