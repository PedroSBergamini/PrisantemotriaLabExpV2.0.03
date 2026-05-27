/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ValidationTest, ValidationRunResult, ValidationMetricResult, FailureEvent, MetricType, SimulationConfig } from '../types';
import { runSimulation, runCloneTest } from '../../simulator/ode';
import { computeResidualEnergy, computeRelaxationTime, computeCloneDivergence, computeSpectralStability, mean, std } from '../metrics/index';
import { seededRandom } from '../../shared/seeds/index';

/**
 * Checks if a simulation point list contains invalid values.
 */
function checkSimulationFailure(points: any[]): string | null {
  if (points.length === 0) return 'Empty points series';
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    // Check for NaN or Infinity in structural fields
    if (isNaN(p.S) || !isFinite(p.S) || isNaN(p.dS) || !isFinite(p.dS) || isNaN(p.dF) || !isFinite(p.dF)) {
      return `Numerical instability (NaN/Infinity) at index ${i} (t = ${p.t})`;
    }
    // Check solver explosion boundary (e.g. state S blows past 100)
    if (Math.abs(p.S) > 100) {
      return `Solver explosion detected (S = ${p.S} exceeded maximum stable limit 100)`;
    }
  }
  return null;
}

/**
 * Executes a simulation from config and optional deterministic initial state.
 */
function executeSimulation(config: SimulationConfig, initialY?: [number, number, number]) {
  const dt = config.dt || 0.05;
  const duration = config.duration || 30.0;
  const y0 = initialY || config.initialY || [0, 0, 0];
  return runSimulation(
    config.par,
    config.stimType,
    config.amp,
    config.freq,
    duration,
    dt,
    y0,
    config.startOffset,
    config.stimDuration,
    config.stimConfig
  );
}

/**
 * Executes one scientific validation test and returns its aggregated metrics.
 */
export async function runValidationTest(test: ValidationTest): Promise<ValidationRunResult> {
  const repetitions = test.repetitions || 5;
  const seedBase = test.seed_base || 100;
  const failures: FailureEvent[] = [];

  // Metrics history
  const expResults: Record<MetricType, number[]> = {
    residual_energy: [],
    relaxation_time: [],
    clone_divergence: [],
    spectral_stability: []
  };

  const ctlResults: Record<MetricType, number[]> = {
    residual_energy: [],
    relaxation_time: [],
    clone_divergence: [],
    spectral_stability: []
  };

  const rawRuns: any[] = [];

  for (let rep = 0; rep < repetitions; rep++) {
    const seed = seedBase + rep;
    const rand = seededRandom(seed);

    // Apply a deterministic small perturbation to state variables to run statistical ensembles
    const pertS = (rand() - 0.5) * 0.04;  // [-0.02, 0.02]
    const pertDS = (rand() - 0.5) * 0.04;
    const pertDF = (rand() - 0.5) * 0.04;
    const initY: [number, number, number] = [pertS, pertDS, pertDF];

    try {
      // 1. Run experimental
      let expS: number[] = [];
      let expT: number[] = [];
      let expPoints: any[] = [];

      let ctlS: number[] = [];
      let ctlT: number[] = [];
      let ctlPoints: any[] = [];

      // If clone divergence, we run clone tests
      if (test.metrics.includes('clone_divergence')) {
        const freqA = 0.05 + rand() * 0.02; // slightly perturb driving history frequencies
        const freqB = 0.15 + rand() * 0.02;

        const expClone = runCloneTest(
          test.setup.par,
          test.setup.stimType,
          test.setup.amp,
          test.setup.freq,
          freqA,
          freqB,
          test.setup.dt || 0.05,
          test.setup.startOffset,
          test.setup.stimDuration,
          test.setup.stimConfig
        );

        const ctlClone = runCloneTest(
          test.control.par,
          test.control.stimType,
          test.control.amp,
          test.control.freq,
          freqA,
          freqB,
          test.control.dt || 0.05,
          test.control.startOffset,
          test.control.stimDuration,
          test.control.stimConfig
        );

        // Verification
        const expFail = expClone.timeSeries.length === 0 ? "Empty clone test timeseries" : null;
        if (expFail) throw new Error(expFail);

        expS = expClone.timeSeries.map(p => p.S_A);
        expT = expClone.timeSeries.map(p => p.t);
        const expS_B = expClone.timeSeries.map(p => p.S_B);

        ctlS = ctlClone.timeSeries.map(p => p.S_A);
        ctlT = ctlClone.timeSeries.map(p => p.t);
        const ctlS_B = ctlClone.timeSeries.map(p => p.S_B);

        if (test.metrics.includes('clone_divergence')) {
          expResults.clone_divergence.push(computeCloneDivergence(expS, expS_B));
          ctlResults.clone_divergence.push(computeCloneDivergence(ctlS, ctlS_B));
        }

        if (rep === 0) {
          rawRuns.push({
            repetition: rep,
            expPoints: expClone.timeSeries,
            ctlPoints: ctlClone.timeSeries
          });
        }
      } else {
        // Run standard simulation
        expPoints = executeSimulation(test.setup, initY);
        const expFailureMsg = checkSimulationFailure(expPoints);
        if (expFailureMsg) {
          throw new Error(`Experimental: ${expFailureMsg}`);
        }

        ctlPoints = executeSimulation(test.control, initY);
        const ctlFailureMsg = checkSimulationFailure(ctlPoints);
        if (ctlFailureMsg) {
          throw new Error(`Control: ${ctlFailureMsg}`);
        }

        expS = expPoints.map(p => p.S);
        expT = expPoints.map(p => p.t);

        ctlS = ctlPoints.map(p => p.S);
        ctlT = ctlPoints.map(p => p.t);

        const tOff = (test.setup.startOffset || 0.0) + (test.setup.stimDuration || 0.0);
        const dt = test.setup.dt || 0.05;

        if (test.metrics.includes('residual_energy')) {
          expResults.residual_energy.push(computeResidualEnergy(expS, expT, tOff, dt));
          ctlResults.residual_energy.push(computeResidualEnergy(ctlS, ctlT, tOff, dt));
        }

        if (test.metrics.includes('relaxation_time')) {
          expResults.relaxation_time.push(computeRelaxationTime(expS, expT, tOff));
          ctlResults.relaxation_time.push(computeRelaxationTime(ctlS, ctlT, tOff));
        }

        if (test.metrics.includes('spectral_stability')) {
          expResults.spectral_stability.push(computeSpectralStability(expS, dt));
          ctlResults.spectral_stability.push(computeSpectralStability(ctlS, dt));
        }

        if (rep === 0) {
          rawRuns.push({
            repetition: rep,
            expPoints,
            ctlPoints
          });
        }
      }

    } catch (err: any) {
      failures.push({
        repetition: rep,
        reason: err.message || 'Unknown integration error',
        params: { setup: test.setup.par, control: test.control.par },
        timestamp: new Date().toISOString()
      });
    }
  }

  // Aggregate stats across passing repetitions
  const validationMetrics: ValidationMetricResult[] = [];

  for (const metric of test.metrics) {
    const listExp = expResults[metric];
    const listCtl = ctlResults[metric];

    if (listExp.length > 0 && listCtl.length > 0) {
      const avgExp = mean(listExp);
      const stdExp = std(listExp, avgExp);

      const avgCtl = mean(listCtl);
      const stdCtl = std(listCtl, avgCtl);

      // Compute Delta %
      let deltaPercent = 0;
      if (avgCtl !== 0) {
        deltaPercent = ((avgExp - avgCtl) / Math.abs(avgCtl)) * 100;
      } else if (avgExp !== 0) {
        deltaPercent = 100; // default indicator
      }

      validationMetrics.push({
        metric,
        control_mean: Number(avgCtl.toFixed(4)),
        control_std: Number(stdCtl.toFixed(4)),
        experimental_mean: Number(avgExp.toFixed(4)),
        experimental_std: Number(stdExp.toFixed(4)),
        delta_percent: Number(deltaPercent.toFixed(2)),
        passed: true // Will assert below
      });
    }
  }

  // Assertion Evaluation
  const allPassed = test.assertion ? test.assertion(validationMetrics) : true;
  validationMetrics.forEach(m => {
    // Each metric check completes the test constraint
    m.passed = allPassed;
  });

  return {
    id: test.id,
    name: test.name,
    metadata: {
      timestamp: new Date().toISOString(),
      version: 'v2.1',
      solver: 'RK4',
      dt: test.setup.dt || 0.05,
      seed_base: seedBase,
      repetitions
    },
    metrics: validationMetrics,
    raw_runs: rawRuns,
    failures
  };
}
