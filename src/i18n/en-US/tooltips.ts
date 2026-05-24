/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CognitiveTranslation } from '../types';

export const tooltips = {
  m: {
    concept: 'State Inertia (m)',
    explanations: {
      simple: 'Measures the system weight: the higher it is, the slower it reacts to external pushes and small fluctuations.',
      intuitive: 'Like trying to push a heavy cargo truck versus a light nimble boat: the heavy truck requires continuous momentum to even begin shifting speed.',
      operational: 'Governs resistance to kinematic acceleration. Raising m smooths out fast fluctuations and effectively filters out high-frequency noise.',
      formal: 'The classical inertial mass coefficient in Langevin-style dynamics: F_inertial = m · d²S/dt², dictating temporal stability and momentum lag.',
      metaphorical: 'A massive freight locomotive traveling with stubborn momentum versus an agile but highly unstable speedboat.'
    },
    suggestedAction: 'Decrease m for instantaneous responsiveness, or increase it to suppress erratic jumps and stabilize the trajectory.'
  },
  gamma: {
    concept: 'Viscous Dissipation (gamma)',
    explanations: {
      simple: 'Friction or damping: controls how fast the system drains energy and settles down to rest.',
      intuitive: 'Like swinging a pendulum in thin air versus within a jar of thick, viscous engine oil: the oil drains momentum almost instantly.',
      operational: 'Controls damping of state velocity. Low values (gamma < 0.1) trigger persistent harmonic oscillations; high values (> 1.0) choke the movement.',
      formal: 'Viscous damping coefficient in classical phase equations: F_dissipative = -gamma · dS/dt, responsible for linear energy dissipation.',
      metaphorical: 'Strolling in plain air versus dragging your feet in a dense, viscous pool of heavy asphalt oil.'
    },
    suggestedAction: 'Reduce gamma below 0.15 to unleash vibrant, long-range harmonic oscillations.'
  },
  potential: {
    concept: 'Potential Profile V(S)',
    explanations: {
      simple: 'The structural landscape where the state coordinates move (either a single stable bowl or twin competing valleys).',
      intuitive: 'A single round bowl (stable harmonic well) versus two bowls glued side-by-side with an elevated ridge between them (double well).',
      operational: 'Alters the restoring potential gradient -dV/dS. Choosing a double well enables bistable dynamics, phase transitions, and non-linear hysteresis.',
      formal: 'The potential energy function V(S) prescribing the conservative restoring forces. Quantified in energy units (Joules equivalent).',
      metaphorical: 'An inviting flat meadow versus a sheer canyon split by a high wall into two narrow, shadowed caves.'
    },
    suggestedAction: 'Select double_well (poço duplo) to study bistable transitions, threshold behavior, and chaotic phase changes.'
  },
  beta: {
    concept: 'Historical Coupling Force (beta)',
    explanations: {
      simple: 'The physical weight of the past on the present: the higher beta is, the more historical memory pulls the state.',
      intuitive: 'Like driving a car on muddy streets with deep tire tracks: if beta is high, you are forced to follow the exact tracks laid down before.',
      operational: 'Scaling factor of the historical field variable ΔF on active state transitions. Governs the linear torque of memory forces.',
      formal: 'Coupling constant of the non-local historical restoring force: F_historical = beta · ΔF(t), linking hidden paths to current state evolution.',
      metaphorical: 'An invisible, highly elastic tether that pulls every new stride back toward your faded walking trails in the fog.'
    },
    suggestedAction: 'Raise beta above 1.0 to intensify predictive historic gain (Phi) and pull clones into divergent paths.'
  },
  tauH: {
    concept: 'Memory Retention Speed (tau_H)',
    explanations: {
      simple: 'The duration of memory: how long the system takes to dry out and forget most of its previous experience.',
      intuitive: 'Chalk writing on a damp blackboard: if tauH is high, letters remain visible for minutes; if short, the moisture evaporates, and the blackboard dries immediately.',
      operational: 'Characteristic visco-elastic relaxation time scale. Dictates the exponential decay velocity of the memory integrator.',
      formal: 'Exponential decay constant of the historical memory kernel: K(t) = e^{-t / tauH}. Dictates the half-life of historical feedback.',
      metaphorical: 'A thick, fragrant cloud of incense floating in a sealed room versus a candle flame puff that vanishes in an instant.'
    },
    suggestedAction: 'Increase tauH above 5.0 seconds to model deep, long-term non-Markovian visco-elastic systems.'
  },
  alpha: {
    concept: 'Dynamic Impact Impression (alpha)',
    explanations: {
      simple: 'Measures transitional impact: how much sudden speed spikes and rapid motions scar the historical field.',
      intuitive: 'We completely forget monotonous train rides, but carry the memory of index-crushing sudden brake halts (speed transitions) for years.',
      operational: 'Coupling factor of current phase speed |dS/dt| on memory creation. Dictates plastic memory impressions caused by kinetic shocks.',
      formal: 'Kinematic rate of memory impression: dF/dt = -F/tauH + alpha · |dS/dt| + eta · S, linking transient speed to memory deformation.',
      metaphorical: 'Deep gashes left on a wooden table only when hit by a heavy hammer.'
    },
    suggestedAction: 'Increase alpha to 1.5 and trigger a Pulse stimulus to observe immediate transition scars.'
  },
  eta: {
    concept: 'Static Settlement Rate (eta)',
    explanations: {
      simple: 'Measures habituation over time: how much simply remaining static in a position leaves a lasting impression.',
      intuitive: 'Even without jumping or running, simply sitting in the exact same spot on a soft memory foam mattress will eventually leave a hollow.',
      operational: 'Static field polarization coefficient. Integrates the absolute position of the state directly into the helper memory field, even at rest.',
      formal: 'Static coefficient scale generating hysteresis through position alignment: dF/dt_static = eta · S(t) integrated continuously.',
      metaphorical: 'Ancient footpaths carved into stone over generations purely by the patient weight of soft, repeated footsteps.'
    },
    suggestedAction: 'Raise eta above 1.5 inside a double well to witness the state locking itself permanently into an induced basin.'
  },
  vHeight: {
    concept: 'Ridge Barrier Height (V_height)',
    explanations: {
      simple: 'The height of the separating border in a double-well: measures the effort needed to hop over to the other side.',
      intuitive: 'The height of a dividing wall between two valleys: if low, residents cross easily; if high, it requires a massive climb.',
      operational: 'Alters local activation barrier heights. Dictates the critical kinetic energy threshold required to transition between basins.',
      formal: 'Stable potential barrier height ΔV = V(0) - V(S_min) within a symmetric Pitchfork transition scenario.',
      metaphorical: 'A low speedbump on clean asphalt versus a towering five-meter stone firewall.'
    },
    suggestedAction: 'Balance the ridge height against external drive amplitude to ensure the state can successfully escape and transit.'
  },
  phi: {
    concept: 'Historical Predictive Gain (Phi)',
    explanations: {
      simple: 'Measures historical causal relevance: the advantage of reading past records to predict where the system will move next.',
      intuitive: 'Guessing someone\'s mood based on their expression this exact instant vs knowing their journal entries for the last five years.',
      operational: 'Statistical measure of relative predictive explainability compared against optimal linear autoregressive AR(p) baselines.',
      formal: 'Rigorous non-Markovian index: Phi = 1 - (MSE_Historical / MSE_Baselines). A index > 0.05 proves authentic historical causation.',
      metaphorical: 'The spectacular advantage of reading a novel from chapter one instead of guessing the ending from the last word.'
    },
    suggestedAction: 'Lengthen the memory retention time (tauH) and the coupling factor (beta) to see the historical index Phi spike upward.'
  },
  cloneDivergence: {
    concept: 'Causal Clone Divergence (D_max)',
    explanations: {
      simple: 'The ultimate causality test: clone twins that are identical in the present diverged because their histories differed.',
      intuitive: 'Identical twins entering the exact same physical room: one panics and the other is relaxed due to different hidden past trauma.',
      operational: 'Maximum asymptotic physical state divergence between clone pairs after non-symmetric priming. Proves temporal non-locality.',
      formal: 'Asymmetric deviation index: D_max = max(|S_A(t) - S_B(t)|) under identical driving conditions post-decoupling.',
      metaphorical: 'Two identical seeds that sprout as completely opposite shapes under the same sun due to the water of their separate soils.'
    },
    suggestedAction: 'Run the Clone test with mismatched historical frequencies to observe this irreducible divergence.'
  },
  kStar: {
    concept: 'Minimum Embedding Dimension (k*)',
    explanations: {
      simple: 'The number of consecutive past logs needed in a diary to reproduce what the memory field ΔF tells the system implicitly.',
      intuitive: 'If you lost your long-term memory, you would have to write down your coordinates from the last 10 hours continuously to predict where to go.',
      operational: 'Optimal ARIMA autoregressive lag order required to match the mean squared error of the non-local historical predictor.',
      formal: 'Embedding truncation order: k* = arg min_p { MSE_AR(p) <= MSE_Hist + epsilon }. Measures time series compressibility.',
      metaphorical: 'The length of the paper scroll you must pack in your backpack to write daily records and compensate for amnesia.'
    },
    suggestedAction: 'Watch k* climb dynamically in the Memory Margin tab of the physical panel as you prolong the memory decay time (tauH).'
  },
  hysteresis: {
    concept: 'Hysteresis Loop Area',
    explanations: {
      simple: 'Measures cyclical lag: the geometric phase lag between the external force and the physical position of the particle.',
      intuitive: 'Like kneading a thick piece of memory foam: it lags behind your fingers and stays compressed for a delayed time.',
      operational: 'Integrated measure of phase lag. Forms hollow, wide multi-valued loops on S-vs-E coordinates instead of narrow flat curves.',
      formal: 'Closed-path integral of displacement under external drive cycles: W = oint S dE. Quantifies irreversible dissipational work.',
      metaphorical: 'An elegant butterfly wing drawn by the path of forward movement deviating physically from the path of return.'
    },
    suggestedAction: 'Set the driver shape to Sine on the stimulator deck, and watch the hysteresis loop trace high-contrast butterflies.'
  },
  noiseRobustness: {
    concept: 'Survival under Noise (R_idx)',
    explanations: {
      simple: 'Indicates habit stability: how resilient the historical memory is when shaken by chaotic thermal noise.',
      intuitive: 'Like deep tracks carved into heavy granite stone compared against lines drawn on loose wind-swept sand.',
      operational: 'Survival ratio of characteristic historical metrics in the presence of wide-band Wiener noise and random thermal vibrations.',
      formal: 'R_idx = Phi(noisy) / Phi(stationary). Quantifies the structural robust preservation of visco-elastic attractor pathways.',
      metaphorical: 'Deep-cut structural canyon beds carved in solid bedrock resisting the constant friction of random dust storms.'
    },
    suggestedAction: 'Enable thermal noise (THERMAL_NOISE), and check if the state inertia (m) shields the system attractor lanes from random jitter.'
  }
};
