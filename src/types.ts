/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Model Types for the Potential energy V(S)
export type PotentialType = 'harmonic' | 'double_well' | 'soft_asymmetric';

// Stimulus/Input shapes for E(t)
export type StimulusType = 'sine' | 'pulse' | 'chirp' | 'bistable' | 'thermal_noise';

// Core Parameters for the Coupled Dynamical System S <-> \Delta F
export interface SystemParameters {
  m: number;         // State inertia (mass)
  gamma: number;     // State dissipation (damping)
  potential: PotentialType; // Potential shape $V(S)$
  beta: number;      // Historical coupling strength (force amplification)
  tauH: number;      // Memory characteristic time scale ($tau_H$)
  alpha: number;     // Memory impression rate by transition ($S'$)
  eta: number;       // Memory impression rate by exposure duration ($S$)
  V_height: number;  // Height barrier for double well potential
}

// Full simulation point at a specific tick
export interface SimulationPoint {
  t: number;          // Time coordinate
  E: number;          // External driving impulse E(t)
  S: number;          // State coordinate
  dS: number;         // Velocity S' (derivative)
  dF: number;         // Memory variable \Delta F
  Hamiltonian: number;// Total mechanical energy H
  P_S: number;        // Momentum of the physical state m * S'
  P_H: number;        // Momentum of the historical state
  U_dF: number;       // Potential energy of the historical variable
  V_S: number;        // Potential energy of the physical variable
}

// Clone Test results
export interface CloneRunResult {
  timeSeries: Array<{
    t: number;
    E: number;
    S_A: number;
    S_B: number;
    dF_A: number;
    dF_B: number;
    divergence: number; // |S_A(t) - S_B(t)|
  }>;
  finalDivergence: number;
  isCausallyDivergent: boolean; // True if divergence > critical threshold
}

// Comparison performance between the true system dynamics and a Markov model
export interface PredictionBenchmarkResult {
  t: number;
  actual: number;      // True S_{t+1}
  markovPred: number;  // Markovian prediction (e.g. AR(2) fit)
  historicPred: number;// Non-Markovian predictive model (incorporating \Delta F)
  markovError: number;
  historicError: number;
}

// Baseline statistics of models
export interface BaselineMetrics {
  errMarkov: number;    // Mean Squared Error of purely Markov baseline
  errHistoric: number;   // Mean Squared Error of system incorporating \Delta F
  phi: number;          // Historic Index \Phi = 1 - (Err_H / Err_M)
  interpretation: string;
}

// Reservoir node activations for visualization
export interface ReservoirState {
  inputs: number[];
  activations: number[];
  predictions: number[];
  readoutWeights: number[];
}

// Phase Sweep Data Point for heatmaps
export interface PhaseSweepPoint {
  beta: number;
  tauH: number;
  phi: number;
  clonesDivergence: number;
  hysteresisArea: number;
  kStar: number; // Minimum Markovian embedding dimension
}
