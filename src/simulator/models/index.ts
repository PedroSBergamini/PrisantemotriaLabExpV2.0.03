/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SimulationPoint, SystemParameters, StimulusType } from '../../shared/types/index';

export interface SimulationModel {
  name: string;
  description: string;
  simulate(
    par: SystemParameters,
    stimType: StimulusType,
    amp: number,
    freq: number,
    duration?: number,
    dt?: number,
    initialY?: [number, number, number],
    startOffset?: number,
    stimDuration?: number,
    stimConfig?: any
  ): SimulationPoint[];
}
