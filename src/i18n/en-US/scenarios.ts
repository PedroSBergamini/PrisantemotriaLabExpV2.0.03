/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DictScenario } from '../types';

export const scenarios: DictScenario[] = [
  {
    id: 1,
    tier: 1,
    tierTitle: 'Tier 1: Understand Memory',
    title: 'Zero Memory System',
    description: 'Introduce the particle to a classic harmonically elastic potential well where historical influence is turned off (β = 0.0) resulting in immediate mechanical responses.',
    checklist: [
      'Set coupling beta = 0.0 (historical habit channel inactive)',
      'Observe how state S(t) strictly traces the external driver stimulus',
      'Notice the total absence of phase lag loops (hysteresis area = 0)'
    ],
    expectedSignature: 'Φ = 0.00%, D_max = 0.00'
  },
  {
    id: 2,
    tier: 1,
    tierTitle: 'Tier 1: Understand Memory',
    title: 'Healthy Relaxation',
    description: 'Moderate historical coupling paired with rapid decay timescales. Memory acts as a healthy and fluid stabilizer, dispersing energy exponentially to restore the ground state.',
    checklist: [
      'Raise beta moderately (0.5 to 0.8)',
      'Set relaxation timescale tauH around 2.0s',
      'Observe the smooth restoring orbit in phase space'
    ],
    expectedSignature: 'Φ ≈ 4.0% to 8.0%, Fluid Restoration'
  },
  {
    id: 3,
    tier: 1,
    tierTitle: 'Tier 1: Understand Memory',
    title: 'Viscoelastic Memory',
    description: 'Considerable memory retention. The residual field ΔF(t) acts as a delayed phase spring, resisting fast perturbations and slowly dragging the state back to its history.',
    checklist: [
      'Increase memory decay tauH to 4.5s or longer',
      'Set historical coupling beta to 0.8',
      'Observe the lingering traces generating viscoelastic waves in ΔF(t)'
    ],
    expectedSignature: 'Φ ≈ 8.0% to 15.0%, Clear phase loop'
  },
  {
    id: 4,
    tier: 2,
    tierTitle: 'Tier 2: Understand Historicity',
    title: 'Critical Hysteresis',
    description: 'The ascending path and descending path trace visibly separate curves. The system absorbs and stores cyclical energy in irreversible butterfly configurations.',
    checklist: [
      'Activate DOUBLE_WELL potential model on the left deck',
      'Set coupling beta = 1.0 and retention tauH = 5.0s',
      'Observe wide divergent paths as the force pushes and retracts'
    ],
    expectedSignature: 'Hysteresis Area > 0.40, High Φ'
  },
  {
    id: 5,
    tier: 2,
    tierTitle: 'Tier 2: Understand Historicity',
    title: 'Crystallized Trauma',
    description: 'Extreme memory impression by static exposure (eta). Remaining stationary inside a valley permanently bends the potential profile, creating deep structural habits.',
    checklist: [
      'Set static exposure eta = 1.8 (very high static settlement)',
      'Keep the system inside a single basin under light driving force',
      'Watch the system dig a deep valley, unable to jump the barrier'
    ],
    expectedSignature: 'Permanent Deformation, Low D_max'
  },
  {
    id: 6,
    tier: 2,
    tierTitle: 'Tier 2: Understand Historicity',
    title: 'Impact-Induced Trauma',
    description: 'High kinetic memory recording triggered by velocity and acceleration (alpha). Rapid phase transitions warp the field, leaving permanent markings on energy barriers.',
    checklist: [
      'Raise alpha to 1.5 (high transitional change sensitivity)',
      'Use a Pulse stimulus to hammer shockwaves into the state particle',
      'Observe post-peak oscillations locking into new historical basins'
    ],
    expectedSignature: 'Φ > 15.0%, Abrupt transitional scars'
  },
  {
    id: 7,
    tier: 3,
    tierTitle: 'Tier 3: Temporal Non-Locality',
    title: 'Divergent Twin Clones',
    description: 'Two physical clones starting at the exact same point in the present diverge into opposite, irreversible orbits under identical driving, solely due to minor differences in their pasts.',
    checklist: [
      'Run the Causal Clone test with mismatched historical priming frequencies',
      'Observe initially identical trajectories bifurcate under common forces',
      'Gather maximum divergence metrics D_max (irreducible deviation)'
    ],
    expectedSignature: 'D_max > 0.25, Severe state diversion'
  },
  {
    id: 8,
    tier: 3,
    tierTitle: 'Tier 3: Temporal Non-Locality',
    title: 'Edge of Chaos',
    description: 'A critical sintonization boundary where tiny variations in historical pathways threw the system into polar opposite basins, exhibiting giant sensitivity to past habits.',
    checklist: [
      'Reduce dissipation gamma to 0.05 to boost kinetic energy',
      'Keep coupling beta at a moderate range (1.2 to 1.5)',
      'Monitor erratic, chaotic-like state fluctuations under cyclic drive'
    ],
    expectedSignature: 'Erratic and Irregular Trajectories'
  },
  {
    id: 9,
    tier: 3,
    tierTitle: 'Tier 3: Temporal Non-Locality',
    title: 'Historical Resonance',
    description: 'Symmetric harmony where the cycle of the driving force (t = 1/f) aligns with the memory relaxation timescale tauH, generating giant peaks in mechanical energy transfer.',
    checklist: [
      'Equalize the stimulus period t = 1/f with memory decay scale tauH',
      'Observe the total Hamiltonian energy balance of the state',
      'Estimate the amplitude enhancement of the delayed restoring field'
    ],
    expectedSignature: 'Harmonic Peaks, Maximum Work'
  },
  {
    id: 10,
    tier: 4,
    tierTitle: 'Tier 4: Limits of Theory',
    title: 'Saturation Amnesia',
    description: 'When driving amplitude and frequency reach extreme, violent levels, the memory field ΔF saturates at potential boundaries, choking historical retention.',
    checklist: [
      'Raise the stimulus amplitude to a violent 2.5',
      'Select a rapid Chirp stimulus shape',
      'Observe how the historical index Φ drops to zero under extreme driving'
    ],
    expectedSignature: 'Φ drops to zero, Critical decay'
  },
  {
    id: 11,
    tier: 4,
    tierTitle: 'Tier 4: Limits of Theory',
    title: 'Peak Historicity',
    description: 'Finetuning the precise hot-spot where twin potential wells and historical lag parameters match perfectly, sending the predictive gain Φ to its absolute cosmic maximum.',
    checklist: [
      'Tune m: 1.0, beta: 1.6, tauH: 3.5s with a DOUBLE_WELL potential',
      'Check if linear predictors require absurd k* lags to mimic error bounds',
      'Verify the irreducible efficiency of the historical parameter'
    ],
    expectedSignature: 'Maximum Φ (> 20%), k* >= 6'
  },
  {
    id: 12,
    tier: 4,
    tierTitle: 'Tier 4: Limits of Theory',
    title: 'Thermal Noise & Entropy',
    description: 'Mergence of random Wiener stochastics (thermal jitter). The historical channel is continuously shaken by entropy, testing the boundaries of habit survival.',
    checklist: [
      'Set the external driver stimulus type to THERMAL_NOISE',
      'Keep gamma high and beta at a moderate level',
      'Measure if the noise survival index (R_idx) collapses under randomness'
    ],
    expectedSignature: 'Low R_idx, Thermal separation'
  },
  {
    id: 13,
    tier: 5,
    tierTitle: 'Tier 5: v2 Signals [NEW]',
    title: 'Habituation Envelope (ADSR)',
    description: 'Modulate the signal source with dynamic Attack, Decay, Sustain, and Release (ADSR) transient phases to analyze restorative habit decays.',
    checklist: [
      'Select a Sine driver and configure custom ADSR parameter sliders on the panel',
      'Observe the progressive amplitude buildup and the abrupt sustain cutoff',
      'Track if the residual delay memory dF outlasts the silent post-release zone'
    ],
    expectedSignature: 'Φ ≈ 12.0%, Post-Release Preservation'
  },
  {
    id: 14,
    tier: 5,
    tierTitle: 'Tier 5: v2 Signals [NEW]',
    title: 'AM Beat Effector',
    description: 'Examines slow Amplitude Modulation (AM) beats to test if the historical channel tracks slow envelope fluctuations.',
    checklist: [
      'Enable Amplitude Modulation (AM) with a slow beating frequency',
      'Monitor the peaks and valleys of accumulated memory in the phase space',
      'Analyze asymmetric warping and phase lagging under low-amplitude cycles'
    ],
    expectedSignature: 'Φ ≈ 10.0%, Modulated Hysteresis'
  },
  {
    id: 15,
    tier: 5,
    tierTitle: 'Tier 5: v2 Signals [NEW]',
    title: 'FM Resonance Dispersion',
    description: 'Modulates internal driving frequencies via FM to stress-test historical elastic feedback loops under dynamic phase shifts.',
    checklist: [
      'Tune Frequency Modulation (FM) with moderate frequency deviation depth',
      'Watch phase transition peaks as the driving force quickly accelerates',
      'Measure instantaneous reorganization of mechanical order and resonance dynamics'
    ],
    expectedSignature: 'Intermittent Chaos, Low R_idx'
  },
  {
    id: 16,
    tier: 5,
    tierTitle: 'Tier 5: v2 Signals [NEW]',
    title: 'Pink Noise Survival',
    description: 'Exposes habit structures to fractal 1/f noise signals to evaluate structural lane protection against power roll-offs.',
    checklist: [
      'Set driver type to Noise and select the Pink color option',
      'Observe if fractal entropy decays local phase attraction bounds',
      'Estimate whether double-potential barriers protect viscoelastic traces'
    ],
    expectedSignature: 'Resilient Φ (> 5.0%), High Retention'
  },
  {
    id: 17,
    tier: 5,
    tierTitle: 'Tier 5: v2 Signals [NEW]',
    title: 'Ghost Pulse Training',
    description: 'Applies finite, trapezoidal pulses with configurable start offsets to prove the presence of mechanical ghost responses.',
    checklist: [
      'Set single Pulse driving with trapezoidal rise and fall times',
      'Watch the initial strike deliver momentum and deform history dF space',
      'Observe the unforced free oscillation following the pulse to prove persistent H_t memory'
    ],
    expectedSignature: 'Irreducible Divergence, Ghost Effect'
  }
];
