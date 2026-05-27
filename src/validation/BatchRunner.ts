/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ValidationTest, ValidationRunResult } from './types';
import { runValidationTest } from './suite/index';
import { ghostResidualTest } from './tests/ghostResidual.test';
import { cloneDivergenceTest } from './tests/cloneDivergence.test';
import { noiseRobustnessTest } from './tests/noiseRobustness.test';
import { VALIDATION_PRESETS, ValidationPresetKey } from './presets/index';
import { adaptTestWithPreset } from './guards/autoStabilize';
import { computeCrossTestSummary } from './summary';

export interface BatchConfig {
  tests: ('ghost' | 'clone' | 'noise')[];
  runs: number; // default 20, min 5, max 100
  preset: 'STANDARD' | 'ENHANCED' | 'STRESS';
  epistemic_mode?: 'validation' | 'exploration';
}

export interface RunManifest {
  suite_id: string;
  validation_layer_version: string;
  tests_executed: string[];
  total_simulations: number;
  deterministic: boolean;
  seed_strategy: 'fixed_incremental';
  epistemic_mode: 'validation' | 'exploration';
}

export interface FullReport {
  manifest: RunManifest;
  metadata: any;
  summary: any;
  results: Record<string, any>;
  warnings: string[];
  aborted?: boolean;
}

/**
 * Headless consolidado Batch Runner for running multi-repetition validation suites.
 */
export async function runBatch(
  config: BatchConfig,
  signal?: AbortSignal,
  onProgress?: (testId: string, testName: string, currentRun: number, progressPercent: number, etaSeconds: number) => void
): Promise<FullReport> {
  const tStart = performance.now();

  // Clamp runs between 5 and 100
  const runs = Math.max(5, Math.min(100, typeof config.runs === 'number' ? config.runs : 20));
  const activePresetKey = config.preset || 'STANDARD';
  const activePreset = VALIDATION_PRESETS[activePresetKey as ValidationPresetKey] || VALIDATION_PRESETS.STANDARD;
  const testKeys = config.tests && config.tests.length > 0 ? config.tests : ['ghost', 'clone', 'noise'];

  const testMap: Record<string, ValidationTest> = {
    ghost: ghostResidualTest,
    clone: cloneDivergenceTest,
    noise: noiseRobustnessTest
  };

  const testsToRun = testKeys
    .map(key => ({ key, test: testMap[key] }))
    .filter(item => item.test !== undefined);

  const results: Record<string, ValidationRunResult> = {};
  const allWarnings: string[] = [];

  const totalRuns = testsToRun.length * runs;
  let runsCompletedSoFar = 0;
  let isAborted = false;

  try {
    for (let i = 0; i < testsToRun.length; i++) {
      if (signal?.aborted) {
        isAborted = true;
        break;
      }

      const { key, test } = testsToRun[i];
      
      // Adapt configuration metrics with preset
      const { adaptedTest, warnings: presetWarnings } = adaptTestWithPreset(test, activePreset);
      
      // Override repetitions to match configured runs explicitly
      adaptedTest.repetitions = runs;

      if (presetWarnings && presetWarnings.length > 0) {
        allWarnings.push(...presetWarnings);
      }

      // Call validation test
      try {
        const testResult = await runValidationTest(
          adaptedTest,
          activePreset,
          presetWarnings,
          signal,
          (repCount) => {
            const elapsed = (performance.now() - tStart) / 1000;
            const runsDone = runsCompletedSoFar + repCount;
            const progressPercent = Math.min(100, Math.floor((runsDone / totalRuns) * 100));
            let etaSeconds = 0;
            if (runsDone > 0) {
              const secPerRun = elapsed / runsDone;
              etaSeconds = Math.max(0, Math.ceil(secPerRun * (totalRuns - runsDone)));
            }

            onProgress?.(key, test.name, repCount, progressPercent, etaSeconds);
          }
        );

        runsCompletedSoFar += runs;
        results[key] = testResult;
      } catch (err: any) {
        if (signal?.aborted || err.message === 'Simulation aborted') {
          isAborted = true;
          break;
        } else {
          throw err;
        }
      }

      // Yield periodic
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  } catch (err: any) {
    if (signal?.aborted || err.message === 'Simulation aborted') {
      isAborted = true;
    } else {
      throw err;
    }
  }

  const tEnd = performance.now();
  const runtime_s = parseFloat(((tEnd - tStart) / 1000).toFixed(4));

  // Compute Cross Test Summary
  const summary = computeCrossTestSummary(results, runtime_s);

  // Compile Global Metadata
  const globalMetadata = {
    timestamp: new Date().toISOString(),
    version: '0.0.0', // package.json's version is "0.0.0"
    git_commit: 'v2.2.1-Freeze',
    preset: activePresetKey,
    runs_per_test: runs,
    total_simulations: totalRuns,
    runtime_s,
    pass_criterion: 'PRELIMINARY_1SIGMA',
    epistemic_mode: config.epistemic_mode || 'validation',
    not_for_claims: Boolean(config.epistemic_mode === 'exploration' || activePresetKey === 'STRESS'),
    warnings: allWarnings
  };

  const manifest: RunManifest = {
    suite_id: `suite_${Date.now()}`,
    validation_layer_version: 'v2.2.1',
    tests_executed: Object.keys(results).map(k => testMap[k].name),
    total_simulations: totalRuns,
    deterministic: true,
    seed_strategy: 'fixed_incremental',
    epistemic_mode: config.epistemic_mode ?? 'validation'
  };

  return {
    manifest,
    metadata: globalMetadata,
    summary,
    results,
    warnings: allWarnings,
    aborted: isAborted || undefined
  };
}
