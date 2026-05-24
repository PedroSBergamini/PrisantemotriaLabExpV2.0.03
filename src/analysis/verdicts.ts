/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ExperimentalVerdict {
  status: 'GREENLIGHT' | 'MARGINAL' | 'REDLIGHT' | 'INCONCLUSIVE';
  confidence: number; // Percentage confidence from 0 to 1
  reasons: string[];  // Bulleted technical items justifying the status
  humanExplanation: string; // Warm and clear explanation of the scientific result
  summarySentence: string;  // Single short high-scannable headline sentence
}

/**
 * Automates the scientific decision process based on raw evidence metrics.
 * Supports pt-BR and en-US locales.
 */
export function generateExperimentalVerdict(
  metrics: {
    phi: number;
    cloneDivergence: number;
    hysteresisArea: number;
    kStar: number;
    noiseSurvival?: number;
  },
  locale: 'pt-BR' | 'en-US' = 'pt-BR'
): ExperimentalVerdict {
  const { phi, cloneDivergence, hysteresisArea, kStar } = metrics;
  const reasons: string[] = [];
  let score = 0;
  const isEn = locale === 'en-US';

  // Track confidence factors
  let phiWeight = phi > 0.18 ? 1.0 : phi > 0.05 ? 0.6 : phi > 0.02 ? 0.2 : 0;
  let cloneWeight = cloneDivergence > 0.25 ? 1.0 : cloneDivergence > 0.05 ? 0.7 : 0;
  let hystWeight = hysteresisArea > 0.5 ? 1.0 : hysteresisArea > 0.1 ? 0.5 : 0;
  let kStarWeight = kStar >= 6 ? 1.0 : kStar >= 3 ? 0.6 : 0.1;

  // Apply analytical logic
  if (phi > 0.15) {
    reasons.push(
      isEn
        ? `Significant predictive gain (Φ = ${(phi * 100).toFixed(1)}%). Historical memory ΔF provides relevant predictive power.`
        : `Ganho preditivo expressivo (Φ = ${(phi * 100).toFixed(1)}%). A memória ΔF providenciou relevante poder explicativo.`
    );
    score += 1.0;
  } else if (phi > 0.04) {
    reasons.push(
      isEn
        ? `Moderate predictive gain (Φ = ${(phi * 100).toFixed(1)}%). The dynamic history variable provides partial analytical advantages.`
        : `Ganho preditivo moderado (Φ = ${(phi * 100).toFixed(1)}%). A variável histórica providencia alguma vantagem analítica.`
    );
    score += 0.5;
  } else {
    reasons.push(
      isEn
        ? `Negligible predictive gain (Φ = ${(phi * 100).toFixed(1)}% < 4%). Local linear Markovian baselines explain all predictive trends.`
        : `Ganho preditivo desprezível (Φ = ${(phi * 100).toFixed(1)}% < 4%). O modelo markoviano basal cobre toda a dinâmica previsível.`
    );
  }

  if (cloneDivergence > 0.15) {
    reasons.push(
      isEn
        ? `Severe causal clone divergence (D_max = ${cloneDivergence.toFixed(3)}). Physically identical clone twins primed with mismatched histories acted oppositely under identical driving.`
        : `Divergência expressiva de clones históricos (D_max = ${cloneDivergence.toFixed(3)}). Gêmeos físicos idênticos iniciados com memórias distintas agiram de maneira acentuadamente diferente sob condução comum.`
    );
    score += 1.0;
  } else if (cloneDivergence > 0.03) {
    reasons.push(
      isEn
        ? `Subtle or transient clone divergence (D_max = ${cloneDivergence.toFixed(3)}). Persistent asymmetry indicates slow relaxation of memory paths.`
        : `Divergência sutil ou temporária de clones (D_max = ${cloneDivergence.toFixed(3)}). A assimetria persistente indica relaxação lenta de história.`
    );
    score += 0.5;
  } else {
    reasons.push(
      isEn
        ? `Twin clones converged perfectly (D_max = ${cloneDivergence.toFixed(3)}). State trajectory dependence is locally Markovian.`
        : `Clones idênticos convergiram perfeitamente (D_max = ${cloneDivergence.toFixed(3)}). A dependência de estado inicial é markoviana.`
    );
  }

  if (hysteresisArea > 0.4) {
    reasons.push(
      isEn
        ? `Robust hysteresis loops witnessed (Area = ${hysteresisArea.toFixed(3)}). Indicates significant dynamic phase delay and high-cycle dissipation.`
        : `Loops de histerese robustos observados (Área = ${hysteresisArea.toFixed(3)}). Demonstra retardamento dinâmico significativo e de alto-retorno energético.`
    );
    score += 1.0;
  } else if (hysteresisArea > 0.08) {
    reasons.push(
      isEn
        ? `Subtle hysteresis loop (Area = ${hysteresisArea.toFixed(3)}). Presence of mild classical viscoelastic phase lag.`
        : `Loop de histerese sutil (Área = ${hysteresisArea.toFixed(3)}). Presença de atraso de fase viscoelástica clássico.`
    );
    score += 0.4;
  } else {
    reasons.push(
      isEn
        ? `Perfect linear elastic response without loops. No phase lag detected under periodic drive.`
        : `Resposta elástica linear perfeita sem loops visíveis. Não há atraso de fase na condução.`
    );
  }

  if (kStar >= 6) {
    reasons.push(
      isEn
        ? `High linear embedding dimensionality required (k* = ${kStar}). System requires tracking multiple historical logs to emulate ΔF.`
        : `Dificuldade de embedding linear elevada (k* = ${kStar}). O sistema exige o rastreio cumulativo de múltiplas iterações consecutivas para simular ΔF.`
    );
    score += 1.0;
  } else if (kStar >= 3) {
    reasons.push(
      isEn
        ? `Autoregressive embedding requires moderate size (k* = ${kStar}). Memory feedback is partially compressible.`
        : `Embedding markoviano requer ordem moderada (k* = ${kStar}). A dinâmica de memória é passível de compressão parcial.`
    );
    score += 0.6;
  } else {
    reasons.push(
      isEn
        ? `Highly compressible history (k* = ${kStar}). Adding 1 or 2 past lags completely replicates historical field effects.`
        : `Alta compressibilidade (k* = ${kStar}). Bastam 1 ou 2 termos adicionais para apagar a necessidade do campo histórico.`
    );
  }

  // Calculate overall confidence level
  const avgWeight = (phiWeight + cloneWeight + hystWeight + kStarWeight) / 4;
  let confidence = 0.5 + 0.45 * avgWeight; // Scale from 50% to 95% depending on weights

  // Resolve status based on normalized scores
  let status: 'GREENLIGHT' | 'MARGINAL' | 'REDLIGHT' | 'INCONCLUSIVE';
  let humanExplanation = '';
  let summarySentence = '';

  const totalPossibleScore = 4.0;
  const ratio = score / totalPossibleScore;

  if (ratio >= 0.75) {
    status = 'GREENLIGHT';
    summarySentence = isEn
      ? 'ADMISSIBLE HISTORICITY CONFIRMED (Real Memory Regime)'
      : 'HISTORICIDADE ADMISSÍVEL CONFIRMADA (Regime de Memória Real)';
    humanExplanation = isEn
      ? 'The validation laboratory succeeded completely in proving authentic, irreducible historicity! Physically identical clones split into opposite paths solely due to different hidden histories, and algorithms verified that memory cannot be compressed simply. In simple words: the system possesses genuine active memory that determines its future.'
      : 'O laboratório de validação obteve sucesso absoluto em provar a existência de historicidade causal irredutível! Os clones idênticos demonstraram desvios significativos puramente devido a passados distintos, e os algoritmos provaram que a memória histórica não pode ser condensada de maneira trivial. Em linguagem humana simples: o sistema possui memória autêntica ativa e ela de fato decide o futuro dele.';
  } else if (ratio >= 0.4) {
    status = 'MARGINAL';
    summarySentence = isEn
      ? 'PARTIAL HISTORICITY DETECTED (Weak Causal Lag Dependency)'
      : 'HISTORICIDADE PARCIAL DETECTADA (Dependência Causal Fraca)';
    humanExplanation = isEn
      ? 'The system displays noticeable historical dependencies, but behaves close to standard compressible scales. There are memory retention footprints and subtle hysteresis, yet a classical local model with few time lags can explain 90% of the movement. Historicity exists as an elegant shortcut, though perhaps not irreducibly.'
      : 'O sistema apresenta dependência histórica perceptível, mas ela se comporta próximo de regimes compressíveis convencionais. Há retenção de memória e histerese sutil, porém um modelo markoviano clássico com poucos atrasos de tempo consegue cobrir cerca de 90% da previsibilidade física. A historicidade existe como atalho elegante, embora possivelmente não de forma irredutível.';
  } else if (phi === 0 && cloneDivergence === 0) {
    status = 'INCONCLUSIVE';
    summarySentence = isEn
      ? 'INCONCLUSIVE DATA (Verify dynamic activation force)'
      : 'DADOS INCONCLUSIVOS (Verificar parâmetros de excitação)';
    humanExplanation = isEn
      ? 'Failed to extract conclusive dynamical feedback. Clones were not primed with mismatched paths or the trial was halted prior to the relaxation half-life. Please adjust coupling β and static settlement values.'
      : 'Não foi possível extrair comportamentos dinâmicos conclusivos. Os clones não foram carregados com histereses ou o sistema paralisou antes do término do tempo de relaxamento característico. Considere ajustar as constantes de impressão teta e acoplamento beta.';
  } else {
    status = 'REDLIGHT';
    summarySentence = isEn
      ? 'SYSTEM BEHAVES MARKOVIAN (No Real Memory Influence)'
      : 'SISTEMA COMPORTA-SE COMO MARKOVIANO (Sem efeito de Memória Real)';
    humanExplanation = isEn
      ? 'Warning signal! The laboratory refuted active historical trajectories under this parameter envelope. The delayed memory variables decayed instantly, and clones acted symmetrically. It behaves as a standard memoryless spring reactor; history is redundant here.'
      : 'Sinal de Alerta! O laboratório refutou a hipótese de historicidade explícita para este regime especial de simulação. As variáveis bi-estáveis de memória se extinguiram de forma instantânea, e os clones sincronizados agiram de maneira idêntica. Trata-se de um sistema físico comum de reação rápida, sem poder de lembrança operante. O passado é redundante.';
  }

  return {
    status,
    confidence,
    reasons,
    humanExplanation,
    summarySentence,
  };
}
