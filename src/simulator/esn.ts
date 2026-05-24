/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SimulationPoint } from '../types';
import { fitLinearRegression } from './baselines';

export class EchoStateNetwork {
  private size: number;          // Number of reservoir neurons (e.g. 20)
  private spectralRadius: number;// Speed of state decay / echo memory (e.g. 0.95)
  private inputScaling: number;  // Multiplier for input weights (e.g. 0.5)
  private leakage: number;       // State leakage factor (e.g. 0.3)

  private Win: number[][];       // Random input weights [size x input_dim]
  private Wres: number[][];      // Random reservoir recurrent weights [size x size]
  private Wout: number[] = [];   // Trained readout weights [size + input_dim + 1]

  constructor(size: number = 20, spectralRadius: number = 0.9, leakage: number = 0.5) {
    this.size = size;
    this.spectralRadius = spectralRadius;
    this.inputScaling = 0.5;
    this.leakage = leakage;

    // Initialize random weights deterministically using a seed helper for stability
    this.Win = this.generateRandomMatrix(this.size, 2, -1.0, 1.0); // 2 inputs: S, E
    this.Wres = this.generateRandomMatrix(this.size, this.size, -0.5, 0.5);

    // Scale Wres to exact spectral radius approximation
    this.scaleSpectralRadius();
  }

  // Linear feedback generator for deterministic seed randomness (prevents layout flickering)
  private seedValue = 42;
  private randomSeed(): number {
    this.seedValue = (this.seedValue * 1664525 + 1013904223) % 4294967296;
    return this.seedValue / 4294967296;
  }

  private generateRandomMatrix(rows: number, cols: number, min: number, max: number): number[][] {
    const matrix: number[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: number[] = [];
      for (let c = 0; c < cols; c++) {
        row.push(min + this.randomSeed() * (max - min));
      }
      matrix.push(row);
    }
    return matrix;
  }

  // Power iteration to approximate spectral radius (largest eigenvalue) and scale the reservoir
  private scaleSpectralRadius() {
    let x = Array(this.size).fill(0).map(() => this.randomSeed() - 0.5);

    // Power iterations
    for (let iter = 0; iter < 10; iter++) {
      const nextX = Array(this.size).fill(0);
      for (let i = 0; i < this.size; i++) {
        let sum = 0;
        for (let j = 0; j < this.size; j++) {
          sum += this.Wres[i][j] * x[j];
        }
        nextX[i] = sum;
      }
      // norm
      const norm = Math.sqrt(nextX.reduce((acc, v) => acc + v * v, 0));
      if (norm < 1e-12) break;
      x = nextX.map(v => v / norm);
    }

    // Largest eigenvalue approx
    const y = Array(this.size).fill(0);
    for (let i = 0; i < this.size; i++) {
      let sum = 0;
      for (let j = 0; j < this.size; j++) {
        sum += this.Wres[i][j] * x[j];
      }
      y[i] = sum;
    }
    const eigenvalue = x.reduce((acc, val, i) => acc + val * y[i], 0);

    // Rescale Wres
    if (Math.abs(eigenvalue) > 1e-6) {
      const scale = this.spectralRadius / Math.abs(eigenvalue);
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          this.Wres[i][j] *= scale;
        }
      }
    }
  }

  /**
   * Train ESN to predict S_{t+1} using past trajectory
   * Returns predictions and intermediate neural states for visualization
   */
  public trainAndRun(data: SimulationPoint[]): {
    predictions: number[];
    states: number[][]; // activation history size x T
    mse: number;
    readoutWeights: number[];
  } {
    const T = data.length;
    if (T < 10) {
      return { predictions: [], states: [], mse: 1, readoutWeights: [] };
    }

    // 1. Collect reservoir cell states over time
    const X_states: number[][] = []; // Design matrix for training [ (T-1) x (size + input_dim + 1) ]
    const Y_targets: number[] = [];

    let x = Array(this.size).fill(0); // initial reservoir state
    const statesHistory: number[][] = [];

    for (let t_idx = 0; t_idx < T - 1; t_idx++) {
      const S = data[t_idx].S;
      const E = data[t_idx].E;

      // Update reservoir state:
      // x(t) = (1-leakage)*x(t-1) + leakage * tanh( Win * u(t) + Wres * x(t-1) )
      const nextX = Array(this.size).fill(0);
      for (let i = 0; i < this.size; i++) {
        const inputContrib = this.Win[i][0] * S + this.Win[i][1] * E;
        let resContrib = 0;
        for (let j = 0; j < this.size; j++) {
          resContrib += this.Wres[i][j] * x[j];
        }
        nextX[i] = (1 - this.leakage) * x[i] + this.leakage * Math.tanh(inputContrib * this.inputScaling + resContrib);
      }
      x = nextX;
      statesHistory.push([...x]);

      // Readout features: Concatenate [Reservoir States, Inputs, Bias]
      const features = [...x, S, E, 1];
      X_states.push(features);

      // Target is future state: S_{t+1}
      Y_targets.push(data[t_idx + 1].S);
    }

    // 2. Solve Wout on the features
    this.Wout = fitLinearRegression(X_states, Y_targets);

    // 3. Compute Predictions
    const predictions: number[] = [data[0].S]; // prepend index 0
    let absErrorSum = 0;

    for (let t_idx = 0; t_idx < T - 1; t_idx++) {
      const feat = X_states[t_idx];
      let pred = 0;
      for (let k = 0; k < this.Wout.length; k++) {
        pred += feat[k] * this.Wout[k];
      }
      predictions.push(pred);
      absErrorSum += (pred - Y_targets[t_idx]) * (pred - Y_targets[t_idx]);
    }

    const mse = absErrorSum / Y_targets.length;

    return {
      predictions,
      states: statesHistory,
      mse,
      readoutWeights: this.Wout
    };
  }
}
