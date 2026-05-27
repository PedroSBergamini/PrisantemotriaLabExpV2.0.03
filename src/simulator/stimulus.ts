/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StimulusConfig {
  type: 'sine' | 'pulse' | 'chirp' | 'step' | 'noise' | 'arbitrary';
  amp: number;
  freq: number;
  
  // Controls added in v2:
  startOffset?: number;     // Time offset before stimulus begins (s)
  duration?: number;        // Active duration of stimulus (s) (Infinity if continuous)
  initialPhase?: number;    // Initial phase offset (radians)
  dutyCycle?: number;       // Duty cycle for pulse type [0, 1]
  riseTime?: number;        // Smooth transition rise time (s)
  fallTime?: number;        // Smooth transition fall time (s)
  
  // AM/FM Modulation:
  amFreq?: number;          // Amplitude modulation frequency (Hz)
  amDepth?: number;         // Amplitude modulation depth [0, 1]
  fmFreq?: number;          // Frequency modulation frequency (Hz)
  fmDepth?: number;         // Frequency modulation peak deviation depth (Hz)
  
  // Envelope ADSR (Attack, Decay, Sustain, Release):
  attack?: number;          // Time to reach peak amplitude (s)
  decay?: number;           // Time to transition from peak to sustain level (s)
  sustain?: number;         // Sustain amplitude ratio [0, 1]
  release?: number;         // Time to decay to 0 after active duration ends (s)
  
  // Noise color profile:
  noiseColor?: 'white' | 'pink' | 'red';
  
  // Programmable arbitrary sequence (O(1) lookup via interpolation/binning):
  arbitrarySequence?: Array<{ t: number; val: number }>;
}

/**
 * Calculates the external excitation E(t) under the expanded StimulusConfig v2.
 * Time-complexity: O(1) deterministic execution path.
 * Guaranteeing thread/solver stability through analytical formulation.
 */
export function x_ext(t: number, config: StimulusConfig): number {
  const start = config.startOffset || 0;
  
  // 1. Check start offset boundary
  if (t < start) {
    return 0;
  }
  
  // Normalize time relative to offset
  const T = t - start;
  const duration = config.duration !== undefined ? config.duration : Infinity;
  const release = config.release || 0;
  
  // 2. Out of active bounds (duration + release envelope completed)
  if (T > duration + release) {
    return 0;
  }
  
  // 3. ADSR Envelope Calculation (O(1) piece-wise linear steps)
  let env = 1.0;
  const attack = config.attack || 0;
  const decay = config.decay || 0;
  const sustain = config.sustain !== undefined ? config.sustain : 1.0;
  
  if (attack > 0 || decay > 0 || release > 0) {
    if (T < attack) {
      // Attack phase
      env = T / attack;
    } else if (T < attack + decay) {
      // Decay phase
      const decayFraction = (T - attack) / decay;
      env = 1.0 - (1.0 - sustain) * decayFraction;
    } else if (T < duration) {
      // Sustain phase
      env = sustain;
    } else if (T <= duration + release && release > 0) {
      // Release phase
      const releaseFraction = (T - duration) / release;
      env = sustain * (1.0 - releaseFraction);
    } else {
      env = 0;
    }
  } else {
    // Standard box envelope
    env = T < duration ? 1.0 : 0.0;
  }
  
  if (env <= 0) return 0;

  // 4. Base waveform generation (O(1) analytical expressions)
  let rawWave = 0;
  const f = config.freq;
  const phase = config.initialPhase || 0;

  switch (config.type) {
    case 'sine': {
      // Analytical FM Modulation: theta(T) = 2pi * f * T + phase + fmDepth * sin(2pi * fmFreq * T)
      let FmTerm = 0;
      if (config.fmFreq && config.fmDepth) {
        const safeFmFreq = Math.max(config.fmFreq, 1e-5);
        FmTerm = (config.fmDepth / safeFmFreq) * Math.sin(2 * Math.PI * config.fmFreq * T);
      }
      rawWave = Math.sin(2 * Math.PI * f * T + phase + FmTerm);
      break;
    }
    
    case 'pulse': {
      // Periodic pulse generation with configurable trapezoidal rise/fall
      const period = 1 / (f || 1e-5);
      const tMod = T % period;
      const dcRaw = config.dutyCycle !== undefined ? config.dutyCycle : 0.2;
      const dc = Math.max(0.001, Math.min(0.999, dcRaw));
      const pulseWidth = dc * period;
      
      const tr = Math.min(config.riseTime || 0, pulseWidth * 0.5);
      const tf = Math.min(config.fallTime || 0, (period - pulseWidth) * 0.5);
      
      if (tMod < tr && tr > 0) {
        // Trapezoidal ramp up
        rawWave = tMod / tr;
      } else if (tMod >= tr && tMod < pulseWidth - tf) {
        rawWave = 1.0;
      } else if (tf > 0 && tMod >= pulseWidth - tf && tMod < pulseWidth) {
        // Trapezoidal ramp down
        rawWave = 1.0 - (tMod - (pulseWidth - tf)) / tf;
      } else {
        rawWave = 0.0;
      }
      break;
    }
    
    case 'chirp': {
      // Frequency sweep config
      const k = 0.05; // Linearly swept scale
      const sweepFreq = f + k * T;
      rawWave = Math.sin(2 * Math.PI * sweepFreq * T + phase);
      break;
    }
    
    case 'step': {
      // Single/repeating step transition with configurable riseTime ramp
      const tr = config.riseTime || 0;
      if (tr > 0 && T < tr) {
        rawWave = T / tr;
      } else {
        rawWave = 1.0;
      }
      break;
    }
    
    case 'noise': {
      // Deterministic colored noise via continuous harmonic summation.
      // This is essential for continuous deterministic solvers (like RK4) to avoid step failure 
      // of random steps, while accurately expressing white/pink/red power roll-offs.
      const color = config.noiseColor || 'white';
      let noiseSum = 0;
      let powerNormalization = 0;
      
      const harmonics = 10;
      for (let i = 1; i <= harmonics; i++) {
        const phi_harmonic = Math.sin(1.13 * i) * 100; // Deterministic pseudo-random phase
        const omega_i = 2 * Math.PI * f * i;
        
        let weight = 1.0;
        if (color === 'pink') {
          weight = 1.0 / Math.sqrt(i);
        } else if (color === 'red') {
          weight = 1.0 / i; // Fails as 1/f spectral density
        }
        
        noiseSum += weight * Math.sin(omega_i * T + phi_harmonic);
        powerNormalization += weight;
      }
      
      rawWave = powerNormalization > 0 ? noiseSum / powerNormalization : 0;
      break;
    }
    
    case 'arbitrary': {
      // Safe O(1) arbitrary path player from a brief coordinate list
      const seq = config.arbitrarySequence;
      if (!seq || seq.length === 0) {
        rawWave = 0;
      } else if (seq.length === 1) {
        rawWave = seq[0].val;
      } else {
        // Assume sequence coordinates are sorted.
        // For O(1) performance and safety, we clamp boundary, find index, and linear-interpolate.
        const firstTime = seq[0].t;
        const lastTime = seq[seq.length - 1].t;
        
        if (T <= firstTime) {
          rawWave = seq[0].val;
        } else if (T >= lastTime) {
          rawWave = seq[seq.length - 1].val;
        } else {
          // Uniformly scaled/grid approximation for O(1) index calculation.
          // Otherwise, binary search is O(log N) - for N <= 12 elements, it amounts to <= 4 fast operations (practically O(1)).
          let low = 0;
          let high = seq.length - 1;
          while (low < high - 1) {
            const mid = (low + high) >> 1;
            if (seq[mid].t <= T) {
              low = mid;
            } else {
              high = mid;
            }
          }
          const ptA = seq[low];
          const ptB = seq[high];
          const span = ptB.t - ptA.t;
          const u = span > 0 ? (T - ptA.t) / span : 0;
          rawWave = ptA.val * (1 - u) + ptB.val * u;
        }
      }
      break;
    }
  }

  // 5. Amplitude Modulation (AM): E_mod(t) = E_raw * (1 + amDepth * sin(2pi * amFreq * T))
  let amTerm = 1.0;
  if (config.amFreq && config.amDepth) {
    const safeAmDepth = Math.max(0, Math.min(1.0, config.amDepth));
    amTerm = 1.0 + safeAmDepth * Math.sin(2 * Math.PI * config.amFreq * T);
  }

  return config.amp * rawWave * env * amTerm;
}
