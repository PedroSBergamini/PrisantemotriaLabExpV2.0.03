/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ValidationTest } from '../types';

export const ghostResidualTest: ValidationTest = {
  id: 'ghost_residual',
  name: 'Ghost Residual Persistence (Test 1)',
  setup: {
    par: {
      m: 1.0,
      gamma: 0.1,
      potential: 'double_well',
      beta: 1.8,
      tauH: 8.0,
      alpha: 1.2,
      eta: 0.4,
      V_height: 0.7
    },
    stimType: 'pulse',
    amp: 2.0,
    freq: 0.05,
    duration: 30.0,
    dt: 0.05,
    initialY: [0, 0, 0],
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
      beta: 0.0, // Markovian decoupled baseline
      tauH: 1.0,
      alpha: 1.2,
      eta: 0.4,
      V_height: 0.7
    },
    stimType: 'pulse',
    amp: 2.0,
    freq: 0.05,
    duration: 30.0,
    dt: 0.05,
    initialY: [0, 0, 0],
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
  seed_base: 100,
  metrics: ['residual_energy', 'relaxation_time'],
  assertion: (results) => {
    const re = results.find((r) => r.metric === 'residual_energy');
    const rt = results.find((r) => r.metric === 'relaxation_time');
    // Expect experimental Residual Energy and Relaxation Time to be strictly greater than control
    const rePass = re ? re.experimental_mean > re.control_mean : true;
    const rtPass = rt ? rt.experimental_mean > rt.control_mean : true;
    return rePass && rtPass;
  }
};
