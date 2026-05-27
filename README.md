# PRISANTEMOTRIA v2.2
## Operational Theory of Dynamic Historicity and Memory Compressibility
### Scientific Memorial, Engineering Guide, and Tri-Layer Validation Protocol

---

## 1. Introduction & Paradigm Shift

The original theoretical formulation of **Prisantemotria** (v1.0) approached the history of complex systems through an overly abstract ontology, analyzing identity, memory, trauma, and habit as deformations in a subjective phenomenological space.

The central epistemological breakthrough consolidated starting in **version 2.0** and fully refined in **version 2.2** is the abandonment of qualitative metaphysics in favor of an empirical, rigorously falsifiable methodology. The entire framework has been restructured to address a fundamental operational question:

> **Does an explicit historical degree of freedom produce discernibles in dynamic observables that cannot be efficiently emulated by equivalent low-dimensional Markovian baselines?**

With this transition, the project moves from a conceptual philosophy to a concrete:
* **Minimal dynamical theory for systems with explicit causal memory.**
* Analytical framework to identify when the past actively shapes future physical state trajectories.
* Classification tool for viscoelastic dissipative systems engineered with delayed temporal feedback loops.

---

## 2. Postulate and Working Hypotheses

### 2.1 Fundamental Postulate
The local instantaneous state of a system in traditional phase space, denoted by $(S(t), \dot{S}(t))$, is insufficient to uniquely determine its future evolution under generalized external excitations. There exists an autocoherent, dissipative historical degree of freedom, denoted by $\Delta F(t)$, which actively couples physical forces.

### 2.2 Weak Hypothesis (v1.0)
An explicit historical degree of freedom $\Delta F(t)$ exists, possessing causal and predictive power over the future evolution of the physical state $S$:

$$P(S_{t+1} \mid S_t, \Delta F_t) \neq P(S_{t+1} \mid S_t)$$

This hypothesis is verified empirically when the predictive gain index ($\Phi$) obtained by including $\Delta F$ is significantly greater than zero on validation trials, and clones subjected to differing excitation histories display diverging future responses under identical future signals.

### 2.3 Strong Hypothesis (v1.2)
There is no equivalent finite, low-dimensional linear Markovian embedding capable of perfectly reproducing the internal fluctuations and dynamics of a semi-deterministic historically dependent system. Seeking to reconstruct $\Delta F$ via linear time-delay lags:

$$S'_t = (S_t, S_{t-1}, S_{t-2}, \dots, S_{t-k})$$

demands a minimum embedding dimension $k^*(\epsilon)$ that scales exponentially or as a power-law with respect to the characteristic timescale of the memory decay parameters.

---

## 3. The Minimal Dynamical Core (Governing Differential Equations)

The elementary analytical modeling of Prisantemotria is expressed as a system of two coupled ordinary differential equations:

### 3.1 State Equation (Physical System Dynamics)
$$m \ddot{S} + \gamma \dot{S} + V'(S) = E(t) + \beta \Delta F$$

Where:
* $m$: Physical state inertia (effective mass).
* $\gamma$: Viscous damping coefficient representing dissipation to the exterior enviornment.
* $V'(S)$: Restoring force derived from the studied potential landscape $V(S)$ (Harmonic or Double-Well).
* $E(t)$: Exogenous external driving impulse.
* $\beta$: Coupling strength of the historical/residual force.

### 3.2 Field Equation (Historical Dynamic Field)
$$\tau_H \dot{\Delta F} = -\Delta F + \alpha \dot{S} + \eta S$$

Where:
* $\tau_H$: Characteristic time-scale of memory relaxation (forgetting rate).
* $\alpha$: Plastic impression rate driven by sharp transitions or velocity ($\dot{S}$).
* $\eta$: Cumulative impression rate driven by static exposure duration to the state ($S$).
* $-\Delta F$: Spontaneous decay/forgetting rate of the historical state.

### 3.3 Strict Equivalence to the Generalized Langevin Equation (GLE)
It is analytically demonstrable that the particular solution for $\Delta F(t)$ represents a causal exponential convolution:

$$\Delta F(t) = \frac{1}{\tau_H} \int_{-\infty}^{t} e^{-\frac{t-s}{\tau_H}} \left( \alpha \dot{S}(s) + \eta S(s) \right) \, ds$$

Substituting this convolution directly into the equation governing $S$ yields:

$$m \ddot{S}(t) + \gamma \dot{S}(t) + V'(S(t)) = E(t) + \frac{\beta}{\tau_H} \int_{-\infty}^t e^{-\frac{t-s}{\tau_H}} \left( \alpha \dot{S}(s) + \eta S(s) \right) \, ds$$

This expansion reveals that the minimal dynamical core of Prisantemotria is mathematically isomorphic to a classical **Generalized Langevin Equation (GLE)** with an exponential relaxation kernel, aligning the library with viscoelastic material science and non-equilibrium thermodynamics.

---

## 4. Variational and Hamiltonian Foundation

To establish energetic consistency of the coupled system, we map the equations to an extended classical variational basis.

### 4.1 Extended Lagrangian Density
$$L = L_{\text{mat}} + L_{\text{hist}} + L_{\text{acopl}}$$

$$L = \frac{1}{2}m\dot{S}^2 - V(S) + \frac{1}{2}m_H \dot{\Delta F}^2 - U(\Delta F) + \beta S \Delta F - \gamma_H \Delta F \dot{\Delta F}$$

Where:
* $m_H$: Activation inertia of the historical field, constrained such that $m_H = \tau_H \gamma_H$.
* $U(\Delta F)$: Potentiel regulator governing memory landscape.
* $-\gamma_H \Delta F \dot{\Delta F}$: Dissipative friction-like forgetting term in historical coordinates.

### 4.2 Potential Energy Landscapes $U(\Delta F)$
Adjusting the geometry of the historical potential energy $U$ models distinct behavioral phases:
1. **Harmonic Habit**: Modeled by a simple parabola $U(\Delta F) = \frac{1}{2} k_H \Delta F^2$. The memory tends to decay linearly toward neutral center.
2. **Bistable Trauma**: Modeled by a Landau-Ginzburg double well $U(\Delta F) = a\Delta F^4 - b\Delta F^2$. Intense past transients lock the memory within asymmetric persistent valleys (mathematical signature of systemic trauma).

### 4.3 Hamiltonian Form
Defining canonical momenta $P_S = m\dot{S}$ and $P_H = m_H \dot{\Delta F} - \gamma_H \Delta F$:

$$H = \frac{P_S^2}{2m} + V(S) + \frac{\left(P_H + \gamma_H \Delta F\right)^2}{2m_H} + U(\Delta F) - \beta S \Delta F$$

The corresponding canonical Hamilton equations guide 4D state trajectories $(S, P_S, \Delta F, P_H)$:

$$\dot{S} = \frac{P_S}{m}, \quad \dot{P}_S = -V'(S) + \beta \Delta F$$

$$\dot{\Delta F} = \frac{P_H + \gamma_H \Delta F}{m_H}, \quad \dot{P}_H = -U'(\Delta F) - \frac{\gamma_H}{m_H}\left(P_H + \gamma_H \Delta F\right) + \beta S$$

---

## 5. The Tri-Layer Architecture (v2.2)

To secure long-term scientific credibility and separate visual play from rigorous statistics, **Prisantemotria Lab v2.2** modularizes its codebase into three separated functional layers:

### 5.1 Interactive Exploration Layer
Allows dynamic, high-fidelity real-time simulation and phase-portrait plotting:
* **LabCore**: Interactive ODE solvers, physical hysteresis curves, phase-space vector overlays, and live clone state tracking.
* **LabBaselines**: Fits Markovian autoregressive models against experimental logs to compute predictability differentials.
* **LabReservoir**: Runs an analogue 200-neuron dynamic Echo State Network (ESN) reservoir simulator with customizable spectral radius parameters.
* **LabCompression**: Visualizes dynamic embeddings and tracks $k^*$ indices under varying time-delay conditions.
* **LabDocumentation**: An in-app presentation of the differential equations and variational mechanics.

### 5.2 Falsifiable Validation Layer
Enforces static configuration, eliminating UI contamination or parameter volatility. Each test execution invokes an ensemble of deterministically seeded simulations layered with micro-stochastic initial-state perturbations ($\pm 0.02$) to test robust behavior over initial data:

#### 5.2.1 Standardized Scientific Metrics
1. **Residual Energy ($E_{\text{res}}$)**: Integrates persistent post-excitation energy in the interval $[t_{\text{stim\_off}}, t_{\text{end}}]$:
   
   $$E_{\text{res}} = \int_{t_{\text{stim\_off}}}^{t_{\text{end}}} S(t)^2 \, dt$$

2. **Relaxation Time ($T_{\text{rel}}$)**: The relative duration following stimulus termination before the physical state $S(t)$ settles permanently within a 1% threshold of its global absolute maximum:
   
   $$|S(t)| < 0.01 \max(|S|), \quad \forall t \ge t_{\text{stim\_off}} + T_{\text{rel}}$$

3. **Clone Divergence ($D_{\text{clone}}$)**: The root-mean-square (RMS) distance between two trajectories initialized with disparate driving histories but synchronized and propelled by identical future signals:
   
   $$D_{\text{clone}} = \sqrt{\frac{1}{N} \sum_{i=1}^{N} (S_{A}(t_i) - S_{B}(t_i))^2}$$

4. **Spectral Stability ($S_{\text{stab}}$)**: Active robust dampening under colored background noise, evaluated as the inverse of low-frequency variance computed over discrete low-frequency DFT bins:
   
   $$S_{\text{stab}} = \frac{1}{\text{Variance}_{\text{low\_freq}} + 10^{-6}}$$

#### 5.2.2 Automated Test Suite
* **Ghost Residual Persistence (Test 1)**: Tests whether the coupled historical system outlasts the relaxation of an equivalent uncoupled Markov baseline.
* **Clone Divergence (Test 2)**: Quantifies state memory by driving clones with disparate past waveforms.
* **Noise Robustness (Test 3)**: Audits spectral stability under continuous colored noise perturbations.

#### 5.2.3 2D Parameter Stability Sweep
Executes a high-efficiency 2D grid covering **220 discrete Runge-Kutta 4 (RK4) simulations**:
* $\beta \in [0.0, 5.0]$ (11 steps)
* $\tau_H \in [1, 20]$ (20 steps)

Outputs high-definition heatmaps of stability boundaries which can be exported immediately as **RFC-4180 CSV files** or **lossless PNG canvas images**.

### 5.3 Downstream Interpretation Layer
Acts as an explicability server, converting abstract differential metric values into an interactive hierarchy of four distinct cognitive categories (Tiers):
1. **Technical Rigor (Tier 1)**: Formal mathematical definitions, and proofs of the selected metric.
2. **Operational Meaning (Tier 2)**: Explanation of what the data shows from a lab and parameter sensitivity perspective.
3. **Intuitive Explanation (Tier 3)**: Metaphors and simple descriptions for laypeople.
4. **Physical Analogy (Tier 4)**: Concrete physical metaphors (e.g. viscosity of honey, thermal inertia of water, magnetic shape memory alloys).

---

## 6. Repository Architecture & File Directory

```
/src
├── App.tsx                     # Frame containing the main tab structures.
├── types.ts                    # Global, strictly unified laboratorial TypeScript definitions.
├── index.css                   # Main stylesheets with the custom Cosmic Slate dark theme.
├── main.tsx                    # React entrypoint.
│
├── shared/
│   ├── types/                  # Shareable interfaces describing simulations, parameters, and models.
│   └── seeds/                  # Deterministic seed generator functions using a Mulberry32 LCG algorithm.
│
├── simulator/
│   ├── ode.ts                  # High-precision Runge-Kutta 4 (RK4) numerical ODE solvers and clone-test runners.
│   ├── baselines/              # Concrete implementations of simulator benchmarks (Markovian, Linear, Memoryless etc.).
│   ├── esn/                    # Echo State Network (ESN) reservoir simulator with analytical Ridge regression.
│   └── models/                 # Model contracts and interfaces.
│
├── validation/
│   ├── metrics/                # Metric functions (computeResidualEnergy, computeRelaxationTime, DFT variance, etc.).
│   ├── export/                 # Data exporter handling RFC-4180 CSV translation and anchor object triggers.
│   ├── sweeps/                 # Solvers evaluating the 220 grid points of beta & tauH parameter space.
│   ├── suite/                  # Central engine running randomized initial state ensemble tests.
│   ├── ValidationSuite.ts      # Main exports for the validation runner.
│   └── tests/                  # Declarations of specific test metrics (ghost, clone, noise).
│
├── interpretation/
│   ├── humanizer/              # Translates numerical points into readable qualitative tiers.
│   ├── verdicts/               # Generates supplementary qualitative epistemological summaries.
│   └── summaries/              # Pulls core statistics from active trajectories.
│
└── components/
    ├── exploration/            # Interactive components.
    │   ├── LabCore.tsx         # Trajectory controls, phase-portrait visualizer, and dynamic clone trackers.
    │   ├── LabBaselines.tsx    # Fits linear autoregression models against current waveforms.
    │   ├── LabReservoir.tsx    # Echo State Network reservoir neural activity simulator.
    │   ├── LabCompression.tsx  # Generates embeddings and evaluates lag dimensions.
    │   └── LabDocumentation.tsx# Integral equations, math, and Hamiltonians presentation.
    ├── validation/
    │   └── ValidationPanel.tsx # Automated trial controller, error logs, and the 2D Stability Canvas.
    └── interpretation/
        └── InterpretationPanel.tsx # 4-Tier Cognitive Explicability board with interactive sliders.
```

---

## 7. Falsifiability Matrix

| Operational Finding | Physical Interpretation | Epistemological Status |
|---|---|---|
| **Divergence $D_{\max} \approx 0$** | State trajectories are history-insensitive; future evolution is fully Markovian. | **Falsified**. Prisantemotria memory is redundant; uncoupled models suffice. |
| **Divergence $D > 0$ with $k^* \le 2$** | Memory exists but is simple and easily linearizable. | **Weakly Validated**. The system has lag memory but no non-local complexity. |
| **Divergence $D \ge 0.1$, $\Phi \ge 0.15$, with severe $k^*$ peaks** | History-dependence is non-Markovian, non-local, and geometrically irredutible. | **Strongly Validated**. The state requires an explicit historical degree of freedom. |

---
**README compiled and validated for Prisantemotria Lab v2.2 Standards.**  
*Predictable, explicable, and stable open-source non-linear systems modeling.*
