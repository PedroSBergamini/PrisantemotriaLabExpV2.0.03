/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { STANDARD } from './STANDARD';
import { ENHANCED } from './ENHANCED';
import { STRESS } from './STRESS';

export * from './STANDARD';
export * from './ENHANCED';
export * from './STRESS';

export const VALIDATION_PRESETS = {
  STANDARD,
  ENHANCED,
  STRESS
} as const;

export type ValidationPresetKey = keyof typeof VALIDATION_PRESETS;
