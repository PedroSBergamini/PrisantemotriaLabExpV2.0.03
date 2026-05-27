/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Deterministic PRNG using Mulberry32.
 * This guarantees a repeatable, identical sequence of pseudorandom numbers for a given seed.
 */
export function seededRandom(seed: number): () => number {
  return function(): number {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns a seed sequence derived from seed_base and repetition_index.
 */
export function getSeedForRepetition(seedBase: number, repetition: number): number {
  return seedBase + repetition;
}
