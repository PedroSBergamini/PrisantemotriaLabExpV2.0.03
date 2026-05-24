/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DictScenario } from '../types';

export const scenarios: DictScenario[] = [
  {
    id: 1,
    tier: 1,
    tierTitle: 'Tier 1: Entender Memória',
    title: 'Sistema Sem Memória',
    description: 'Conhecer a partícula no poço de potencial elástico clássico, onde heranças são desligadas (β = 0.0) e as respostas são instantâneas.',
    checklist: [
      'Defina beta = 0.0 (canal de hábitos inativo)',
      'Observe como S(t) segue estritamente o estímulo externo',
      'Perceba a ausência total de loops de atraso (histerese = 0)'
    ],
    expectedSignature: 'Φ = 0.00%, D_max = 0.00'
  },
  {
    id: 2,
    tier: 1,
    tierTitle: 'Tier 1: Entender Memória',
    title: 'Relaxação Saudável',
    description: 'Um acoplamento moderado com relaxamento rápido. A memória atua como amortecimento dinâmico saudável, dissipando de forma exponencial e restaurando o estado original.',
    checklist: [
      'Eleve beta moderadamente (0.5 a 0.8)',
      'Configure tempo de relaxamento tauH em torno de 2.0s',
      'Observe o retorno elástico fluído no espaço de fases'
    ],
    expectedSignature: 'Φ ≈ 4.0% a 8.0%, Retorno Fluido'
  },
  {
    id: 3,
    tier: 1,
    tierTitle: 'Tier 1: Entender Memória',
    title: 'Memória Viscoelástica',
    description: 'Aqui a retenção é considerável. O campo residual ΔF(t) age como uma mola de atraso fásico, resistindo às perturbações e puxando o sistema lentamente de volta.',
    checklist: [
      'Aumente tempo de memória tauH para 4.5s ou mais',
      'Defina beta em 0.8',
      'Veja o rastro persistente gerando ondas viscoelásticas na fumaça ΔF(t)'
    ],
    expectedSignature: 'Φ ≈ 8.0% a 15.0%, Loop de fase visível'
  },
  {
    id: 4,
    tier: 2,
    tierTitle: 'Tier 2: Entender Historicidade',
    title: 'Histerese Crítica',
    description: 'As fases de subida e descida desenham caminhos visivelmente distintos. O sistema consome e armazena energia em ciclos irreversíveis de asas de borboleta.',
    checklist: [
      'Ative potencial DOUBLE_WELL (poço duplo)',
      'Defina beta = 1.0 e tauH = 5.0s',
      'Observe os enormes caminhos divergentes quando a força excita e retorna'
    ],
    expectedSignature: 'Área de Histerese > 0.40, Φ Elevado'
  },
  {
    id: 5,
    tier: 2,
    tierTitle: 'Tier 2: Entender Historicidade',
    title: 'Trauma Cristalizado',
    description: 'Alta deposição por exposição (eta). Ficar muito tempo parado em uma calha deforma o próprio mapa de potencial, cristalizando hábitos persistentes na estrutura física.',
    checklist: [
      'Configure eta = 1.8 (altíssima deposição estática)',
      'Mantenha o sistema em uma calha sob excitação leve ou constante',
      'Observe o sistema criar uma bacia profunda, incapaz de saltar'
    ],
    expectedSignature: 'Deformidade Permanente, Baixo D_max'
  },
  {
    id: 6,
    tier: 2,
    tierTitle: 'Tier 2: Entender Historicidade',
    title: 'Trauma por Impacto',
    description: 'Alta gravação plástica motivada por aceleração e velocidade (alpha). Cada colisão transicional rápida deforma o campo e deixa cicatrizes físicas indeléveis na barreira de fases.',
    checklist: [
      'Eleve alpha para 1.5 (sensibilidade transicional brusca)',
      'Utilize sinal de pulso rápido para bombear choque na partícula',
      'Repare como as oscilações após o pico travam-se em novas memórias rápidas'
    ],
    expectedSignature: 'Φ > 15.0%, Cicatriz fásica abrupta'
  },
  {
    id: 7,
    tier: 3,
    tierTitle: 'Tier 3: Entender Não-Localidade',
    title: 'Divergência dos Gêmeos',
    description: 'Dois clones físicos perfeitamente sintonizados no presente terminam em órbitas opostas e irreversíveis devido unicamente a pequenos resíduos de seus passados distintos.',
    checklist: [
      'Rode o teste de Clone Causal com frequências de priming desequilibradas',
      'Observe as trajetórias idênticas no início se bifurcarem sob condução comum',
      'Colete os dados de D_max (afastamento físico irredutível)'
    ],
    expectedSignature: 'D_max > 0.25, Forte desvio físico'
  },
  {
    id: 8,
    tier: 3,
    tierTitle: 'Tier 3: Entender Não-Localidade',
    title: 'Edge of Chaos',
    description: 'Ponto crítico de sintonização onde a menor variação no histórico de fases joga o sistema em bacias atratoras opostas. Sensibilidade extrema a hábitos anteriores.',
    checklist: [
      'Reduza gama para 0.05 para amplificar excitação e diminuir o atrito',
      'Mantenha acoplamento beta moderado (1.2 a 1.5)',
      'Observe flutuações e movimentos erráticos que mimetizam caos determinístico'
    ],
    expectedSignature: 'Trajetórias Caóticas e Irregulares'
  },
  {
    id: 9,
    tier: 3,
    tierTitle: 'Tier 3: Entender Não-Localidade',
    title: 'Ressonância Histórica',
    description: 'Sincronia perfeita onde a frequência de bombeamento externa ressoa em harmonia com a constante de decaimento de memória tauH, induzindo picos gigantes de transferência energética.',
    checklist: [
      'Equalize o período de condução t = 1/f com a escala residual tauH',
      'Monitore o hamiltoniano mecânico de fase escalar',
      'Estime o ganho de amplitude de balanço de fase residual'
    ],
    expectedSignature: 'Picos Harmônicos, Máximo Trabalho'
  },
  {
    id: 10,
    tier: 4,
    tierTitle: 'Tier 4: Limites da Teoria',
    title: 'Amnésia por Saturação',
    description: 'Ao elevar a amplitude e frequência do estimulador a patamares violentos, o campo de hábitos ΔF satura nas paredes do poço de potencial, sufocando a retenção histórica dinâmica.',
    checklist: [
      'Eleve a amplitude do estimulador para 2.5',
      'Defina frequência de chirp rápido',
      'Veja como as assinaturas e o índice Φ caem a quase zero sob violência cíclica'
    ],
    expectedSignature: 'Φ despenca a zero, Decaimento Crítico'
  },
  {
    id: 11,
    tier: 4,
    tierTitle: 'Tier 4: Limites da Teoria',
    title: 'Pico de Historicidade',
    description: "Encontrar o 'Doce Ponto' onde a física de poço duplo e o acoplador de carpas se sintonizam ao máximo. O ganho informativo preditivo Φ atinge seu pico cósmico absoluto.",
    checklist: [
      'Sintonize m: 1.0, beta: 1.5, tauH: 3.5s, potencial DOUBLE_WELL',
      'Observe se os baselines lineares necessitam de ordens absurdas k* para mimetizar',
      'Estime a eficiência irredutível do campo de hábitos residuais'
    ],
    expectedSignature: 'Φ Máximo (> 20%), k* >= 6'
  },
  {
    id: 12,
    tier: 4,
    tierTitle: 'Tier 4: Limites da Teoria',
    title: 'Ruído Térmico / Dissipação',
    description: 'Um mergulho de perturbação estocástica desordenadora de Wiener (Ruído Térmico). O campo persistente é chacoalhado por entropia fásica violenta, desafiando a blindagem de hábitos.',
    checklist: [
      'Defina o sinal do condutor para THERMAL_NOISE',
      'Mantenha o amortecimento alto e beta moderado',
      'Analise se o índice de sobrevivência sob ruído (R) racha sob desordem browniana'
    ],
    expectedSignature: 'R_idx baixo, Sincronia térmica desfeita'
  }
];
