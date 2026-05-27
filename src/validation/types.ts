/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SystemParameters, StimulusType } from '../types';
import { StimulusConfig } from '../simulator/stimulus';

export interface SimulationConfig {
  par: SystemParameters;
  stimType: StimulusType;
  amp: number;
  freq: number;
  duration?: number;
  dt?: number;
  initialY?: [number, number, number];
  startOffset?: number;
  stimDuration?: number;
  stimConfig?: StimulusConfig;
}

export interface ValidationMetricResult {
  metric: string;
  control_mean: number;
  control_std: number;
  experimental_mean: number;
  experimental_std: number;
  delta_percent: number;
  passed: boolean;
}

export interface ValidationMetadata {
  timestamp: string;
  version: string;
  git_commit?: string;
  solver: string;
  dt: number;
  seed_base: number;
  repetitions: number;
}

export interface ValidationRunResult {
  id: string;
  name: string;
  metadata: ValidationMetadata;
  metrics: ValidationMetricResult[];
  raw_runs: any[];
  failures: FailureEvent[];
}

export type MetricType = 'residual_energy' | 'relaxation_time' | 'clone_divergence' | 'spectral_stability';

export interface ValidationTest {
  id: string;
  name: string;
  setup: SimulationConfig;
  control: SimulationConfig;
  repetitions?: number;
  seed_base?: number;
  metrics: MetricType[];
  assertion?: (result: ValidationMetricResult[]) => boolean;
}

export interface FailureEvent {
  repetition: number;
  reason: string;
  params: Record<string, any>;
  timestamp: string;
}
