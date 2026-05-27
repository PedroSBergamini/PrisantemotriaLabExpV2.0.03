/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FullReport } from '../BatchRunner';
import { exportFullReport } from '../ReportGenerator';

/**
 * Persists validation files to local filesystem simulated keys to retain run histories.
 */
export function saveReportToHistory(report: FullReport) {
  const timestampClean = report.metadata.timestamp.replace(/[:.]/g, '-');
  
  const jsonName = `/validation-history/validation_full_${timestampClean}.json`;
  const csvName = `/validation-history/validation_full_${timestampClean}.csv`;
  const pdfName = `/validation-history/validation_full_${timestampClean}.pdf`;

  // Retreive existing history registry safely
  let registry: string[] = [];
  try {
    const rawRegistry = localStorage.getItem('prisantemotria_history_registry');
    if (rawRegistry) {
      registry = JSON.parse(rawRegistry);
    }
  } catch (e) {
    registry = [];
  }

  // Check if they already exist to never overwrite prior files
  if (!registry.includes(jsonName)) {
    try {
      const jsonContent = exportFullReport(report, 'json');
      const csvContent = exportFullReport(report, 'csv');
      const pdfContent = exportFullReport(report, 'pdf');

      localStorage.setItem(jsonName, jsonContent);
      localStorage.setItem(csvName, csvContent);
      localStorage.setItem(pdfName, pdfContent);

      registry.push(jsonName);
      localStorage.setItem('prisantemotria_history_registry', JSON.stringify(registry));
    } catch (err) {
      console.warn("Could not save to localStorage, quota exceeded.", err);
    }
  }

  return {
    jsonFilename: jsonName,
    csvFilename: csvName,
    pdfFilename: pdfName
  };
}

/**
 * Retrieves list of persisted JSON file paths.
 */
export function getSavedReportsList(): string[] {
  try {
    const rawRegistry = localStorage.getItem('prisantemotria_history_registry');
    return rawRegistry ? JSON.parse(rawRegistry) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Safely read a persisted file content by path.
 */
export function readPersistedFile(path: string): string | null {
  try {
    return localStorage.getItem(path);
  } catch (e) {
    return null;
  }
}
