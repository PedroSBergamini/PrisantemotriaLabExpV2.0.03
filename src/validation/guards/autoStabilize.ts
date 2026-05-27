/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SimulationConfig {
  beta: number;
  tau: number;
  dt: number;
  t_end: number;
  repetitions?: number;
  noise?: string;
  noiseAmp?: number;
  amplitude?: number;
  tag?: string;
  name?: string;
  epistemic_mode?: string;
  epistemic_warning?: string;
  scientific_use_only?: boolean;
  not_for_claims?: boolean;
  description?: string;
  [key: string]: any;
}

export function stabilize(config: SimulationConfig) {
  const warnings: string[] = [];
  const next = { ...config };

  if (next.dt > 0.02 && next.beta > 3) {
    next.dt = 0.01;
    warnings.push('dt reduced for numerical stability');
  }

  if (next.t_end < 40 && next.beta > 3) {
    next.t_end = 60;
    warnings.push('t_end extended for relaxation analysis');
  }

  if (next.beta > 4.5) {
    next.beta = 4.5;
    warnings.push('β reduced to 4.5: unsafe regime');
  }

  return {
    config: next,
    warnings
  };
}

import { ValidationTest } from '../types';

export function adaptTestWithPreset(test: ValidationTest, preset: any) {
  const { config: stabilized, warnings } = stabilize(preset);

  const reps = stabilized.repetitions !== undefined ? stabilized.repetitions : test.repetitions;

  const adaptedTest: ValidationTest = {
    ...test,
    repetitions: reps,
    setup: {
      ...test.setup,
      dt: stabilized.dt,
      duration: stabilized.t_end,
      amp: stabilized.amplitude !== undefined ? stabilized.amplitude : test.setup.amp,
      par: {
        ...test.setup.par,
        beta: stabilized.beta,
        tauH: stabilized.tau !== undefined ? stabilized.tau : test.setup.par.tauH
      }
    },
    control: {
      ...test.control,
      dt: stabilized.dt,
      duration: stabilized.t_end,
      amp: stabilized.amplitude !== undefined ? stabilized.amplitude : test.control.amp,
      par: {
        ...test.control.par,
        tauH: stabilized.tau !== undefined ? Math.min(stabilized.tau, 4.0) : test.control.par.tauH
      }
    }
  };

  if (stabilized.noise) {
    if (adaptedTest.setup.stimConfig) {
      adaptedTest.setup.stimConfig = {
        ...adaptedTest.setup.stimConfig,
        noiseColor: stabilized.noise as "white" | "pink" | "red"
      };
    }
    if (stabilized.noiseAmp !== undefined) {
      adaptedTest.setup.amp = stabilized.noiseAmp;
      if (adaptedTest.setup.stimConfig) {
        adaptedTest.setup.stimConfig.amp = stabilized.noiseAmp;
      }
    }
  }

  return {
    adaptedTest,
    warnings
  };
}

