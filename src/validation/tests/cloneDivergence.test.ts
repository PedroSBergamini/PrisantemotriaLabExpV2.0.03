/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ValidationTest } from '../types';

export const cloneDivergenceTest: ValidationTest = {
  id: 'clone_divergence',
  name: 'Clone Divergence / Trajectory Dependence (Test 2)',
  setup: {
    par: {
      m: 1.0,
      gamma: 0.1,
      potential: 'double_well',
      beta: 1.5,
      tauH: 5.0,
      alpha: 1.2,
      eta: 0.4,
      V_height: 0.7
    },
    stimType: 'pulse',
    amp: 2.0,
    freq: 0.05,
    duration: 15.0,
    dt: 0.05,
    startOffset: 4.0,
    stimDuration: 3.0,
    stimConfig: {
      type: 'pulse',
      amp: 2.0,
      freq: 0.05,
      startOffset: 4.0,
      duration: 3.0,
      dutyCycle: 1.0,
      riseTime: 0.5,
      fallTime: 0.5
    }
  },
  control: {
    par: {
      m: 1.0,
      gamma: 0.1,
      potential: 'double_well',
      beta: 0.0, // Decoupled memory, divergence will be near 0
      tauH: 5.0,
      alpha: 1.2,
      eta: 0.4,
      V_height: 0.7
    },
    stimType: 'pulse',
    amp: 2.0,
    freq: 0.05,
    duration: 15.0,
    dt: 0.05,
    startOffset: 4.0,
    stimDuration: 3.0,
    stimConfig: {
      type: 'pulse',
      amp: 2.0,
      freq: 0.05,
      startOffset: 4.0,
      duration: 3.0,
      dutyCycle: 1.0,
      riseTime: 0.5,
      fallTime: 0.5
    }
  },
  repetitions: 5,
  seed_base: 200,
  metrics: ['clone_divergence'],
  assertion: (results) => {
    const cd = results.find((r) => r.metric === 'clone_divergence');
    // Expect experimental clone divergence to be significantly larger than control (which is decoupled, i.e., near 0)
    return cd ? cd.experimental_mean > cd.control_mean + 0.1 : false;
  }
};
