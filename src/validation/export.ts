/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ValidationRunResult } from './types';

/**
 * Converts a ValidationRunResult into standard RFC-4180 CSV format.
 */
export function convertResultToCSV(result: ValidationRunResult): string {
  const lines: string[] = [];

  // Metadata Section
  lines.push(`"Scientific Validation Report","Prisantemotria Lab v2.1"`);
  lines.push(`"Test Identifier","${result.id}"`);
  lines.push(`"Test Class Title","${result.name}"`);
  lines.push(`"Report Timestamp","${result.metadata.timestamp}"`);
  lines.push(`"Framework Version","${result.metadata.version}"`);
  lines.push(`"ODE Integrator","${result.metadata.solver}"`);
  lines.push(`"Delta-T (s)","${result.metadata.dt}"`);
  lines.push(`"Randomizer Base Seed","${result.metadata.seed_base}"`);
  lines.push(`"Deterministic Replications","${result.metadata.repetitions}"`);
  lines.push('');

  // Metrics Table Header
  lines.push('"Metric Key","Control Group Mean (\u03BC)","Control Group Std (\u03C3)","Experimental Group Mean (\u03BC)","Experimental Group Std (\u03C3)","Statistical Delta (%)","Falsification Passed"');

  // Metrics Rows
  for (const m of result.metrics) {
    lines.push(`"${m.metric}",${m.control_mean},${m.control_std},${m.experimental_mean},${m.experimental_std},${m.delta_percent},"${m.passed ? 'PASSED' : 'FAILED'}"`);
  }

  lines.push('');

  // Failures segment
  if (result.failures.length > 0) {
    lines.push('"Logged Failures / Solver Exceptions"');
    lines.push('"Repetition Index","Timestamp","Triggering Exception"');
    for (const f of result.failures) {
      lines.push(`${f.repetition},"${f.timestamp}","${f.reason.replace(/"/g, '""')}"`);
    }
  } else {
    lines.push('"Logged Failures / Solver Exceptions","None (RK4 simulation group perfectly stable)"');
  }

  return lines.join('\n');
}

/**
 * Initiates a standard client-side file download of raw data string using an anchor element.
 */
export function downloadValidationAsset(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
