/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LocaleType = 'pt-BR' | 'en-US';

export type ExplanationDepth = 'simple' | 'intuitive' | 'operational' | 'formal' | 'metaphorical';

export type NarrativeTone = 'scientific' | 'human' | 'mentor' | 'oracle' | 'minimal';

export interface ExplanationLayer {
  simple: string;
  intuitive: string;
  operational: string;
  formal: string;
  metaphorical: string;
}

export interface CognitiveTranslation {
  concept: string;
  explanations: ExplanationLayer;
  suggestedAction?: string;
}

export interface DictScenario {
  id: number;
  tier: number;
  tierTitle: string;
  title: string;
  description: string;
  checklist: string[];
  expectedSignature: string;
}

export interface Dictionary {
  common: {
    runSimulation: string;
    stopSimulation: string;
    resetSimulation: string;
    explorationLevel: string;
    guidedExploration: string;
    advancedMode: string;
    scientificHeaderTitle: string;
    scientificHeaderSubtitle: string;
    tabs: {
      core: string;
      baselines: string;
      reservoir: string;
      compression: string;
      docs: string;
    };
    welcomeGuideTitle: string;
    welcomeGuideCollapse: string;
    welcomeGuideShow: string;
    welcomeGuideDesc: string;
    welcomeSteps: {
      step1Title: string;
      step1Desc: string;
      step2Title: string;
      step2Desc: string;
      step3Title: string;
      step3Desc: string;
      step4Title: string;
      step4Desc: string;
      step5Title: string;
      step5Desc: string;
    };
    welcomeGuideFooterLeft: string;
    welcomeGuideFooterRight: string;
    currentStateHeader: string;
    systemParamsHeader: string;
    scenariosHeader: string;
    runActiveSnapshot: string;
    importNotebook: string;
    exportNotebook: string;
    noRunsRecorded: string;
    recordedRunsTitle: string;
    notebookTitle: string;
    notebookSubtitle: string;
    congelarRun: string;
    notebookNamePlaceholder: string;
    notebookNotesPlaceholder: string;
    saveBtn: string;
    discoveriesTitle: string;
    discoveriesSubtitle: string;
    discoveriesRecorded: string;
    showOnboardingBtn: string;
    systemStateLabel: string;
    potentialLabel: string;
    stimulusLabel: string;
    mLabel: string;
    gammaLabel: string;
    betaLabel: string;
    tauHLabel: string;
    alphaLabel: string;
    etaLabel: string;
    vHeightLabel: string;
    amplitudeLabel: string;
    frequencyLabel: string;
    activeDriversTitle: string;
    clonesDmaxLabel: string;
    hysteresisLabel: string;
    phiLabel: string;
    kStarLabel: string;
    noiseSurvivalLabel: string;
    dFLabel: string;
    hamiltonianLabel: string;
    clonesTitle: string;
    clonesSyncDesc: string;
    primeA: string;
    primeB: string;
    syncClonesBtn: string;
    phaseSpaceOrbitTitle: string;
    coupledMemoryFieldTitle: string;
    trajectoryTemporalTitle: string;
    hysteresisTitle: string;
    hamiltonianEnergyTitle: string;
    theoreticalNotesTitle: string;
    doubtBtn: string;
    hideGuideBtn: string;
    optimalStatus: string;
    moderateStatus: string;
    neutralStatus: string;
    criticalStatus: string;
    activePresetLabel: string;
    customPresetLabel: string;
    difficultyLabel: string;
    categoryLabel: string;
    unknownDiagnostic: string;
  };
  tooltips: {
    m: CognitiveTranslation;
    gamma: CognitiveTranslation;
    potential: CognitiveTranslation;
    beta: CognitiveTranslation;
    tauH: CognitiveTranslation;
    alpha: CognitiveTranslation;
    eta: CognitiveTranslation;
    vHeight: CognitiveTranslation;
    phi: CognitiveTranslation;
    cloneDivergence: CognitiveTranslation;
    kStar: CognitiveTranslation;
    hysteresis: CognitiveTranslation;
    noiseRobustness: CognitiveTranslation;
  };
  diagnostics: {
    currentSystemState: string;
    analogies: string;
    suggestions: string;
    narrativeTones: {
      scientific: string;
      human: string;
      mentor: string;
      oracle: string;
      minimal: string;
    };
    metrics: {
      phi: {
        title: string;
        status: {
          NEUTRAL: Record<NarrativeTone, string>;
          MODERATE: Record<NarrativeTone, string>;
          OPTIMAL: Record<NarrativeTone, string>;
        };
      };
      clone_div: {
        title: string;
        status: {
          NEUTRAL: Record<NarrativeTone, string>;
          MODERATE: Record<NarrativeTone, string>;
          OPTIMAL: Record<NarrativeTone, string>;
        };
      };
      k_star: {
        title: string;
        status: {
          NEUTRAL: Record<NarrativeTone, string>;
          MODERATE: Record<NarrativeTone, string>;
          CRITICAL: Record<NarrativeTone, string>;
        };
      };
      hysteresis: {
        title: string;
        status: {
          NEUTRAL: Record<NarrativeTone, string>;
          MODERATE: Record<NarrativeTone, string>;
          OPTIMAL: Record<NarrativeTone, string>;
        };
      };
      noise_robustness: {
        title: string;
        status: {
          CRITICAL: Record<NarrativeTone, string>;
          MODERATE: Record<NarrativeTone, string>;
          OPTIMAL: Record<NarrativeTone, string>;
        };
      };
    };
    verdicts: {
      GREENLIGHT: Record<NarrativeTone, string>;
      MARGINAL: Record<NarrativeTone, string>;
      REDLIGHT: Record<NarrativeTone, string>;
      INCONCLUSIVE: Record<NarrativeTone, string>;
    };
  };
  scenarios: DictScenario[];
  achievements: Record<string, {
    title: string;
    badge: string;
    condition: string;
    feedback: string;
  }>;
}
