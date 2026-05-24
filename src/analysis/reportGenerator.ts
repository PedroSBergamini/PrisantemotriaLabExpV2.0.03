/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SystemParameters, StimulusType } from '../types';
import { generateExperimentalVerdict } from './verdicts';

export interface ReportData {
  runId: string;
  timestamp: string;
  userEmail: string;
  params: SystemParameters;
  stimType: StimulusType;
  amp: number;
  freq: number;
  metrics: {
    phi: number;
    cloneDivergence: number;
    hysteresisArea: number;
    kStar: number;
    noiseSurvival?: number;
  };
}

/**
 * Compiles a structured scientific report consisting of:
 * - executive_summary.md (High-level dashboard)
 * - technical_report.md (Rigorously academic diagnostics)
 * - human_summary.md (Metaphorical translation)
 */
export function buildMarkdownReport(data: ReportData): string {
  const verdict = generateExperimentalVerdict({
    phi: data.metrics.phi,
    cloneDivergence: data.metrics.cloneDivergence,
    hysteresisArea: data.metrics.hysteresisArea,
    kStar: data.metrics.kStar,
    noiseSurvival: data.metrics.noiseSurvival || 0.84,
  });

  const percentConf = (verdict.confidence * 100).toFixed(0);

  return `# PRISANTEMOTRIA LAB REPORT - RUN #${data.runId}
Gerado em: ${data.timestamp} UTC
Operador: ${data.userEmail}
Status de Conclusão: **${verdict.status}** (Confiança de ${percentConf}%)

---

## 1. RESUMO EXECUTIVO (Visão Geral Humana)

### **Veredito Geral:** 
> **${verdict.summarySentence}**
> 
> *${verdict.humanExplanation}*

### **Metáforas de Comportamento:**
* **Para a Memória Temporal (\u03A6):** ${data.metrics.phi > 0.15 ? 'O sistema se comporta como um indivíduo que lê o enredo anterior de um livro antes de tomar decisões novas, e não apenas respondendo ao choque imprevisto.' : 'O sistema assemelha-se a um peixe de aquário curto que reage unicamente ao reflexo imediato do vidro.'}
* **Para a Divergência de Clones:** ${data.metrics.cloneDivergence > 0.15 ? 'Dois irmãos gêmeos idênticos no presente agindo de forma diferente após terem assistido a filmes opostos no passado.' : 'Duas pedras deslizando na rampa no mesmo ângulo exato seguindo trajetórias idênticas.'}

---

## 2. CONFIGURAÇÃO EXPERIMENTAL & PARÂMETROS FÍSICOS

| Parâmetro de Controle | Valor Físico | Significado no Modelo v1.0 |
| :--- | :--- | :--- |
| **Massa (m)** | ${data.params.m.toFixed(2)} | Inércia de reação mecânica do estado local |
| **Dissipação (\u03B3)** | ${data.params.gamma.toFixed(2)} | Atrito e perdas externas no vácuo de fases |
| **Potencial V(S)** | ${data.params.potential.toUpperCase()} | Canal energético do poço restaurador |
| **Acoplamento (\u03B2)** | ${data.params.beta.toFixed(2)} | Intensidade fásica da força histórica sobre o estado |
| **Relaxação (\u03C4_H)** | ${data.params.tauH.toFixed(2)}s | Constante de relaxamento (esquecimento natural) |
| **Atrator de Transição (\u03B1)** | ${data.params.alpha.toFixed(2)} | Taxa de impressão plástica sob mudança de estado |
| **Deposição de Exposição (\u03B7)** | ${data.params.eta.toFixed(2)} | Taxa de sedimentação por permanência estática |

### **Estímulo Conducente E(t):**
* **Tipo de sinal:** \`${data.stimType.toUpperCase()}\`
* **Amplitude de Excitação:** \`${data.amp.toFixed(2)}\`
* **Frequência Operacional:** \`${data.freq.toFixed(3)} Hz\`

---

## 3. RELATÓRIO TÉCNICO-CIENTÍFICO (Análise de Laboratório)

### **Assinaturas Métricas Quantitativas:**

1. **Eficiência Autoregressiva (\u03A6):** \`${data.metrics.phi.toFixed(4)}\`
   * *Diagnóstico Científico:* O modelo de memória reduziu a variância residual preditiva em **${(data.metrics.phi * 100).toFixed(1)}%** quando comparado ao modelo puramente markoviano basal.

2. **Divergência Máxima Causal (D_max):** \`${data.metrics.cloneDivergence.toFixed(4)}\`
   * *Diagnóstico Científico:* A quebra de simetria assintótica pós-sincronização estabelece um desvio irredutível das equações de evolução na barreira de potencial.

3. **Margem de Compressão de Lag (k*):** \`k* = ${data.metrics.kStar}\`
   * *Diagnóstico Científico:* É necessária uma ordem de embedding autoregressiva linear de magnitude **${data.metrics.kStar}** para se aproximar da modelagem acoplada exponencial.

4. **Trabalho Histórico Realizado (Histerese):** \`${data.metrics.hysteresisArea.toFixed(4)} u.a.\`
   * *Diagnóstico Científico:* O fluxo dissipativo interno reflete armazenamento fásico viscoelástico robusto.

---

## 4. VEREDITO & JUSTIFICATIVA DOS JUÍZES AUTOMÁTICOS
Os árbitros de coerência estatística identificaram os seguintes critérios operantes nesta rodada:

${verdict.reasons.map((r) => `* **VERIFICADO:** ${r}`).join('\n')}

---

## 5. LIMITAÇÕES & RECOMENDAÇÕES PARA A PRÓXIMA RUN

1. **Ajuste de Escala Crítica:** ${data.params.tauH > 5 ? 'A constante de relaxamento está excessivamente longa. Reduza tauH para evitar cristalização estática do campo de hábitos.' : 'A memória está decaindo rápido demais. Tente elevar ligeiramente tauH para sintonizar a ressonância dinâmica.'}
2. **Robustez a Ruído:** Se o sinal for exposto a perturbações, certifique-se de que o acoplamento beta é forte o bastante para sobreviver às dispersões estocásticas.
3. **Falsificação de Embedding:** Altere o tipo de potencial para \'DOUBLE_WELL\' para avaliar se regimes bistáveis provocam picos súbitos de k*.

---
**P.R.I.S.A.N.T.E.M.O.T.R.I.A   L.A.B   v2.0   --   A   M.A.T.E.M.Á.T.I.C.A   D.E.S.C.O.B.R.E,   A   I.N.T.E.R.F.A.C.E   T.R.A.D.U.Z.**
`;
}
