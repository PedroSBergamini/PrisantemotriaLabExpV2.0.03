/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EXTREME } from './EXTREME';
import { TRAUMA } from './TRAUMA';
import { NOISE } from './NOISE';

export * from './EXTREME';
export * from './TRAUMA';
export * from './NOISE';

export const EXPLORATION_PRESETS = {
  EXTREME,
  TRAUMA,
  NOISE
} as const;

export type ExplorationPresetKey = keyof typeof EXPLORATION_PRESETS;
