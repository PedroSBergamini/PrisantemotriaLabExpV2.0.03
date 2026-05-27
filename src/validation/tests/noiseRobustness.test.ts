/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ValidationTest } from '../types';

export const noiseRobustnessTest: ValidationTest = {
  id: 'noise_robustness',
  name: 'Noise Robustness under Pink Noise (Test 3)',
  setup: {
    par: {
      m: 1.0,
      gamma: 0.3,
      potential: 'double_well',
      beta: 2.0, // High-coupling protective barrier
      tauH: 4.0,
      alpha: 0.7,
      eta: 0.2,
      V_height: 0.6
    },
    stimType: 'thermal_noise',
    amp: 1.5,
    freq: 0.1,
    duration: 30.0,
    dt: 0.05,
    startOffset: 1.0,
    stimDuration: 28.0,
    stimConfig: {
      type: 'noise',
      amp: 1.5,
      freq: 0.1,
      startOffset: 1.0,
      duration: 28.0,
      noiseColor: 'pink'
    }
  },
  control: {
    par: {
      m: 1.0,
      gamma: 0.3,
      potential: 'double_well',
      beta: 0.1, // Low-coupling weak baseline
      tauH: 4.0,
      alpha: 0.7,
      eta: 0.2,
      V_height: 0.6
    },
    stimType: 'thermal_noise',
    amp: 1.5,
    freq: 0.1,
    duration: 30.0,
    dt: 0.05,
    startOffset: 1.0,
    stimDuration: 28.0,
    stimConfig: {
      type: 'noise',
      amp: 1.5,
      freq: 0.1,
      startOffset: 1.0,
      duration: 28.0,
      noiseColor: 'pink'
    }
  },
  repetitions: 5,
  seed_base: 300,
  metrics: ['spectral_stability'],
  assertion: (results) => {
    const ss = results.find((r) => r.metric === 'spectral_stability');
    // Expect experimental high coupling to provide higher low-frequency spectral stability
    return ss ? ss.experimental_mean > ss.control_mean : false;
  }
};
