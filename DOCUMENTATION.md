# PRISANTEMOTRIA v2.2.1-Freeze
## Operational Theory of Dynamic Historicity and Memory Compressibility
### Scientific Memorial, Engineering Guide, and Tri-Layer Validation Protocol

---

## 1. Introduction & Paradigm Shift

The original theoretical formulation of **Prisantemotria** (v1.0) approached the history of complex systems through an overly abstract ontology, analyzing identity, memory, trauma, and habit as deformations in a subjective phenomenological space.

The central epistemological breakthrough consolidated starting in **version 2.0** and fully refined in **version 2.2.1-Freeze** is the abandonment of qualitative metaphysics in favor of an empirical, rigorously falsifiable methodology. The entire framework has been restructured to address a fundamental operational question:

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
* $\gamma$: Viscous damping coefficient representing dissipation to the exterior environment.
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
* $U(\Delta F)$: Potential regulator governing memory landscape.
* $-\gamma_H \Delta F \dot{\Delta F}$: Dissipative friction-like forgetting term in historical coordinates.

### 4.2 Potential Energy Landscapes $U(\Delta F)$
Adjusting the geometry of the historical potential energy $U$ models distinct behavioral phases:
1. **Harmonic Habit**: Modeled by a simple parabola $U(\Delta F) = \frac{1}{2} k_H \Delta F^2$. The memory tends to decay linearly toward neutral center.
2. **Bistable Trauma**: Modeled by a Landau-Ginzburg double well $U(\Delta F) = a\Delta F^4 - b\Delta F^2$. Intense past transients lock the memory within asymmetric persistent valleys (mathematical signature of systemic trauma).

### 4.3 Hamiltonian Form
Defining canonical momenta $P_S = m\dot{S}$ and $P_H = m_H \dot{\Delta F} - \gamma_H \Delta F$:

$$H = \frac{P_S^2}{2m} + V(S) + \frac{\left(P_H + \gamma_H \Delta F\right)^2}{2m_H} + U(\Delta F) - \beta S \Delta F$$

Hamilton's equations govern the evolution in the extended 4D phase space $(S, P_S, \Delta F, P_H)$:

$$\dot{S} = \frac{P_S}{m}, \quad \dot{P}_S = -V'(S) + \beta \Delta F$$

$$\dot{\Delta F} = \frac{P_H + \gamma_H \Delta F}{m_H}, \quad \dot{P}_H = -U'(\Delta F) - \frac{\gamma_H}{m_H}\left(P_H + \gamma_H \Delta F\right) + \beta S$$

---

## 5. The Tri-Layer Architecture (v2.2)

The scientific validation laboratory **Prisantemotria Lab** organizers itself across three key architectural tiers, bridging interactive exploration, Popperian falsifiability, and dynamic data explicability.

### 5.1 Exploration Layer
Provides strict real-time visualizers and phase portraits for active simulation trajectories:
* **LabCore**: Manual differential parameter tuning, phase vector plotting, and live clone tracking.
* **LabBaselines**: Fits linear autoregressions against current trajectories to assess performance gains.
* **LabReservoir**: Echo State Network (ESN) with up to 200 dynamic recurrent nodes to map reservoir representation spaces.
* **LabCompression**: Quantifies embedding dimensions $k^*$ and explores memory compressibility.

### 5.2 Scientific Validation Layer (Validation)
Implements a strict popperian **stochastic falsification sweep**. Each validation test executes multiple repetitions under independent micro-stochastic initial-state perturbations ($\pm 0.02$) to guarantee robustness against overfitting and numerical artifacts.

#### 5.2.1 Standardized Scientific Metrics
1. **Residual Energy ($E_{\text{res}}$)**: Measures active persistence after driving signals shut off, integrated over $[t_{\text{stim\_off}}, t_{\text{end}}]$:

   $$E_{\text{res}} = \int_{t_{\text{stim\_off}}}^{t_{\text{end}}} S(t)^2 \, dt$$

2. **Relaxation Time ($T_{\text{rel}}$)**: The relative duration needed for $S(t)$ to decay fully within a 1% tolerance margin relative to its historic amplitude:

   $$|S(t)| < 0.01 \max(|S|), \quad \forall t \ge t_{\text{stim\_off}} + T_{\text{rel}}$$

3. **Clone Divergence ($D_{\text{clone}}$)**: The Root-Mean-Square difference between two trajectories that underwent distinct excitation histories in the past but are currently driven by identical signals:

   $$D_{\text{clone}} = \sqrt{\frac{1}{N_{points}} \sum_{i=1}^{N_{points}} (S_{A}(t_i) - S_{B}(t_i))^2}$$

4. **Spectral Stability ($S_{\text{stab}}$)**: Dynamically evaluates the inverse variance of low frequencies computed using discrete DFT slots under colored noise.

   $$S_{\text{stab}} = \frac{1}{\text{Variance}_{\text{low\_freq}} + 10^{-6}}$$

#### 5.2.2 Falsifiable Test Suite
*   **Ghost Residual (Test 1)**: Contrasts relaxation trajectories with a Markovian control ($\beta=0$). Falsifies memory claims if the control dissipates slower or holds higher integrated energy.
*   **Clone Divergence (Test 2)**: Forces synchronization of two distinct historical clones and tracks their downstream path divergence. Falsifies theory if trajectories collapse onto a single symmetric line.
*   **Noise Robustness (Test 3)**: Audits system stability and structural integrity under low-frequency stochastics.

#### 5.2.3 Two-Dimensional Parametric Sweep
Features a comprehensive grid sweep executing **220 RK4 simulations** over parameter states:
*   $\beta \in [0.0, 5.0]$ (11 grid points)
*   $\tau_H \in [1, 20]$ (20 grid points)

This maps persistence boundaries into a high-contrast thermal image that can be downloaded as standard RFC-4180 CSV logs or PNG figures via pixel-buffer dumps.

### 5.3 Interpretation Layer (Explanation)
Translates dense, dry scientific metrics into structured explanations mapped to a **four-tier cognitive hierarchy**:
1.  **Technical Level (Tier 1)**: Mathematical formulations and proofs.
2.  **Laboratory Meaning (Tier 2)**: Core functional takeaways regarding predictability and parameters.
3.  **Human Analogy (Tier 3)**: Simple everyday stories describing memory-folding phenomena.
4.  **Physical Analogy (Tier 4)**: Tangible macro materials (e.g. honey viscosity, thermal buffers, shape memory alloys).

---

## 6. Epistemic Separation & Scientific Freeze (Patch v2.2.1)

To ensure the highest standard of scientific integrity, **Patch v2.2.1-Freeze** locks down testing configurations and rules out exploratory presets as valid experimental proof.

### 6.1 Strict Implementation Rules
1.  **Epistemic Separation**: The validation codebase must not import or depend on exploration scripts.
2.  **No Silent Clamping**: No silent clipping or artificial parameter clamping is permitted in mathematical calculations.
3.  **1σ Preliminary Pass Criteria**: Evaluations apply conservative standard-deviation parameters to flag assertions under an explicit `PRELIMINARY_PASS` or `FAIL` rubric.
4.  **Reproducible Metadata Integration**: File exports (CSV and JSON) compile explicit system metadata declaring safety warnings, active presets, and a deterministic tracking footprint.

---
**Documentation compiled and validated for Prisantemotria Lab v2.2.1-Freeze Standards.**  
*Predictable, explicable, and stable open-source non-linear systems modeling.*
