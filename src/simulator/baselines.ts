/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SimulationPoint, BaselineMetrics, PredictionBenchmarkResult } from '../types';

// Matrix transposition
function transpose(A: number[][]): number[][] {
  const r = A.length;
  const c = A[0].length;
  const T: number[][] = Array(c).fill(0).map(() => Array(r).fill(0));
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      T[j][i] = A[i][j];
    }
  }
  return T;
}

// Matrix multiplication A * B
function multiply(A: number[][], B: number[][]): number[][] {
  const rA = A.length;
  const cA = A[0].length;
  const cB = B[0].length;
  const C: number[][] = Array(rA).fill(0).map(() => Array(cB).fill(0));
  for (let i = 0; i < rA; i++) {
    for (let j = 0; j < cB; j++) {
      let sum = 0;
      for (let k = 0; k < cA; k++) {
        sum += A[i][k] * B[k][j];
      }
      C[i][j] = sum;
    }
  }
  return C;
}

// Standard Matrix Inversion using Gauss-Jordan Elimination with Pivoting
// Includes a small ridge regularization on the diagonal to handle colinearity safely
function invert(A: number[][], ridge: number = 1e-5): number[][] | null {
  const n = A.length;
  const M: number[][] = Array(n).fill(0).map((_, i) => {
    const row = [...A[i]];
    row[i] += ridge; // Ridge regularization
    return row;
  });

  // Identity
  const I: number[][] = Array(n).fill(0).map((_, i) => {
    const row = Array(n).fill(0);
    row[i] = 1;
    return row;
  });

  // Gauss Jordan
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(M[j][i]) > Math.abs(M[maxRow][i])) {
        maxRow = j;
      }
    }

    // Swap row
    if (maxRow !== i) {
      const tempM = M[i];
      M[i] = M[maxRow];
      M[maxRow] = tempM;

      const tempI = I[i];
      I[i] = I[maxRow];
      I[maxRow] = tempI;
    }

    // Pivot value
    const pivot = M[i][i];
    if (Math.abs(pivot) < 1e-12) {
      return null; // Singular matrix
    }

    // Divide row
    for (let j = 0; j < n; j++) {
      M[i][j] /= pivot;
      I[i][j] /= pivot;
    }

    // Eliminate other rows
    for (let j = 0; j < n; j++) {
      if (j !== i) {
        const factor = M[j][i];
        for (let k = 0; k < n; k++) {
          M[j][k] -= factor * M[i][k];
          I[j][k] -= factor * I[i][k];
        }
      }
    }
  }

  return I;
}

// Solve Ridge Regression W = (X^T * X + lambda * I)^(-1) * X^T * Y
// Returns weights array
export function fitLinearRegression(X: number[][], Y: number[]): number[] {
  const Xt = transpose(X);
  const XtX = multiply(Xt, X);
  const XtY = multiply(Xt, Y.map(y => [y]));

  const XtX_inv = invert(XtX, 1e-6);
  if (!XtX_inv) {
    // Fallback: simple averages or zero coefficients if perfectly collinear
    return Array(X[0].length).fill(0);
  }

  const W_matrix = multiply(XtX_inv, XtY);
  return W_matrix.map(row => row[0]);
}

/**
 * Fits a Markovian AR(p) model and a Historical AR(p) + \Delta F model
 * Markovian features: [S_{t-1}, S_{t-2}, ..., S_{t-p}, E_t, 1 (bias)]
 * Historical features: [S_{t-1}, S_{t-2}, ..., S_{t-p}, E_t, \Delta F_t, 1 (bias)]
 */
export function evaluateMarkovianFit(
  data: SimulationPoint[],
  order: number = 2
): {
  metrics: BaselineMetrics;
  predictions: PredictionBenchmarkResult[];
  coefficientsMarkov: number[];
  coefficientsHistoric: number[];
} {
  const N = data.length;
  if (N <= order + 5) {
    return {
      metrics: { errMarkov: 0, errHistoric: 0, phi: 0, interpretation: 'Dados insuficientes' },
      predictions: [],
      coefficientsMarkov: [],
      coefficientsHistoric: []
    };
  }

  // Prep regression targets and features
  const X_M: number[][] = []; // Markov features
  const X_H: number[][] = []; // Historical features
  const Y: number[] = [];

  for (let i = order; i < N - 1; i++) {
    // Target is next S state: S_{t+1}
    Y.push(data[i + 1].S);

    // Build AR order lags
    const lags: number[] = [];
    for (let p = 0; p < order; p++) {
      lags.push(data[i - p].S);
    }

    const E_current = data[i + 1].E;

    // Feature lines
    X_M.push([...lags, E_current, 1]); // Lags + E + Bias
    X_H.push([...lags, E_current, data[i].dF, 1]); // Lags + E + \Delta F + Bias
  }

  // Fit
  const w_M = fitLinearRegression(X_M, Y);
  const w_H = fitLinearRegression(X_H, Y);

  // Compute Predictions and residues
  const predictions: PredictionBenchmarkResult[] = [];
  let seMarkov = 0;
  let seHistoric = 0;

  for (let idx = 0; idx < Y.length; idx++) {
    const origIndex = order + idx;
    const actual = Y[idx];

    // Predict Markov AR(p)
    let pM = 0;
    for (let k = 0; k < w_M.length; k++) {
      pM += X_M[idx][k] * w_M[k];
    }

    // Predict Historical AR(p) + \Delta F
    let pH = 0;
    for (let k = 0; k < w_H.length; k++) {
      pH += X_H[idx][k] * w_H[k];
    }

    const errM = (pM - actual) * (pM - actual);
    const errH = (pH - actual) * (pH - actual);

    seMarkov += errM;
    seHistoric += errH;

    predictions.push({
      t: data[origIndex + 1].t,
      actual,
      markovPred: pM,
      historicPred: pH,
      markovError: errM,
      historicError: errH
    });
  }

  const mseM = seMarkov / Y.length;
  const mseH = seHistoric / Y.length;

  // Phi index calculation: \Phi = 1 - (Err_H / Err_M)
  let phi = 0;
  if (mseM > 0) {
    phi = 1 - (mseH / mseM);
  }
  phi = Math.max(-1, Math.min(1, phi)); // Bound appropriately

  let interpretation = '';
  if (phi <= 0.02) {
    interpretation = 'History redundant (\u03A6 \u2248 0). System is efficiently Markovian.';
  } else if (phi > 0.02 && phi < 0.2) {
    interpretation = 'Moderate memory (\u03A6 > 0). The past exerts a minor causal advantage.';
  } else {
    interpretation = 'Dominant historicity (\u03A6 \u226B 0). Instaneous state cannot explain future trajectories.';
  }

  return {
    metrics: {
      errMarkov: mseM,
      errHistoric: mseH,
      phi,
      interpretation
    },
    predictions,
    coefficientsMarkov: w_M,
    coefficientsHistoric: w_H
  };
}

/**
 * Computes k*(epsilon): The minimum Markovian AR order p required to replicate the historical system error.
 * We step p from 1 up to orderLimit and find the first order p where AR(p) MSE achieves Err_M <= Err_H + epsilon.
 */
export function findMinimumEmbeddingDimension(
  data: SimulationPoint[],
  errH: number,
  epsilon: number = 0.005,
  orderLimit: number = 12
): number {
  let matchedOrder = orderLimit;
  for (let p = 1; p <= orderLimit; p++) {
    const { metrics } = evaluateMarkovianFit(data, p);
    if (metrics.errMarkov <= errH + epsilon) {
      matchedOrder = p;
      break;
    }
  }
  return matchedOrder;
}
