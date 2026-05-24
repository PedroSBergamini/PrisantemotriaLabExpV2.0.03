/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const diagnostics = {
  currentSystemState: 'State Evolutionary Diagnosis',
  analogies: 'Resonance & Metaphors',
  suggestions: 'Suggested Operational Path',
  narrativeTones: {
    scientific: 'Scientific Tone',
    human: 'Intuitive Tone',
    mentor: 'Mentor Tone',
    oracle: 'Oracle Tone',
    minimal: 'Minimal Tone'
  },
  
  metrics: {
    phi: {
      title: 'Historical Predictive Gain (Φ)',
      status: {
        NEUTRAL: {
          scientific: 'Residual Φ index value. Including the non-local historical regressor ΔF(t) yields near-zero predictive gain over the optimal linear AR(p) baseline.',
          human: 'The past does not seem to make any difference in predicting this system\'s future. It operates purely in the immediate present.',
          mentor: 'Note that at very low coupling beta, historical memory impact shrinks. The system reduces to a Markovian model.',
          oracle: 'The present is self-sufficient; no ancient echoes alter the linear progression of current instances.',
          minimal: 'Inactive memory. Residual Φ index.'
        },
        MODERATE: {
          scientific: 'Stable and moderate descriptive predictive gain (Φ ≤ 18%). The delayed visco-elastic field ΔF(t) contains valid phase information.',
          human: 'The system exhibits a subtle memory of where it has been, gently warping its next step in the potential well.',
          mentor: 'A promising start; the memory channel is pulsing softly. Try lengthening memory decay tauH to expand and solidify historicity.',
          oracle: 'Faded footprints drift in the ether, whispering of forgotten locations under the high sky.',
          minimal: 'Moderate memory active. Φ detected.'
        },
        OPTIMAL: {
          scientific: 'Dominant state-space historicity (Φ > 18%). Local linear Markovian baselines fail severely to capture the active attractor bais.',
          human: 'The past is fully active and absolutely critical! Trying to anticipate movements based purely on the present fails miserably.',
          mentor: 'Superb! We are observing a dominant irreducible historic state space. The memory kernel is carrying high academic value here.',
          oracle: 'The past directs the future. Shadows of yesterday carve the invisible paths taken by the particle right now.',
          minimal: 'Complete historical dominance. Maximum Φ.'
        }
      }
    },
    clone_div: {
      title: 'Causal Clone Divergence',
      status: {
        NEUTRAL: {
          scientific: 'Absolute convergent asymptotic symmetry. Initial historical priming differences dissolve rapidly under common relaxation forces.',
          human: 'The identical clones behaved in the exact same manner, proving that previous historical discrepancies were quickly forgotten.',
          mentor: 'Because they merged quickly, initial distinct paths were scrubbed. Try lowering the damping constant (gamma) to reveal memory divergence.',
          oracle: 'Parallel pathways merge; the twins forget their separate roots to march together toward the same valley.',
          minimal: 'Identical clones converged.'
        },
        MODERATE: {
          scientific: 'Transient local divergence or stable attractor asymmetry arising from latent historical memory differences in ΔF.',
          human: 'They started in the exact same physical spot, but their separate historical loads gradually pushed them into different lanes.',
          mentor: 'We have a stable, moderate twin divergence under symmetric driving. You can watch them traversing distinct basins in real-time.',
          oracle: 'The clones gaze at each other across energy ridges, but hidden past voices pull them to opposite corners of the map.',
          minimal: 'Moderate clone divergence.'
        },
        OPTIMAL: {
          scientific: 'Deep causal bifurcation (severe D_max). Absolute breakdown of local state predictability under uniform external driving.',
          human: 'A monumental difference! Despite being placed in the exact same physical position in the present, the clones acted in opposite ways due to their pasts.',
          mentor: 'Fascinating! Maximum causal clone divergence achieved. This empirically demonstrates dynamic temporal non-locality in the lab.',
          oracle: 'Though standing on the same soil of the active moment, one carries fire and the other ash of their separate eras; they split forever.',
          minimal: 'Clones in maximum causal bifurcation.'
        }
      }
    },
    k_star: {
      title: 'Embedding Complexity (k*)',
      status: {
        NEUTRAL: {
          scientific: 'Low lag autoregressive dimension (k* ≤ 2). The physical memory integrator is trivially compressible in state-space.',
          human: 'It is enough to review the last 1 or 2 seconds to capture everything history caused. The memory is very simple to summarize.',
          mentor: 'The system exhibits low temporal lag complexity. You can easily approximate its trajectories using just 1 or 2 past lags.',
          oracle: 'The seed of the now has shallow roots; a glance at the immediate moments reveals its entire story.',
          minimal: 'Short embedding. Highly compressible channel.'
        },
        MODERATE: {
          scientific: 'Intermediate lag embedding dimension (3 ≤ k* ≤ 7). The time series requires moderate visco-elastic lag tracing for simulation.',
          human: 'Forecasting the current movement requires recording 3 to 7 consecutive past seconds to mimic historical effects.',
          mentor: 'Moderate lag order complexity. The linear registry must expand to match what the single state ΔF provides implicitly.',
          oracle: 'The historical ledger demands flipping back a few pages to explain the hesitations of the present.',
          minimal: 'Moderate lag complexity.'
        },
        CRITICAL: {
          scientific: 'Severe dynamical irreducibility (k* ≥ 8). The memory feedback consists of a non-local exponential kernel impossible to condense.',
          human: 'The system memory has become so deep and complex that modeling it with standard linear equations is completely unfeasible.',
          mentor: 'Irreducible non-linear memory! Linear lag components explode. Visit the Reservoir (ESN) tab to process this high complexity.',
          oracle: 'An infinite web of moments; tracing each thread is like charting every drop of an ancient storm.',
          minimal: 'Irreducible memory. Maximum embedding lag.'
        }
      }
    },
    hysteresis: {
      title: 'Hysteresis Loop Area',
      status: {
        NEUTRAL: {
          scientific: 'Perfect direct elasticity. Net cyclic dissipative work is zero, with perfect in-phase response under external drive.',
          human: 'The system responds almost instantly to external forces. Released, it returns with elastic speed.',
          mentor: 'At near-zero hysteresis, the state is in phase with driving. Raise beta to open the visco-elastic loop.',
          oracle: 'Frictionless folding harmony; the spring of the present submits blindly to the push of external driving cycles.',
          minimal: 'Zero hysteresis. Direct elastic response.'
        },
        MODERATE: {
          scientific: 'Detectable visco-elastic phase lag with persistent feregnetic energy dissipation under cyclical stimulus.',
          human: 'There is a noticeable delay. The system resists the force, accumulating historical stress and releasing it out-of-phase.',
          mentor: 'Notice that the subtle temporal delay formed a smooth elliptical loop, proving active visco-elastic friction.',
          oracle: 'Time exacts its friction, prompting a whisper of delay; the particle hesitates at each cyclical oscillation.',
          minimal: 'Moderate hysteresis loop.'
        },
        OPTIMAL: {
          scientific: 'Exuberant path-dependent cycle area (∮ S dE > 0.45). Heavy cyclical hysteresis and phase energy trapping.',
          human: 'Giant loops! The system climbs up one lane and rolls back down an entirely different pathway.',
          mentor: 'Outstanding butterfly curve forming on the canvas. This severely warps the total dynamic energy coordinates.',
          oracle: 'Two separate tracks of ascending and descending draw gorgeous wings in space; the journey up is never the road home.',
          minimal: 'Exuberant hysteresis cycle detected.'
        }
      }
    },
    noise_robustness: {
      title: 'Stochastic Noise Survival',
      status: {
        CRITICAL: {
          scientific: 'Unstable attractor fragility. Visco-elastic memory structures collapse when perturbed by exogenous Wiener noise.',
          human: 'Memory is highly vulnerable. Any random breeze or background chatter wipes out historical carvings completely.',
          mentor: 'At low noise survival, historical attractors are easily scrubbed by random fluctuations. Consider raising m or beta.',
          oracle: 'Inscribed on the loose sea sand; the rapid wind of randomness blows and sweeps away past outlines.',
          minimal: 'Fragile memory. Low noise survival index (R_idx).'
        },
        MODERATE: {
          scientific: 'Robust attractor preservation. Core non-Markovian pathways remain structurally protected under moderate thermal noise.',
          human: 'The state shakes with noise, but it successfully holds onto its historical footprints and active attractor basins.',
          mentor: 'Good job; the memory channel resists background fluctuations. The energetic ridge successfully shields the state.',
          oracle: 'Though the sea-surface is battered by high winds, the ancient road remains clearly visible beneath the reflections.',
          minimal: 'Stable, robust survival under noise.'
        },
        OPTIMAL: {
          scientific: 'Complete conformal resilience. Attractors and habits are fully shielded against high-amplitude brownian Wiener noise.',
          human: 'Absolute resilience! Not even severe thermal noise can divert the state from its past-induced basins and routes.',
          mentor: 'Sensational: system completely immune to stochastic disruptions. The memory state has carved deep historical gorges.',
          oracle: 'A deep riverbed carved into solid, unshakeable bedrock: storms shake the canopy, but the ancient stream flows unchanged.',
          minimal: 'Extreme robustness under stochastics.'
        }
      }
    }
  },

  verdicts: {
    GREENLIGHT: {
      scientific: 'ADMISSIBLE HISTORICITY CONFIRMED (Real Memory Regime). Latent priming deviations in the viscoelastic driver trigger dynamic temporal non-locality.',
      human: 'Complete success in proving active historical recollection! Identical clones diverged due to different invisible past stories, and predictive diagnostics proved memory cannot be simplified by local linear equations.',
      mentor: 'Magnificent conclusion! You verified the core non-local dynamic hypothesis in the lab. Clones split and Φ is high.',
      oracle: 'The invisible outlines of the past guide the particle with iron claws; the system remembers, and its history writes its destiny.',
      minimal: 'Admissible historicity verified.'
    },
    MARGINAL: {
      scientific: 'PRELIMINARY HISTORICITY (Weak Causal Lag Dependency). Historical relevance is present but remains close to local compressible limits.',
      human: 'The system exhibits some delayed feedback, but it is weak. A classic model pointing back just 2 seconds can explain 90% of the movement.',
      mentor: 'We obtained a weak or early-stage confirmation. Re-evaluate parameters: try stretching beta or elongating tauH.',
      oracle: 'Faint reflections wandering the edge of forgetting; dust of the present almost blurs the paths of where the particle stepped.',
      minimal: 'Partial historicity active.'
    },
    REDLIGHT: {
      scientific: 'SYSTEM BEHAVES MARKOVIAN (No Real Memory Influence). Phase indices decay rapidly into immediate present limits.',
      human: 'Alert! The system behaves like a common memoryless swing, reacting to forces instantly. The past is redundant for predicting its future actions.',
      mentor: 'Red light. The active memory hypothesis is refuted. Double check if beta is too low or if dissipation is excessive.',
      oracle: 'Total amnesia. The past sleeps beneath the frost of the current instant, silent and powerless to mold any tomorrows.',
      minimal: 'Purely Markovian behavior detected.'
    },
    INCONCLUSIVE: {
      scientific: 'INSUFFICIENT OR STATIC DATA (Failed Activation). Sampling window is too narrow to catch delayed non-local trajectories.',
      human: 'Insufficient records to draw conclusions. The clones were not fed with differing histories, or the trial ceased too early.',
      mentor: 'Inconclusive run. Make sure to cycle or pulse the driver to load the accumulator ΔF and measure clone departures.',
      oracle: 'The maze silences its answers; lacking waves in the valley, the ashes of yesterday fail to write the maps of tomorrow.',
      minimal: 'Inconclusive or static simulator inputs.'
    }
  }
};
