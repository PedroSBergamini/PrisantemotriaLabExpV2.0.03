/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FullReport } from './BatchRunner';

/**
 * Builds the academic plain-text formatted scientific report mimicking a PDF.
 */
export function buildPDFReportText(report: FullReport): string {
  const { manifest, metadata, summary, results, warnings } = report;
  
  const separator = "================================================================================";
  const subSeparator = "--------------------------------------------------------------------------------";

  const lines: string[] = [];
  lines.push(separator);
  lines.push("                 PRISANTEMOTRIA SCIENTIFIC VALIDATION REPORT");
  lines.push(`                          REGIME: ${metadata.preset}`);
  lines.push(`                        TIMESTAMP: ${metadata.timestamp}`);
  lines.push(separator);
  lines.push("");
  lines.push("1. COVERSHEET");
  lines.push(subSeparator);
  lines.push(`Operator System Signature : Prisantemotria Lab v2.2.1-Freeze`);
  lines.push(`Suite Unique Identifier   : ${manifest.suite_id}`);
  lines.push(`Validation Layer Version  : ${manifest.validation_layer_version}`);
  lines.push(`Epistemic Active Presets : ${metadata.preset}`);
  lines.push(`Analytical Run Count (runs_per_test)     : ${metadata.runs_per_test} repetitions per test`);
  lines.push(`Total Sub-Simulations (total_simulations) : ${(manifest.total_simulations !== undefined ? manifest.total_simulations : metadata.total_simulations)} RK4 passes`);
  lines.push(`Deterministic Rigor       : ${manifest.deterministic ? "ACTIVE (No random-seed drift)" : "INACTIVE"}`);
  lines.push(`Epistemic Safe Margin     : ${metadata.pass_criterion}`);
  lines.push(`Validation Status Result  : ${summary.overall_pass ? "PRELIMINARY_PASS" : "FAIL"}`);
  lines.push("");
  lines.push("EPISTEMIC DISCLAIMER & SCIENTIFIC ETHICS WARNING:");
  lines.push(`"${report.metadata.epistemic_mode === 'exploration' ? 'EXPLORATORY MODE — Not for scientific claims. ' : ''}This framework does not claim consciousness, metaphysics, or new physics; it provides reproducible instrumentation for studying trajectory-dependent persistence in nonlinear systems with explicit historical memory terms."`);
  lines.push("");
  lines.push("2. OVERALL EXECUTIVE SUMMARY / METRIC COMPRESSION");
  lines.push(subSeparator);
  lines.push(`- Consolidated Falsification Status : ${summary.overall_pass ? "APPROVED (PRELIMINARY_PASS 1-SIGMA)" : "NOT APPROVED (FAIL)"}`);
  lines.push(`- Statistical Metric Pass Rate      : ${(summary.pass_rate * 100).toFixed(2)}%`);
  lines.push(`- Calculated Run-Time Duration      : ${metadata.runtime_s}s`);
  lines.push(`- Mean Statistical Shift (Delta)   : ${summary.average_delta_pct}%`);
  lines.push(`- Median Statistical Shift (Delta) : ${summary.median_delta_pct}%`);
  lines.push(`- Min Observed Delta %              : ${summary.min_delta_pct}%`);
  lines.push(`- Max Observed Delta %              : ${summary.max_delta_pct}%`);
  lines.push("");

  // Section 3: Ghost
  lines.push("3. GHOST RESIDUAL PERSISTENCE (TEST 1)");
  lines.push(subSeparator);
  if (results.ghost) {
    const r = results.ghost;
    lines.push(`Test ID: ${r.id} | Class Name: ${r.name}`);
    lines.push(`Repetitions Executed: ${r.metadata.repetitions} | Solver: ${r.metadata.solver}`);
    lines.push("");
    lines.push("Calculated Observables:");
    r.metrics.forEach((m: any) => {
      lines.push(`  * ${m.metric.toUpperCase()}:`);
      lines.push(`    - Control mean       : ${m.control_mean} (std: ${m.control_std})`);
      lines.push(`    - Experimental mean  : ${m.experimental_mean} (std: ${m.experimental_std})`);
      lines.push(`    - Delta %            : ${m.delta_percent > 0 ? '+' : ''}${m.delta_percent}%`);
      lines.push(`    - Metric Rating      : ${m.passed ? 'PRELIMINARY_PASS' : 'FAIL'}`);
    });
  } else {
    lines.push("DNP (Did Not Play / Not Executed in Batch config)");
  }
  lines.push("");

  // Section 4: Clone
  lines.push("4. CLONE DIVERGENCE / TRAJECTORY DEPENDENCE (TEST 2)");
  lines.push(subSeparator);
  if (results.clone) {
    const r = results.clone;
    lines.push(`Test ID: ${r.id} | Class Name: ${r.name}`);
    lines.push(`Repetitions Executed: ${r.metadata.repetitions} | Solver: ${r.metadata.solver}`);
    lines.push("");
    lines.push("Calculated Observables:");
    r.metrics.forEach((m: any) => {
      lines.push(`  * ${m.metric.toUpperCase()}:`);
      lines.push(`    - Control mean       : ${m.control_mean} (std: ${m.control_std})`);
      lines.push(`    - Experimental mean  : ${m.experimental_mean} (std: ${m.experimental_std})`);
      lines.push(`    - Delta %            : ${m.delta_percent > 0 ? '+' : ''}${m.delta_percent}%`);
      lines.push(`    - Metric Rating      : ${m.passed ? 'PRELIMINARY_PASS' : 'FAIL'}`);
    });
  } else {
    lines.push("DNP (Did Not Play / Not Executed in Batch config)");
  }
  lines.push("");

  // Section 5: Noise
  lines.push("5. NOISE ROBUSTNESS UNDER PINK NOISE (TEST 3)");
  lines.push(subSeparator);
  if (results.noise) {
    const r = results.noise;
    lines.push(`Test ID: ${r.id} | Class Name: ${r.name}`);
    lines.push(`Repetitions Executed: ${r.metadata.repetitions} | Solver: ${r.metadata.solver}`);
    lines.push("");
    lines.push("Calculated Observables:");
    r.metrics.forEach((m: any) => {
      lines.push(`  * ${m.metric.toUpperCase()}:`);
      lines.push(`    - Control mean       : ${m.control_mean} (std: ${m.control_std})`);
      lines.push(`    - Experimental mean  : ${m.experimental_mean} (std: ${m.experimental_std})`);
      lines.push(`    - Delta %            : ${m.delta_percent > 0 ? '+' : ''}${m.delta_percent}%`);
      lines.push(`    - Metric Rating      : ${m.passed ? 'PRELIMINARY_PASS' : 'FAIL'}`);
    });
  } else {
    lines.push("DNP (Did Not Play / Not Executed in Batch config)");
  }
  lines.push("");

  // Section 6: Warnings
  lines.push("6. NUMERICAL STABILIZATION WARNINGS AND ALERTS");
  lines.push(subSeparator);
  if (warnings && warnings.length > 0) {
    warnings.forEach((w, idx) => {
      lines.push(`[WARNING #${idx + 1}] ${w}`);
    });
  } else {
    lines.push("No active warnings. Differential solver operated within stable nominal bonds.");
  }
  lines.push("");

  // Section 7: Metadata
  lines.push("7. ENVIRONMENTAL METADATA");
  lines.push(subSeparator);
  lines.push(`- Engine Runtime Environment : NodeJS 22 + React 19`);
  lines.push(`- Solver Core Algorithmic     : Runge-Kutta 4th Order Vector Integration`);
  lines.push(`- Seed Step Intervalation     : ${manifest.seed_strategy}`);
  lines.push(`- Framework Standards Label   : Prisantemotria Lab v2.2.1-Freeze`);
  lines.push(`- Report Signature Sha256     : sha256_compiled_verification_placeholder`);
  lines.push(separator);

  return lines.join("\n");
}

/**
 * Builds the consolidated, flat CSV for all metrics.
 */
export function buildCSVReportText(report: FullReport): string {
  const lines: string[] = [];
  lines.push(`"runs_per_test",${report.metadata.runs_per_test}`);
  lines.push(`"total_simulations",${report.manifest.total_simulations !== undefined ? report.manifest.total_simulations : report.metadata.total_simulations}`);
  lines.push('');
  lines.push('test_id,metric,control_mean,control_std,experimental_mean,experimental_std,delta_pct,pass');
  for (const testId of Object.keys(report.results)) {
    const testRun = report.results[testId];
    if (testRun && Array.isArray(testRun.metrics)) {
      for (const m of testRun.metrics) {
        lines.push(`${testId},${m.metric},${m.control_mean},${m.control_std},${m.experimental_mean},${m.experimental_std},${m.delta_percent},${m.passed ? 'PRELIMINARY_PASS' : 'FAIL'}`);
      }
    }
  }
  return lines.join('\n');
}

/**
 * Main export handler.
 */
export function exportFullReport(
  report: FullReport,
  format: 'json' | 'csv' | 'pdf'
): string {
  if (format === 'json') {
    return JSON.stringify(report, null, 2);
  } else if (format === 'csv') {
    return buildCSVReportText(report);
  } else {
    return buildPDFReportText(report);
  }
}
