/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, ChangeEvent } from 'react';
import { 
  Play, RotateCcw, AlertCircle, Cpu, ShieldAlert, Sliders, Settings2, Info,
  Eye, Sparkles, Download, CheckCircle, HelpCircle, Zap, ShieldCheck, 
  BookOpen, ChevronRight, RefreshCw, Layers, TrendingUp, History as HistoryIcon
} from 'lucide-react';
import { SystemParameters, PotentialType, StimulusType, SimulationPoint } from '../types';
import { runSimulation, runCloneTest, getPotentialEnergy } from '../simulator/ode';
import { evaluateMarkovianFit, findMinimumEmbeddingDimension } from '../simulator/baselines';
import { humanizeMetric } from '../analysis/humanizer';
import { generateExperimentalVerdict } from '../analysis/verdicts';
import { buildMarkdownReport } from '../analysis/reportGenerator';
import { useI18n } from '../i18n';

// COPILOT_TOPICS dictionary for the 3-layer Cognitive Readability / Universal Explicability Model
const COPILOT_TOPICS: Record<string, {
  title: string;
  symbol: string;
  color: string;
  metaphor: string;
  shortTooltip: string;
  analogia: string;
  interpretacaoFisica: string;
  experimento: string;
  formula: string;
}> = {
  m: {
    title: 'Inércia do Estado',
    symbol: 'm',
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
    metaphor: 'Um caminhão de carga gigante (m alto) vs. uma lancha super ágil (m baixo)',
    shortTooltip: 'Grau de resistência à aceleração cinemática. Controla quão devagar o sistema reage a novos impulsos.',
    analogia: 'Pense em empurrar um carro quebrado contra um carrinho de compras. O carro tem tanta inércia (alta massa) que você precisa empurcar continuamente para ele sequer começar a mudar de velocidade. Um valor "m" alto impede que ruídos rápidos desviem o estado.',
    interpretacaoFisica: 'O componente inercial clássico na dinâmica de Langevin para a transição temporal e estabilidade cinemática.',
    experimento: 'Aumente "m" se quiser trajetórias suaves e amortecidas. Diminua se quiser reações instantâneas a frequências altas (pode gerar oscilações caóticas sob estimulação cíclica).',
    formula: 'F_inercial = m · d²S/dt²'
  },
  gamma: {
    title: 'Fricção / Dissipação Viscosa',
    symbol: '\\gamma',
    color: 'text-sky-450 border-sky-500/30 bg-sky-950/20',
    metaphor: 'Uma mola mergulhada em óleo de motor viscoso ou mel',
    shortTooltip: 'Controla a velocidade com que a energia cinética do sistema é dissipada, fazendo-o voltar ao repouso no poço.',
    analogia: 'Arrastar um prato de vidro em uma mesa seca vs. em uma mesa coberta com mel. O mel (alta fricção) suga toda a velocidade quase que imediatamente. Sem fricção, qualquer perturbação externa geraria balanço perpétuo.',
    interpretacaoFisica: 'Coeficiente de amortecimento viscoso clássico. Transforma trabalho mecânico em perdas dissipativas fásicas.',
    experimento: 'Com fricção muito baixa (gamma < 0.1), o sistema oscila indefinidamente no poço e entra em ressonância. Com fricção alta (gamma > 1.0), as ondas de estímulo são instantaneamente amortecidas.',
    formula: 'F_dissipativa = -\\gamma · dS/dt'
  },
  beta: {
    title: 'Força do Vínculo Histórico',
    symbol: '\\beta',
    color: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/20',
    metaphor: 'Um elástico magnético invisível puxando o presente em direção aos caminhos do passado',
    shortTooltip: 'Regula o quanto a memória acumulada residual (\\Delta F) altera fisicamente a trajetória presente do estado S(t).',
    analogia: 'Pense em guiar um carro em trilhos cavados na lama. Se a força desse acoplamento (\\beta) for imensa, você não consegue sair de onde passou antes (preso à história). Se for zero, o carro anda reto ignorando as fendas antigas.',
    interpretacaoFisica: 'Constante de acoplamento da força de restauração não-local (memória fásica retardada).',
    experimento: 'Valores altos de \\beta ampliam sensivelmente o índice de historicidade \\Phi e dão energia para a divergência de clones e loops de histerese.',
    formula: 'F_historica = \\beta · \\Delta F(t)'
  },
  tauH: {
    title: 'Tempo de Retenção de Memória',
    symbol: '\\tau_H',
    color: 'text-violet-400 border-violet-500/30 bg-violet-950/20',
    metaphor: 'Fumaça de incenso que permanece flutuando em um quarto fechado',
    shortTooltip: 'Tempo característico necessário para que o sistema esqueça 63% do rastro deixado por acontecimentos passados.',
    analogia: 'Tentar escrever com giz molhado na lousa. Se o giz demora a secar (\\tau_H alto), a mensagem fica gravada legível por bastante tempo. Se o giz seca e esfarela em segundos (\\tau_H baixo), a lousa volta ao estado vazio na hora.',
    interpretacaoFisica: 'Constante de decaimento exponencial (tempo de relaxamento de Debye) do integrador de kernel dinâmico.',
    experimento: 'Eleve \\tau_H para simular sistemas de memória de longo prazo (viscoelásticos profundos). Diminua para converter em um sistema Markoviano sem memória relevante.',
    formula: 'K(\\Delta t) = e^{-\\Delta t / \\tau_H}'
  },
  alpha: {
    title: 'Gravação por Impacto Dinâmico',
    symbol: '\\alpha',
    color: 'text-pink-400 border-pink-500/30 bg-pink-950/20',
    metaphor: 'Uma caneta esferográfica que grava sulcos na mesa apenas quando você faz movimentos rápidos e bruscos',
    shortTooltip: 'Taxa com que movimentos rápidos / acelerações transicionais do estado físico criam novas memórias persistentes.',
    analogia: 'Nós esquecemos as viagens de ônibus monótonas e idênticas, mas um único freio brusco ou solavanco (transição de velocidade) fixa-se na memória por anos. \\alpha mede essa gravação de trauma por movimento ou oscilações.',
    interpretacaoFisica: 'Coeficiente cinemático de acoplamento da velocidade dS/dt na fonte geratriz da variável auxiliar de memória fásica dF.',
    experimento: 'Elevar \\alpha faz com que qualquer transição de poço de potencial grave um pico súbito de memória dF que deforma o atrator.',
    formula: 'dF/dt = -F/\\tau_H + \\alpha · |dS/dt| + \\eta · S'
  },
  eta: {
    title: 'Habituação Estática por Exposição',
    symbol: '\\eta',
    color: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-950/20',
    metaphor: 'Pegadas contínuas desgastando o gramado ou o assento do sofá deformando com o tempo',
    shortTooltip: 'Mapeia quanto a mera permanência estática em uma posição grava rastro acumulado no campo de memória.',
    analogia: 'Mesmo sem correr ou pular (\\alpha = 0), apenas sentar na mesma cadeira de espuma todos os dias por horas acaba por deformar seu assento de forma permanente. \\eta mede essa força de habituação por exposição estática acumulativa.',
    interpretacaoFisica: 'Coeficiente estático de polarização integrando as posições S(t) diretamente ao longo das trajetórias.',
    experimento: 'Com \\eta alto, manter o sistema travado em um poço, mesmo sob estímulo nulo, polariza as forças de memória e deforma o gradiente.',
    formula: 'dF/dt_estatico = \\eta · S(t)'
  },
  phi: {
    title: 'Causalidade Histórica',
    symbol: '\\Phi',
    color: 'text-cyan-400 border-cyan-500/50 bg-cyan-950/20',
    metaphor: 'O valor de ler o capítulo anterior para entender o final do livro, em vez de chutar sabendo só a última palavra',
    shortTooltip: 'Mede estatisticamente quanto do futuro é determinado unicamente pelo passado cumulativo do sistema.',
    analogia: 'Tente adivinhar a cor da camisa de alguém sabendo apenas que ela está de azul hoje (Markoviano). Agora adivinhe sabendo que há 5 anos ela só usa azul às quartas-feiras (Histórico). \\Phi quantifica esse salto espetacular em acerto.',
    interpretacaoFisica: 'Índice de explicabilidade preditiva relativa. \\Phi = 1 - Err_H / Err_M. Se \\Phi > 5%, o sistema é fidedignamente histórico.',
    experimento: 'Com acoplamento beta alto e excitação cíclica, verifique que o modelo histórico supera os baselines Markovianos locais em mais de 25%.',
    formula: '\\Phi = 1 - \\frac{MSE_{\\text{Modelo Histórico}}}{MSE_{\\text{Baseline Local AR(p)}}}'
  },
  clone_div: {
    title: 'Divergência de Clones Causa-Efeito',
    symbol: 'D(t)',
    color: 'text-rose-400 border-rose-500/50 bg-rose-950/20',
    metaphor: 'Duas pessoas gêmeas idênticas colocadas no mesmo emprego mas que agem de formas opostas por traumas passados diferentes',
    shortTooltip: 'Mete à prova a historicidade. Dois sistemas idênticos no presente divergem por carregarem memórias distintas.',
    analogia: 'Tome dois pêndulos idênticos exatamente na mesma posição e velocidade inicial no tempo zero. Sob estímulos idênticos, se forem normais, andam juntos. Se forem históricos (carregando rastros diferentes), eles divergem e revelam o poder causal do passado!',
    interpretacaoFisica: 'Separação dinâmica no espaço conformal devido à assimetria latente na variável fásica retardada \\Delta F.',
    experimento: 'Observe nos gráficos como uma diferença minúscula no priming de frequência das trajetórias passadas joga os clones em atratores opostos.',
    formula: 'D(t) = |S_A(t) - S_B(t)|'
  },
  k_star: {
    title: 'Complexidade de Embedding',
    symbol: 'k^*',
    color: 'text-amber-400 border-amber-500/50 bg-amber-950/20',
    metaphor: 'Quantos atrasos repetidos na fila do presente você precisa anotar para disfarçar que esqueceu seu próprio aniversário',
    shortTooltip: 'Número mínimo de instantes passados seguidos requeridos para replicar a previsão que o campo fásico ΔF entrega sozinho.',
    analogia: 'Se você perdeu a memória, para tentar prever onde vai amanhã você teria que registrar suas coordenadas de ontem, anteontem, de 3 dias atrás... k* é a quantidade exata desse diário passado que você precisa guardar para compensar seu esquecimento.',
    interpretacaoFisica: 'Ordem de regressão autorregressiva equivalente ARIMA necessária para emparelhar as estimativas não-markovianas.',
    experimento: 'Aumentar a escala de tempo de memória tauH faz a complexidade de embedding k* disparar para ordens elevadas (lags > 6).',
    formula: 'k^* = \\text{arg min}_p \\{ MSE_{\\text{AR(p)}} \\le MSE_{\\text{Hist}} + \\epsilon \\}'
  },
  hysteresis: {
    title: 'Área do Loop de Histerese',
    symbol: '\\oint S dE',
    color: 'text-rose-400 border-rose-500/50 bg-rose-950/20',
    metaphor: 'A memória flexível ou plasticidade viscoelástica de um pedaço de chiclete amassado',
    shortTooltip: 'Quantifica as perdas de energia causadas pelo atraso do sistema físico em responder aos ciclos do estímulo.',
    analogia: 'Esticar uma borracha e soltar. Se ela volta lenta e desenha curvas diferentes na ida e na volta, ela realizou trabalho dissipativo. A área central de seu ciclo geométrico é a histerese: o atraso de fase clássico.',
    interpretacaoFisica: 'Integral fásica dissipativa de ciclo fechado do campo de força dinâmico em regimes excitados periódicos.',
    experimento: 'Observe nos gráficos gerados que, com acoplamento beta alto e frequência sincronizada de estímulo, o loop assume formas elípticas ou borboletas complexas.',
    formula: 'W_{\\text{histerese}} = \\oint S(t) \\dot{E}(t) dt'
  },
  noise_robustness: {
    title: 'Sobrevivência sob Ruído Estocástico',
    symbol: 'R_{\\text{idx}}',
    color: 'text-teal-400 border-teal-500/50 bg-teal-950/20',
    metaphor: 'Um rio profundo cavado na pedra de granito rígida que não desvia de rota mesmo diante de tempestades ácidas',
    shortTooltip: 'Resiliência das assinaturas históricas de memória perante introdução de ruídos térmicos estocásticos rápidos.',
    analogia: 'Tentar escrever mensagens secretas na areia da praia (sensível a ruídos de onda) contra esculpir em granito. Sistemas históricos robustos mantêm seus atratores e hábitos mesmo quando chacoalhados por ruído térmico constante.',
    interpretacaoFisica: 'Robustez conformal de perturbação de atratores viscoelásticos sob ruído de Wiener de banda espectral larga.',
    experimento: 'Garante que os padrões que você sintoniza permaneçam estáveis nos estudos práticos e não fiquem flutuando de forma randômica.',
    formula: 'R \\propto p(\\text{sobrevivência da assinatura de memória sob perturbação} \\sigma)'
  }
};

const COGNITIVE_SCENARIOS = [
  // Tier 1: Entender Memória (Atraso e Relaxação)
  {
    id: 1,
    tier: 1,
    tierTitle: "Tier 1: Entender Memória",
    title: "Sistema Sem Memória",
    description: "Conhecer a partícula no poço de potencial elástico clássico, onde heranças são desligadas (\u03B2 = 0.0) e as respostas são instantâneas.",
    checklist: [
      "Defina beta = 0.0 (canal de hábitos inativo)",
      "Observe como S(t) segue estritamente o estímulo externo",
      "Perceba a ausência total de loops de atraso (histerese = 0)"
    ],
    presetParams: { m: 1.0, gamma: 0.3, potential: 'harmonic' as const, beta: 0.0, tauH: 1.0, alpha: 0.0, eta: 0.0, V_height: 0.5 },
    stimType: 'sine' as const, amp: 1.0, freq: 0.12,
    focusKeys: ["beta", "gamma"],
    expectedSignature: "\u03A6 = 0.00%, D_max = 0.00"
  },
  {
    id: 2,
    tier: 1,
    tierTitle: "Tier 1: Entender Memória",
    title: "Relaxação Saudável",
    description: "Um acoplamento moderado com relaxamento rápido. A memória atua como amortecimento dinâmico saudável, dissipando de forma exponencial e restaurando o estado original.",
    checklist: [
      "Eleve beta moderadamente (0.5 a 0.8)",
      "Configure tempo de relaxamento tauH em torno de 2.0s",
      "Observe o retorno elástico fluído no espaço de fases"
    ],
    presetParams: { m: 1.0, gamma: 0.4, potential: 'harmonic' as const, beta: 0.6, tauH: 2.0, alpha: 0.3, eta: 0.1, V_height: 0.5 },
    stimType: 'sine' as const, amp: 1.0, freq: 0.12,
    focusKeys: ["beta", "tauH"],
    expectedSignature: "\u03A6 \u2248 4.0% a 8.0%, Retorno Fluido"
  },
  {
    id: 3,
    tier: 1,
    tierTitle: "Tier 1: Entender Memória",
    title: "Memória Viscoelástica",
    description: "Aqui a retenção é considerável. O campo residual \u0394F(t) age como uma mola de atraso fásico, resistindo às perturbações e puxando o sistema lentamente de volta.",
    checklist: [
      "Aumente tempo de memória tauH para 4.5s ou mais",
      "Defina beta em 0.8",
      "Veja o rastro persistente gerando ondas viscoelásticas na fumaça \u0394F(t)"
    ],
    presetParams: { m: 1.0, gamma: 0.25, potential: 'harmonic' as const, beta: 0.8, tauH: 4.5, alpha: 0.5, eta: 0.2, V_height: 0.5 },
    stimType: 'sine' as const, amp: 1.0, freq: 0.12,
    focusKeys: ["tauH", "beta"],
    expectedSignature: "\u03A6 \u2248 8.0% a 15.0%, Loop de fase visível"
  },

  // Tier 2: Entender Historicidade (Acumulação Histórica)
  {
    id: 4,
    tier: 2,
    tierTitle: "Tier 2: Entender Historicidade",
    title: "Histerese Crítica",
    description: "As fases de subida e descida desenham caminhos visivelmente distintos. O sistema consome e armazena energia em ciclos irreversíveis de asas de borboleta.",
    checklist: [
      "Ative potencial DOUBLE_WELL (poço duplo)",
      "Defina beta = 1.0 e tauH = 5.0s",
      "Observe os enormes caminhos divergentes quando a força excita e retorna"
    ],
    presetParams: { m: 1.0, gamma: 0.15, potential: 'double_well' as const, beta: 1.0, tauH: 5.0, alpha: 0.8, eta: 0.2, V_height: 0.6 },
    stimType: 'sine' as const, amp: 1.2, freq: 0.08,
    focusKeys: ["beta", "tauH"],
    expectedSignature: "\u00C1rea de Histerese > 0.40, \u03A6 Elevado"
  },
  {
    id: 5,
    tier: 2,
    tierTitle: "Tier 2: Entender Historicidade",
    title: "Trauma Cristalizado",
    description: "Alta deposição por exposição (eta). Ficar muito tempo parado em uma calha deforma o próprio mapa de potencial, cristalizando hábitos persistentes na estrutura física.",
    checklist: [
      "Configure eta = 1.8 (altíssima deposição estática)",
      "Mantenha o sistema em uma calha sob excitação leve ou constante",
      "Observe o sistema criar uma bacia profunda, incapaz de saltar"
    ],
    presetParams: { m: 1.0, gamma: 0.3, potential: 'double_well' as const, beta: 1.2, tauH: 6.0, alpha: 0.1, eta: 1.8, V_height: 0.8 },
    stimType: 'sine' as const, amp: 0.5, freq: 0.15,
    focusKeys: ["eta", "beta"],
    expectedSignature: "Deformidade Permanente, Baixo D_max"
  },
  {
    id: 6,
    tier: 2,
    tierTitle: "Tier 2: Entender Historicidade",
    title: "Trauma por Impacto",
    description: "Alta gravação plástica motivada por aceleração e velocidade (alpha). Cada colisão transicional rápida deforma o campo e deixa cicatrizes físicas indeléveis na barreira de fases.",
    checklist: [
      "Eleve alpha para 1.5 (sensibilidade transicional brusca)",
      "Utilize sinal de pulso rápido para bombear choque na partícula",
      "Repare como as oscilações após o pico travam-se em novas memórias rápidas"
    ],
    presetParams: { m: 1.0, gamma: 0.2, potential: 'double_well' as const, beta: 1.4, tauH: 4.5, alpha: 1.6, eta: 0.0, V_height: 0.7 },
    stimType: 'pulse' as const, amp: 1.5, freq: 0.12,
    focusKeys: ["alpha", "beta"],
    expectedSignature: "\u03A6 > 15.0%, Cicatriz fásica abrupta"
  },

  // Tier 3: Entender Não-Localidade Temporal (Passado altera Futuro)
  {
    id: 7,
    tier: 3,
    tierTitle: "Tier 3: Entender Não-Localidade",
    title: "Divergência dos Gêmeos",
    description: "Dois clones físicos perfeitamente sintonizados no presente terminam em órbitas opostas e irreversíveis devido unicamente a pequenos resíduos de seus passados distintos.",
    checklist: [
      "Rode o teste de Clone Causal com frequências de priming desequilibradas",
      "Observe as trajetórias idênticas no início se bifurcarem sob condução comum",
      "Colete os dados de D_max (afastamento físico irredutível)"
    ],
    presetParams: { m: 1.0, gamma: 0.12, potential: 'double_well' as const, beta: 1.2, tauH: 6.0, alpha: 0.8, eta: 0.2, V_height: 0.6 },
    stimType: 'sine' as const, amp: 1.0, freq: 0.12,
    focusKeys: ["beta", "clone_div"],
    expectedSignature: "D_max > 0.25, Forte desvio físico"
  },
  {
    id: 8,
    tier: 3,
    tierTitle: "Tier 3: Entender Não-Localidade",
    title: "Edge of Chaos",
    description: "Ponto crítico de sintonização onde a menor variação no histórico de fases joga o sistema em bacias atratoras opostas. Sensibilidade extrema a hábitos anteriores.",
    checklist: [
      "Reduza gama para 0.05 para amplificar excitação e diminuir o atrito",
      "Mantenha acoplamento beta moderado (1.2 a 1.5)",
      "Observe flutuações e movimentos erráticos que mimetizam caos determinístico"
    ],
    presetParams: { m: 1.0, gamma: 0.05, potential: 'double_well' as const, beta: 1.3, tauH: 4.0, alpha: 0.8, eta: 0.2, V_height: 0.6 },
    stimType: 'sine' as const, amp: 0.9, freq: 0.14,
    focusKeys: ["gamma", "beta"],
    expectedSignature: "Trajetórias Caóticas e Irregulares"
  },
  {
    id: 9,
    tier: 3,
    tierTitle: "Tier 3: Entender Não-Localidade",
    title: "Ressonância Histórica",
    description: "Sincronia perfeita onde a frequência de bombeamento externa ressoa em harmonia com a constante de decaimento de memória tauH, induzindo picos gigantes de transferência energética.",
    checklist: [
      "Equalize o período de condução t = 1/f com a escala residual tauH",
      "Monitore o hamiltoniano mecânico de fase escalar",
      "Estime o ganho de amplitude de balanço de fase residual"
    ],
    presetParams: { m: 1.0, gamma: 0.15, potential: 'double_well' as const, beta: 1.5, tauH: 8.0, alpha: 1.0, eta: 0.3, V_height: 0.6 },
    stimType: 'sine' as const, amp: 1.1, freq: 0.125,
    focusKeys: ["tauH", "freq"],
    expectedSignature: "Picos Harmônicos, Máximo Trabalho"
  },

  // Tier 4: Limites da Teoria (Onde Quebra)
  {
    id: 10,
    tier: 4,
    tierTitle: "Tier 4: Limites da Teoria",
    title: "Amnésia por Saturação",
    description: "Ao elevar a amplitude e frequência do estimulador a patamares violentos, o campo de hábitos \u0394F satura nas paredes do poço de potencial, sufocando a retenção histórica dinâmica.",
    checklist: [
      "Eleve a amplitude do estimulador para 2.5",
      "Defina frequência de chirp rápido",
      "Veja como as assinaturas e o índice \u03A6 caem a quase zero sob violência cíclica"
    ],
    presetParams: { m: 1.0, gamma: 0.25, potential: 'double_well' as const, beta: 2.0, tauH: 4.0, alpha: 1.2, eta: 0.4, V_height: 0.6 },
    stimType: 'chirp' as const, amp: 2.5, freq: 0.4,
    focusKeys: ["amp", "beta"],
    expectedSignature: "\u03A6 despenca a zero, Decaimento Crítico"
  },
  {
    id: 11,
    tier: 4,
    tierTitle: "Tier 4: Limites da Teoria",
    title: "Pico de Historicidade",
    description: "Encontrar o 'Doce Ponto' onde a física de poço duplo e o acoplador de carpas se sintonizam ao máximo. O ganho informativo preditivo \u03A6 atinge seu pico cósmico absoluto.",
    checklist: [
      "Sintonize m: 1.0, beta: 1.5, tauH: 3.5s, potencial DOUBLE_WELL",
      "Observe se os baselines lineares necessitam de ordens absurdas k* para mimetizar",
      "Estime a eficiência irredutível do campo de hábitos residuais"
    ],
    presetParams: { m: 1.0, gamma: 0.18, potential: 'double_well' as const, beta: 1.6, tauH: 3.5, alpha: 1.1, eta: 0.3, V_height: 0.6 },
    stimType: 'sine' as const, amp: 1.2, freq: 0.11,
    focusKeys: ["beta", "k_star"],
    expectedSignature: "\u03A6 M\u00E1ximo (> 20%), k* >= 6"
  },
  {
    id: 12,
    tier: 4,
    tierTitle: "Tier 4: Limites da Teoria",
    title: "Ruído Térmico / Dissipação",
    description: "Um mergulho de perturbação estocástica desordenadora de Wiener (Ruído Térmico). O campo persistente é chacoalhado por entropia fásica violenta, desafiando a blindagem de hábitos.",
    checklist: [
      "Defina o sinal do condutor para THERMAL_NOISE",
      "Mantenha o amortecimento alto e beta moderado",
      "Analise se o índice de sobrevivência sob ruído (R) racha sob desordem browniana"
    ],
    presetParams: { m: 1.0, gamma: 0.5, potential: 'double_well' as const, beta: 0.7, tauH: 2.5, alpha: 0.4, eta: 0.2, V_height: 0.6 },
    stimType: 'thermal_noise' as const, amp: 1.5, freq: 0.15,
    focusKeys: ["noise_robustness", "gamma"],
    expectedSignature: "R_idx baixo, Sincronia térmica desfeita"
  }
];

const PROGRESS_STAGES = COGNITIVE_SCENARIOS;

const ACHIEVEMENT_REGISTRY: Record<string, {
  title: string;
  badge: string;
  condition: string;
  feedback: string;
}> = {
  genesis_causal: {
    title: "Descoberta: Gênese Causal",
    badge: "🧠 HAB",
    condition: "Acoplamento de memória sintonizado (Φ > 0.04 ou D_max > 0.05)",
    feedback: "Você rompeu a física clássica de heranças desligadas. A partícula adquiriu uma bússola de hábitos."
  },
  evidencia_irrefutavel: {
    title: "Descoberta: Evidência Irrefutável",
    badge: "🔬 Φ_MAX",
    condition: "Ganho preditivo de alto gabarito (Φ > 0.18)",
    feedback: "Causalidade histórica irredutível comprovada! O modelo sem memória falha severamente em explicar o sistema."
  },
  asas_do_tempo: {
    title: "Descoberta: Asas do Tempo",
    badge: "🦋 HIST",
    condition: "Ciclo de histerese exuberante (ΔS > 0.45)",
    feedback: "O loop desenhou asas de borboleta cíclicas. O sistema dissipa e retém energia de forma irreversível."
  },
  abismo_dos_gemeos: {
    title: "Descoberta: O Abismo dos Gêmeos",
    badge: "👥 GEM",
    condition: "Cisão causal radical de clones históricos (D_max > 0.25)",
    feedback: "Dois gêmeos físicos idênticos agiram de formas opostas puramente por diferenças em seus passados ocultos."
  },
  complexidade_maxima: {
    title: "Descoberta: Complexidade Máxima",
    badge: "📦 k*_MAX",
    condition: "Embedding de alta dimensionalidade (k* ≥ 6)",
    feedback: "A memória viscoelástica é tão intrincada que estimar linearmente exige o rastreio de múltiplos lags cumulativos."
  },
  trauma_eterno: {
    title: "Descoberta: Trauma Eterno (Cristalização)",
    badge: "🌋 CRIS",
    condition: "Cicatrizes físicas permanentes (η ≥ 1.5 ou α ≥ 1.5)",
    feedback: "A estrutura do relevo energético deformou permanentemente. Cicatrizes no poço tornaram-se duradouras."
  }
};

function getLiveDiagnosis(
  params: SystemParameters, 
  metrics: { phi: number; cloneDivergence: number; hysteresisArea: number; kStar: number; noiseSurvival?: number },
  locale: 'pt-BR' | 'en-US' = 'pt-BR'
) {
  const isEn = locale === 'en-US';
  let state = isEn ? "Simple Stable Markovian" : "Estável Markoviano Simples";
  let primaryMessage = isEn 
    ? "The state particle reacts immediately to current inputs, without exhibiting non-local visco-elastic memory influences."
    : "A partícula responde no momento exato à força motora, sem sofrer qualquer influência viscoelástica de heranças pregressas.";
  let interpretationScientific = isEn
    ? "Phase coordinates determined solely by traditional local components (velocity, damping, and potential stiffness V(S))."
    : "Estado dinâmico governado puramente por diferenciais de ordem local (velocidade e elasticidade de potencial restaurador V(S)).";
  let color = "text-emerald-400 border-emerald-900 bg-emerald-950/20";
  let evidenceLevel: "FRACA" | "MODERADA" | "FORTE" = "FRACA";
  let scoreText = isEn ? "Traditional Markovian Bounds" : "Preservação Markoviana Integral";

  if (params.beta === 0) {
    state = isEn ? "Simple Stable Markovian" : "Estável Markoviano Simples";
    primaryMessage = isEn
      ? "Historical feedback is inactive (β = 0.0). The system lives purely in the active present, ignoring previous paths."
      : "A herança está inativa (β = 0.0). O sistema vive exclusivamente no presente, como se fosse sempre a primeira oscilação.";
    interpretationScientific = isEn
      ? "Predictive historic gain Φ = 0.00%. Classic memoryless Poincaré equations describe the phase attractor fully."
      : "Acréscimo preditivo Φ = 0.00%. O escoamento linear clássico de Poincaré mimetiza perfeitamente o atrator de fase.";
    color = "text-emerald-450 border-emerald-950 bg-emerald-950/15";
    evidenceLevel = "FRACA";
    scoreText = isEn ? "Pure Markovian" : "Markoviano Puro";
  } else if (metrics.cloneDivergence > 0.22) {
    state = isEn ? "Critical Twin Divergence" : "Divergência Crítica dos Gêmeos";
    primaryMessage = isEn
      ? "Extreme split! Physically identical twins primed with asymmetric pasts move in polar opposite orbits under uniform drive."
      : "Cisão extrema! Clones corporais idênticos sintonizados no presente trilham destinos opostos devido à herança oculta de seus passados.";
    interpretationScientific = isEn
      ? `High D_max (${metrics.cloneDivergence.toFixed(3)}) proves radical symmetry breaking of phase vectors under boundary conditions.`
      : "D_max elevado (" + metrics.cloneDivergence.toFixed(3) + ") denota quebra radical de simetria do vetor de fase na barreira bistável.";
    color = "text-sky-400 border-sky-900 bg-sky-950/20 animate-pulse";
    evidenceLevel = "FORTE";
    scoreText = isEn ? "Strong Causal Historic Gain" : "Causalidade Histórica Forte";
  } else if (metrics.hysteresisArea > 0.40) {
    state = isEn ? "Cyclical Hysteresis Wings" : "Asas de Histerese Cíclica";
    primaryMessage = isEn
      ? "Exuberant butterfly curves. The system stores and expels energy with noticeable phase lags under cyclic drives."
      : "Formação exuberante de asas de borboleta. O sistema consome e retém energia sob atrasos de fase e perdas irreversíveis na rampa.";
    interpretationScientific = isEn
      ? `Integrated area ∮ S dE is high (${metrics.hysteresisArea.toFixed(3)}), indicating substantial visco-elastic phase dispersion.`
      : "Loop cíclico integral ∮ S dE elevado (" + metrics.hysteresisArea.toFixed(3) + ") indicando dispersão viscoelástica de fases escalar.";
    color = "text-rose-400 border-rose-900 bg-rose-950/20";
    evidenceLevel = "FORTE";
    scoreText = isEn ? "Active Irreversibility" : "Irreversibilidade Ativa";
  } else if (params.eta >= 1.4) {
    state = isEn ? "Crystallized Habit (Saturation)" : "Hábito Cristalizado (Saturação)";
    primaryMessage = isEn
      ? "Prolonged exposure severely warped the potential profile. The particle is locked inside an induced landscape basin."
      : "A permanência prolongada deformou gravemente o relevo. A partícula acomodou-se e cristalizou hábitos na fundação energética do poço.";
    interpretationScientific = isEn
      ? "High static settlement η. The dynamic linear integrator has consolidated solid resistance inside potential troughs."
      : "Polarização estática η elevada. O acoplador integrador linear acumula força resistiva nas calhas do poço V(S).";
    color = "text-violet-400 border-violet-900 bg-violet-950/20";
    evidenceLevel = "MODERADA";
    scoreText = isEn ? "Massive Sedimentation" : "Sedimentação Maciça";
  } else if (params.alpha >= 1.4) {
    state = isEn ? "Transitional Shock Scar" : "Cicatriz por Impacto Dinâmico";
    primaryMessage = isEn
      ? "Transitional scars. Kinetic speed changes and accelerations are carving abrupt memories into the landscape."
      : "Surgimento de cicatrizes de velocidade. Movimentos transicionais rápidos estão gravando memórias traumáticas acumulativas bruscas.";
    interpretationScientific = isEn
      ? "Substantial dynamic impression α. Memory field derivative dF/dt is being accelerated by phase velocity absolute values |S'|."
      : "Acoplamento cinemático de transição α substancial. Modulação de carpa dF/dt guiada pelo módulo de variação |S'|.";
    color = "text-pink-400 border-pink-900 bg-pink-950/20";
    evidenceLevel = "MODERADA";
    scoreText = isEn ? "Transitional Stress" : "Estresse Transicional";
  } else if (params.gamma <= 0.08 && params.beta >= 1.0) {
    state = isEn ? "Edge Bifurcation & Chaos" : "Bifurcação e Caos de Borda";
    primaryMessage = isEn
      ? "Superlight viscosity combined with active memory coupling triggers orbits that challenge standard predictions."
      : "Fricção ultra-leve combinada com impulsos de memória ativos induz flutuações e desvios orbitais que desafiam previsões locais.";
    interpretationScientific = isEn
      ? "Low friction coefficient γ paired with memory phase delayed restoration outlines pseudo-chaotic attractor bands."
      : "Amortecimento viscoso γ de baixa escala com atraso temporal fásico induzindo caminhos de atrator estranho pseudo-caóticos.";
    color = "text-amber-400 border-amber-900 bg-amber-950/20";
    evidenceLevel = "FORTE";
    scoreText = isEn ? "Extreme Sensitivity" : "Sensibilidade Extrema";
  } else if (metrics.phi > 0.12 && metrics.kStar >= 3) {
    state = isEn ? "Historical Delay Resonance" : "Ressonância de Atraso Histórico";
    primaryMessage = isEn
      ? "Temporal sync. Residual memory thresholds and exciter frequencies resonate, maximizing dynamic energy shifts."
      : "Sintonização de heranças. O tempo de retenção residual e a frequência de estímulo de bombeamento agem em perfeita ressonância dinâmica.";
    interpretationScientific = isEn
      ? `Embedding size k* = ${metrics.kStar}. Predictive gain Φ = ${(metrics.phi * 100).toFixed(1)}% disproves Markovian local models.`
      : "Dimensão de embedding k* = " + metrics.kStar + ". Φ = " + (metrics.phi * 105).toFixed(1) + "% comprova insuficiência de modelos locais.";
    color = "text-[#818cf8] border-indigo-950 bg-indigo-950/25";
    evidenceLevel = "MODERADA";
    scoreText = isEn ? "Coherent Memory" : "Memória Coerente";
  } else if (metrics.phi > 0.03) {
    state = isEn ? "Moderate Relaxation Drift" : "Distorção por Relaxação Ativa";
    primaryMessage = isEn
      ? "Historical feedback is operating weakly, gently damping phase coordinates and lagging behind current forcing."
      : "Atratores de herança estão operando em escala moderada, amortecendo suavemente as órbitas e retardando o estímulo condutor.";
    interpretationScientific = isEn
      ? "Low-scale predictive historic advantage. The delayed exponential kernel covers marginal gaps in dynamic paths."
      : "Ganho preditivo de baixa escala. O regressor exponencial retardado do integrador dF cobre perdas marginais de fase.";
    color = "text-cyan-400 border-cyan-900 bg-cyan-950/20";
    evidenceLevel = "FRACA";
    scoreText = isEn ? "Delayed Relaxation" : "Relaxamento Retardado";
  }

  // Compile general diagnostics list
  const diagnosisList: string[] = [];
  if (params.beta === 0) {
    diagnosisList.push(isEn ? "Zero history (β = 0). Purely Markovian equations active." : "História nula (β = 0). Equações puramente markovianas ativas.");
  } else if (params.beta >= 1.6) {
    diagnosisList.push(isEn ? `Extremely strong and dominant historical coupling (β = ${params.beta.toFixed(2)}).` : "Acoplamento de herança (β = " + params.beta.toFixed(2) + ") extremamente forte e dominante.");
  } else {
    diagnosisList.push(isEn ? `Stable historical coupling force (β = ${params.beta.toFixed(2)}).` : "Força de vínculo de memória estável (" + params.beta.toFixed(2) + ").");
  }

  if (params.tauH >= 6.0) {
    diagnosisList.push(isEn ? `Prolonged retention (tauH = ${params.tauH.toFixed(1)}s) preserves traits across multiple phases.` : "Tempo de retenção (τ_H = " + params.tauH.toFixed(1) + "s) retém marcas por múltiplas órbitas.");
  } else if (params.tauH <= 1.2) {
    diagnosisList.push(isEn ? `Rapid memory decay (tauH = ${params.tauH.toFixed(1)}s) wipes out scars immediately.` : "Esquecimento rápido (τ_H = " + params.tauH.toFixed(1) + "s) apaga cicatrizes instantaneamente.");
  }

  if (metrics.cloneDivergence > 0.05) {
    diagnosisList.push(isEn ? `Active state-bifurcation! Twin clones split by ${metrics.cloneDivergence.toFixed(3)} u.a.` : "Cisão de clones ativa! Divergência de " + metrics.cloneDivergence.toFixed(3) + " u.a.");
  } else {
    diagnosisList.push(isEn ? "Clone-symmetry intact. No divergent pathways." : "Clone-simetria inalterada. Sem desvio.");
  }

  if (metrics.phi > 0.18) {
    diagnosisList.push(isEn ? `Irreducible predictive gain (Φ = ${(metrics.phi * 100).toFixed(1)}%) dominates traditional baselines.` : "Explicabilidade histórica (Φ = " + (metrics.phi * 100).toFixed(1) + "%) desbanca baselines convencionais.");
  }

  return {
    state,
    evidenceLevel,
    evidenceColor: color,
    primaryMessage,
    interpretationScientific,
    diagnosis: diagnosisList
  };
}

interface LabCoreProps {
  explorationMode?: 'guided' | 'advanced';
  setExplorationMode?: (mode: 'guided' | 'advanced') => void;
}

export default function LabCore({ explorationMode = 'guided', setExplorationMode }: LabCoreProps = {}) {
  const { dict, locale } = useI18n();
  // Model Parameters
  const [params, setParams] = useState<SystemParameters>({
    m: 1.0,
    gamma: 0.15,
    potential: 'double_well',
    beta: 0.8,
    tauH: 3.0,
    alpha: 0.8,
    eta: 0.2,
    V_height: 0.6,
  });

  const [stimType, setStimType] = useState<StimulusType>('sine');
  const [amp, setAmp] = useState(1.0);
  const [freq, setFreq] = useState(0.12);

  // Simulation controls
  const [simDuration, setSimDuration] = useState(30);
  const [timeStep] = useState(0.05);

  // View modes: 'scientific', 'operational', 'human'
  const [viewMode, setViewMode] = useState<'scientific' | 'operational' | 'human'>('operational');

  // Copilot helper state
  const [selectedCopilotTopic, setSelectedCopilotTopic] = useState<string | null>(null);
  const [entenderMelhor, setEntenderMelhor] = useState(false);
  const [cognitiveStage, setCognitiveStage] = useState<number>(1);

  // Shared snapshots/runs comparative memory
  const [savedSnapshots, setSavedSnapshots] = useState<Array<{
    id: string;
    name: string;
    notes: string;
    timestamp: string;
    params: SystemParameters;
    metrics: { phi: number; cloneDivergence: number; hysteresisArea: number; kStar: number; noiseSurvival: number };
    points: SimulationPoint[];
    stimType: StimulusType;
    amp: number;
    freq: number;
  }>>([]);
  const [selectedComparisonId, setSelectedComparisonId] = useState<string | null>(null);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(true);

  // States to control interactive contextual help panels below each primary plot
  const [showHelpTrajectory, setShowHelpTrajectory] = useState(false);
  const [showHelpMemory, setShowHelpMemory] = useState(false);
  const [showHelpPhase, setShowHelpPhase] = useState(false);
  const [showHelpHysteresis, setShowHelpHysteresis] = useState(false);
  const [showHelpEnergy, setShowHelpEnergy] = useState(false);

  const [newSnapshotName, setNewSnapshotName] = useState('');
  const [newSnapshotNotes, setNewSnapshotNotes] = useState('');

  // Oráculo (Gemini AI Chat) state variables & handler
  const [oracleChat, setOracleChat] = useState<Array<{ role: 'user' | 'oracle', text: string }>>([
    { role: 'oracle', text: 'Saudações, Investigador. Sou o Oráculo de Prisantemotria. Posso ler o estado físico atual e o veredito das coordenadas do seu simulador em tempo real para tecer uma crítica epistemológica profunda. O que deseja debater?' }
  ]);
  const [oracleInput, setOracleInput] = useState('');
  const [oracleLoading, setOracleLoading] = useState(false);
  const [oracleError, setOracleError] = useState<string | null>(null);

  const handleOracleQuery = async (customText?: string) => {
    const textToSend = customText !== undefined ? customText : oracleInput;
    if (!textToSend.trim() && !customText) return;

    setOracleLoading(true);
    setOracleError(null);

    const updatedChat = [...oracleChat, { role: 'user' as const, text: textToSend }];
    setOracleChat(updatedChat);
    setOracleInput('');

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          params,
          metrics: computedMetrics,
          stimType,
          amp,
          freq,
          customPrompt: textToSend,
          chatHistory: updatedChat.slice(-6).map(c => ({
            role: c.role === 'user' ? 'user' : 'model',
            text: c.text
          }))
        })
      });

      const data = await response.json();
      if (data.success) {
        setOracleChat(prev => [...prev, { role: 'oracle', text: data.text }]);
      } else {
        setOracleError(data.message || data.error || "Erro de resposta");
        setOracleChat(prev => [
          ...prev, 
          { 
            role: 'oracle', 
            text: `${data.message || data.error || 'Não foi possível obter resposta.'}\n\nNota: Para usar o oráculo de inteligência de Prisantemotria, por favor configure uma GEMINI_API_KEY no painel superior Settings > Secrets do AI Studio.` 
          }
        ]);
      }
    } catch (err: any) {
      console.error(err);
      setOracleError(err.message || "Erro de rede");
      setOracleChat(prev => [
        ...prev, 
        { 
          role: 'oracle', 
          text: `Erro de conexão: ${err.message || 'Falha de rede.'}\n\nNota: Para usar o oráculo de inteligência de Prisantemotria, configure uma GEMINI_API_KEY no painel superior Settings > Secrets do AI Studio.` 
        }
      ]);
    } finally {
      setOracleLoading(false);
    }
  };

  // Exploration achievements state
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [showAchievementToast, setShowAchievementToast] = useState<string | null>(null);

  // Selector for Active Tier (1-4) in scenarios explorer
  const [selectedScenarioTier, setSelectedScenarioTier] = useState<number>(1);

  // Helper to save snapshots
  const saveSnapshotsToStorage = (updated: typeof savedSnapshots) => {
    setSavedSnapshots(updated);
    try {
      localStorage.setItem('prisantemotria_snapshots', JSON.stringify(updated));
    } catch (e) { console.error('Error saving snapshots:', e); }
  };

  // Load snapshots and achievements from localStorage on mount
  useEffect(() => {
    const storedSnaps = localStorage.getItem('prisantemotria_snapshots');
    if (storedSnaps) {
      try {
        const parsed = JSON.parse(storedSnaps);
        if (Array.isArray(parsed)) setSavedSnapshots(parsed);
      } catch (e) { console.error('Error parsing stored snapshots:', e); }
    }

    const storedAchs = localStorage.getItem('prisantemotria_achievements');
    if (storedAchs) {
      try {
        const parsed = JSON.parse(storedAchs);
        if (Array.isArray(parsed)) setUnlockedAchievements(parsed);
      } catch (e) { console.error('Error parsing stored achievements:', e); }
    }
  }, []);

  // Interactive recent run logs
  const [runLogs, setRunLogs] = useState<Array<{
    id: string;
    timestamp: string;
    phi: number;
    divergence: number;
    verdict: string;
    paramsSnapshot: SystemParameters;
  }>>([]);

  // Run simulation
  const points = useMemo(() => {
    return runSimulation(params, stimType, amp, freq, simDuration, timeStep);
  }, [params, stimType, amp, freq, simDuration, timeStep]);

  // Clone Test State
  const [cloneFreqA, setCloneFreqA] = useState(0.05);
  const [cloneFreqB, setCloneFreqB] = useState(0.25);
  const [cloneResults, setCloneResults] = useState<ReturnType<typeof runCloneTest> | null>(null);

  useEffect(() => {
    // Run clone test automatically on parameters of clone change
    const results = runCloneTest(params, stimType, amp, freq, cloneFreqA, cloneFreqB, timeStep);
    setCloneResults(results);
  }, [params, stimType, amp, freq, cloneFreqA, cloneFreqB, timeStep]);

  // Real-time metrics compute
  const fitResults = useMemo(() => {
    return evaluateMarkovianFit(points, 2);
  }, [points]);

  const phi = fitResults.metrics.phi;

  const kStar = useMemo(() => {
    return findMinimumEmbeddingDimension(points, fitResults.metrics.errHistoric, 0.015, 8);
  }, [points, fitResults.metrics.errHistoric]);

  const hysteresisArea = useMemo(() => {
    if (!points.length) return 0;
    let area = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const dE = points[i+1].E - points[i].E;
      const meanS = (points[i+1].S + points[i].S) / 2;
      area += meanS * dE;
    }
    return Math.abs(area);
  }, [points]);

  const computedMetrics = useMemo(() => {
    return {
      phi: phi,
      cloneDivergence: cloneResults ? cloneResults.finalDivergence : 0,
      hysteresisArea: hysteresisArea,
      kStar: kStar,
      noiseSurvival: params.beta > 1.2 ? 0.88 : params.beta > 0.5 ? 0.72 : 0.35
    };
  }, [phi, cloneResults, hysteresisArea, kStar, params.beta]);

  const verdict = useMemo(() => {
    return generateExperimentalVerdict(computedMetrics, locale);
  }, [computedMetrics, locale]);

  // Humanizations
  const hPhi = useMemo(() => humanizeMetric('phi', computedMetrics.phi, locale), [computedMetrics.phi, locale]);
  const hClone = useMemo(() => humanizeMetric('clone_div', computedMetrics.cloneDivergence, locale), [computedMetrics.cloneDivergence, locale]);
  const hKStar = useMemo(() => humanizeMetric('k_star', computedMetrics.kStar, locale), [computedMetrics.kStar, locale]);
  const hHysteresis = useMemo(() => humanizeMetric('hysteresis', computedMetrics.hysteresisArea, locale), [computedMetrics.hysteresisArea, locale]);
  const hNoise = useMemo(() => humanizeMetric('noise_robustness', computedMetrics.noiseSurvival, locale), [computedMetrics.noiseSurvival, locale]);

  const systemState = useMemo(() => {
    const isEn = locale === 'en-US';
    if (computedMetrics.phi < 0.02) {
      return {
        name: isEn ? "Bowl Fish (No Memory)" : "Peixe de Aquário (Sem Memória)",
        desc: isEn ? "The system lives purely in the active present, ignoring its past." : "O sistema vive apenas o momento presente e descarta sua história.",
        color: "text-slate-400 border-slate-800 bg-slate-950/60"
      };
    }
    if (computedMetrics.cloneDivergence > 0.25) {
      return {
        name: isEn ? "Causal Bifurcation / Chaotic" : "Bifurcação Causal / Caótico",
        desc: isEn ? "The twin clones moved in opposing paths due to non-local temporal history." : "Os clones idênticos seguiram destinos opostos devido à não-localidade temporal.",
        color: "text-rose-400 border-rose-950 bg-rose-950/30"
      };
    }
    if (params.potential === 'double_well' && params.eta > 1.4) {
      return {
        name: isEn ? "Crystallized Habit (Static Trauma)" : "Hábito Cristalizado (Trauma Estático)",
        desc: isEn ? "Prolonged settlement has permanently molded the current potential landscape." : "A longa permanência deformou de forma persistente as bacias do presente.",
        color: "text-amber-400 border-amber-900 bg-amber-950/20"
      };
    }
    if (computedMetrics.hysteresisArea > 0.6) {
      return {
        name: isEn ? "Massive Dynamic Hysteresis" : "Histerese Dinâmica Massiva",
        desc: isEn ? "The system resists actively, consuming energy in wide lag loops." : "O sistema resiste ativamente, gastando energia em atrasos de fase gigantes.",
        color: "text-sky-400 border-sky-900 bg-sky-950/25"
      };
    }
    if (computedMetrics.phi > 0.15) {
      return {
        name: isEn ? "Coherent Deep Memory" : "Memória Profunda Coerente",
        desc: isEn ? "The ancient past is folded and continuously shapes all future pathways." : "O passado está dobrando e moldando ativamente todas as trajetórias futuras.",
        color: "text-violet-400 border-violet-905 bg-violet-950/25"
      };
    }
    return {
      name: isEn ? "Balanced Fluid Memory" : "Memória Fluida Equilibrada",
      desc: isEn ? "Stable temporal retention without losing viscoelastic kinematics flexibility." : "Retenção temporal estável sem perder a flexibilidade cinemática.",
      color: "text-emerald-400 border-emerald-900 bg-emerald-950/20"
    };
  }, [computedMetrics.phi, computedMetrics.cloneDivergence, computedMetrics.hysteresisArea, params.potential, params.eta, locale]);

  // Achievements evaluation engine
  useEffect(() => {
    const listToUnlock: string[] = [];
    
    if (computedMetrics.cloneDivergence > 0.05 || computedMetrics.phi > 0.04) {
      listToUnlock.push('genesis_causal');
    }
    if (computedMetrics.phi > 0.18) {
      listToUnlock.push('evidencia_irrefutavel');
    }
    if (computedMetrics.hysteresisArea > 0.45) {
      listToUnlock.push('asas_do_tempo');
    }
    if (computedMetrics.cloneDivergence > 0.25) {
      listToUnlock.push('abismo_dos_gemeos');
    }
    if (computedMetrics.kStar >= 6) {
      listToUnlock.push('complexidade_maxima');
    }
    if (params.eta >= 1.5 || params.alpha >= 1.5) {
      listToUnlock.push('trauma_eterno');
    }

    const newUnlocked = listToUnlock.filter(id => !unlockedAchievements.includes(id));
    if (newUnlocked.length > 0) {
      const updated = [...unlockedAchievements, ...newUnlocked];
      setUnlockedAchievements(updated);
      try {
        localStorage.setItem('prisantemotria_achievements', JSON.stringify(updated));
      } catch (e) { console.error(e); }
      
      const ach = ACHIEVEMENT_REGISTRY[newUnlocked[0]];
      if (ach) {
        setShowAchievementToast(ach.title);
        const timer = setTimeout(() => {
          setShowAchievementToast(null);
        }, 8000);
        return () => clearTimeout(timer);
      }
    }
  }, [computedMetrics, params, unlockedAchievements]);

  // Handle saving current physical simulation snapshot
  const handleSaveSnapshot = () => {
    const name = newSnapshotName.trim() || `Snapshot #${savedSnapshots.length + 1}`;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const snapId = `SNAP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newSnap = {
      id: snapId,
      name,
      notes: newSnapshotNotes.trim() || 'Nenhuma observação física registrada.',
      timestamp,
      params: { ...params },
      metrics: { ...computedMetrics },
      points: [...points],
      stimType,
      amp,
      freq
    };

    const updated = [newSnap, ...savedSnapshots];
    saveSnapshotsToStorage(updated);

    // Reset input fields
    setNewSnapshotName('');
    setNewSnapshotNotes('');

    // Configure comparative memory as the active overlay instantly!
    setSelectedComparisonId(snapId);
  };

  const handleExportSnapshots = () => {
    const fileData = JSON.stringify(savedSnapshots, null, 2);
    const blob = new Blob([fileData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `prisantemotria_snapshots_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportSnapshots = (event: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = event.target.files?.[0];
    if (!file) return;

    fileReader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          const isValid = parsed.every(item => item.id && item.params && item.metrics);
          if (isValid) {
            const updated = [...parsed, ...savedSnapshots];
            const uniqueMap = new Map<string, typeof parsed[0]>();
            updated.forEach(item => uniqueMap.set(item.id, item));
            saveSnapshotsToStorage(Array.from(uniqueMap.values()));
            alert("Snapshots carregados com sucesso!");
          } else {
            alert("Formato incompatível: chaves id, params e metrics em falta.");
          }
        }
      } catch (err) {
        alert("Erro no parseador JSON.");
      }
    };
    fileReader.readAsText(file);
  };

  // Save current configuration to Run History Logs
  const logCurrentRun = () => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLog = {
      id: `RUN-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp,
      phi: computedMetrics.phi,
      divergence: computedMetrics.cloneDivergence,
      verdict: verdict.status,
      paramsSnapshot: { ...params }
    };
    setRunLogs(prev => [newLog, ...prev.slice(0, 4)]);
  };

  // Run downloading capability
  const handleDownloadReport = () => {
    const reportStr = buildMarkdownReport({
      runId: Math.floor(1000 + Math.random() * 9000).toString(),
      timestamp: new Date().toISOString().substring(0, 19).replace('T', ' '),
      userEmail: 'oneforall9119@gmail.com',
      params,
      stimType,
      amp,
      freq,
      metrics: computedMetrics
    });

    const blob = new Blob([reportStr], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `prisantemotria_report_${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper inside to render a simple clean HTML slider
  const renderSlider = (
    label: string,
    key: keyof SystemParameters,
    min: number,
    max: number,
    step: number,
    unit: string = ''
  ) => {
    return (
      <div className="flex flex-col gap-1 text-xs" id={`slider-container-${key}`}>
        <div className="flex justify-between items-center text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            {label}
            <button
              onClick={() => {
                setSelectedCopilotTopic(key);
                setEntenderMelhor(false);
              }}
              className="text-slate-500 hover:text-emerald-400 transition cursor-pointer"
              title="Explicabilidade Cognitiva"
            >
              <HelpCircle size={11} />
            </button>
          </span>
          <span className="text-emerald-400 font-bold">
            {params[key as keyof SystemParameters]} {unit}
          </span>
        </div>
        <input
          type="range"
          id={`input-slider-${key}`}
          min={min}
          max={max}
          step={step}
          value={params[key as keyof SystemParameters] as number}
          onChange={(e) => setParams((p) => ({ ...p, [key]: parseFloat(e.target.value) }))}
          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
        {viewMode === 'human' && COPILOT_TOPICS[key] && (
          <span className="text-[10px] text-zinc-500 font-mono italic select-none">
            {COPILOT_TOPICS[key].shortTooltip.split('.')[0]}.
          </span>
        )}
      </div>
    );
  };

  // Pre-sets to test specific dynamics
  const applyPreset = (name: 'critical' | 'chaotic' | 'damped' | 'double_well_trap') => {
    switch (name) {
      case 'critical':
        setParams({
          m: 1.0,
          gamma: 0.1,
          potential: 'double_well',
          beta: 1.2,
          tauH: 2.5,
          alpha: 1.0,
          eta: 0.3,
          V_height: 0.5,
        });
        setStimType('sine');
        setAmp(1.1);
        setFreq(0.08);
        break;
      case 'chaotic':
        setParams({
          m: 1.0,
          gamma: 0.05,
          potential: 'double_well',
          beta: 2.2,
          tauH: 4.5,
          alpha: 1.5,
          eta: 0.8,
          V_height: 0.8,
        });
        setStimType('chirp');
        setAmp(1.5);
        setFreq(0.1);
        break;
      case 'damped':
        setParams({
          m: 1.2,
          gamma: 0.8,
          potential: 'harmonic',
          beta: 0.2,
          tauH: 1.0,
          alpha: 0.1,
          eta: 0.0,
          V_height: 0.5,
        });
        setStimType('pulse');
        setAmp(1.5);
        setFreq(0.1);
        break;
      case 'double_well_trap':
        setParams({
          m: 1.0,
          gamma: 0.3,
          potential: 'double_well',
          beta: 0.5,
          tauH: 5.0,
          alpha: 0.5,
          eta: 0.1,
          V_height: 1.2,
        });
        setStimType('sine');
        setAmp(0.6);
        setFreq(0.15);
        break;
    }
  };

  // Custom SVG Plot dimensions
  const svgW = 500;
  const svgH = 150;

  // Render mathematical trajectory
  const trajectoryPlot = useMemo(() => {
    if (!points.length) return null;
    const padding = 20;
    const maxS = Math.max(...points.map((p) => Math.abs(p.S))) || 1;
    const maxE = Math.max(...points.map((p) => Math.abs(p.E))) || 1;
    const yRange = Math.max(maxS, maxE, 0.5);

    const getX = (t: number) => padding + (t / simDuration) * (svgW - 2 * padding);
    const getY = (v: number) => svgH / 2 - (v / (yRange * 1.1)) * (svgH / 2 - padding);

    let pathS = '';
    let pathE = '';

    points.forEach((p, index) => {
      const x = getX(p.t);
      const yS = getY(p.S);
      const yE = getY(p.E);

      if (index === 0) {
        pathS = `M ${x} ${yS}`;
        pathE = `M ${x} ${yE}`;
      } else {
        pathS += ` L ${x} ${yS}`;
        pathE += ` L ${x} ${yE}`;
      }
    });

    let companionPathS = '';
    const companion = savedSnapshots.find(s => s.id === selectedComparisonId);
    if (companion && companion.points && companion.points.length) {
      companion.points.forEach((p, index) => {
        const x = getX(p.t);
        const yS = getY(p.S);
        if (index === 0) {
          companionPathS = `M ${x} ${yS}`;
        } else {
          companionPathS += ` L ${x} ${yS}`;
        }
      });
    }

    return (
      <svg className="w-full h-full bg-slate-950/80 rounded" viewBox={`0 0 ${svgW} ${svgH}`} id="trajectory-svg">
        {/* Grid lines */}
        <line x1={0} y1={svgH / 2} x2={svgW} y2={svgH / 2} stroke="#334155" strokeDasharray="4 4" strokeWidth={1} />
        <text x={10} y={svgH / 2 - 4} className="fill-slate-500 text-[9px] font-mono">BASE S=0</text>
        
        {/* Dynamic driving impulse E */}
        <path d={pathE} fill="none" stroke="#dc2626" strokeWidth={1} strokeOpacity={0.4} />
        {/* Dynamic state trajectory S */}
        <path d={pathS} fill="none" stroke="#10b981" strokeWidth={1.8} />

        {/* Companion State overlay */}
        {companionPathS && (
          <path d={companionPathS} fill="none" stroke="#60a5fa" strokeWidth={1.5} strokeDasharray="3 3" strokeOpacity={0.75} />
        )}

        {/* Legend */}
        <g transform={`translate(${svgW - 145}, 15)`} className="text-[10px] font-mono fill-slate-300">
          <circle cx={5} cy={-4} r={3} fill="#10b981" />
          <text x={12} y={0}>Estado Físico S(t)</text>
          <circle cx={5} cy={10} r={3} fill="#dc2626" fillOpacity={0.6} />
          <text x={12} y={14}>Estímulo E(t)</text>
          {companion && (
            <>
              <line x1={0} y1={24} x2={10} y2={24} stroke="#60a5fa" strokeDasharray="2 2" strokeWidth={1.5} />
              <text x={12} y={28} className="fill-blue-400">S ({companion.name.substring(0, 8)}...)</text>
            </>
          )}
        </g>
      </svg>
    );
  }, [points, simDuration, savedSnapshots, selectedComparisonId]);

  // Render coupled memory \Delta F
  const memoryPlot = useMemo(() => {
    if (!points.length) return null;
    const padding = 20;
    const maxdF = Math.max(...points.map((p) => Math.abs(p.dF))) || 1;
    const yRange = Math.max(maxdF, 0.5);

    const getX = (t: number) => padding + (t / simDuration) * (svgW - 2 * padding);
    const getY = (v: number) => svgH / 2 - (v / (yRange * 1.1)) * (svgH / 2 - padding);

    let pathdF = '';
    points.forEach((p, index) => {
      const x = getX(p.t);
      const ydF = getY(p.dF);
      if (index === 0) {
        pathdF = `M ${x} ${ydF}`;
      } else {
        pathdF += ` L ${x} ${ydF}`;
      }
    });

    let companionPathdF = '';
    const companion = savedSnapshots.find(s => s.id === selectedComparisonId);
    if (companion && companion.points && companion.points.length) {
      companion.points.forEach((p, index) => {
        const x = getX(p.t);
        const ydF = getY(p.dF);
        if (index === 0) {
          companionPathdF = `M ${x} ${ydF}`;
        } else {
          companionPathdF += ` L ${x} ${ydF}`;
        }
      });
    }

    return (
      <svg className="w-full h-full bg-slate-950/80 rounded" viewBox={`0 0 ${svgW} ${svgH}`} id="memory-svg">
        <line x1={0} y1={svgH / 2} x2={svgW} y2={svgH / 2} stroke="#334155" strokeDasharray="4 4" strokeWidth={1} />
        <path d={pathdF} fill="none" stroke="#6366f1" strokeWidth={1.5} />

        {companionPathdF && (
          <path d={companionPathdF} fill="none" stroke="#f472b6" strokeWidth={1.2} strokeDasharray="3 3" strokeOpacity={0.7} />
        )}

        <g transform={`translate(${svgW - 145}, 15)`} className="text-[10px] font-mono fill-slate-300">
          <circle cx={5} cy={-4} r={3} fill="#6366f1" />
          <text x={13} y={0}>Memória \u0394F(t)</text>
          {companion && (
            <>
              <line x1={0} y1={9} x2={10} y2={9} stroke="#f472b6" strokeDasharray="2 2" strokeWidth={1.2} />
              <text x={13} y={12} className="fill-pink-400">\u0394F ({companion.name.substring(0, 8)}...)</text>
            </>
          )}
        </g>
      </svg>
    );
  }, [points, simDuration, savedSnapshots, selectedComparisonId]);

  // Phase Space S vs dS/dt (Velocity)
  const phasePortrait = useMemo(() => {
    if (!points.length) return null;
    const padding = 20;
    const maxS = Math.max(...points.map((p) => Math.abs(p.S))) || 1;
    const maxdS = Math.max(...points.map((p) => Math.abs(p.dS))) || 1;
    
    // Bounds
    const xMax = maxS * 1.1;
    const yMax = maxdS * 1.1;

    const getX = (SVal: number) => svgW / 2 + (SVal / xMax) * (svgW / 2 - padding);
    const getY = (dSVal: number) => svgH / 2 - (dSVal / yMax) * (svgH / 2 - padding);

    let path = '';
    points.forEach((p, index) => {
      const x = getX(p.S);
      const y = getY(p.dS);
      if (index === 0) {
        path = `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });

    let companionPath = '';
    const companion = savedSnapshots.find(s => s.id === selectedComparisonId);
    if (companion && companion.points && companion.points.length) {
      companion.points.forEach((p, index) => {
        const x = getX(p.S);
        const y = getY(p.dS);
        if (index === 0) {
          companionPath = `M ${x} ${y}`;
        } else {
          companionPath += ` L ${x} ${y}`;
        }
      });
    }

    return (
      <svg className="w-full h-full bg-slate-950/80 rounded" viewBox={`0 0 ${svgW} ${svgH}`} id="phase-portrait-svg">
        <line x1={svgW / 2} y1={0} x2={svgW / 2} y2={svgH} stroke="#334155" strokeDasharray="3 3" />
        <line x1={0} y1={svgH / 2} x2={svgW} y2={svgH / 2} stroke="#334155" strokeDasharray="3 3" />
        
        <path d={path} fill="none" stroke="#eab308" strokeWidth={1} strokeOpacity={0.8} />

        {companionPath && (
          <path d={companionPath} fill="none" stroke="#38bdf8" strokeWidth={1.2} strokeDasharray="2 2" strokeOpacity={0.75} />
        )}

        {/* Start/End marker */}
        {points.length > 0 && (
          <>
            <circle cx={getX(points[0].S)} cy={getY(points[0].dS)} r={4} fill="#dc2626" />
            <circle cx={getX(points[points.length - 1].S)} cy={getY(points[points.length - 1].dS)} r={4} fill="#10b981" />
          </>
        )}

        <g transform="translate(10, 15)" className="text-[9px] font-mono fill-slate-400">
          <text y={0}>Vertical: Velocidade S'</text>
          <text y={11}>Horizontal: Posição S</text>
          {companion && (
            <text y={22} className="fill-sky-400">Ghost: {companion.name.substring(0, 10)}</text>
          )}
        </g>
      </svg>
    );
  }, [points, savedSnapshots, selectedComparisonId]);

  // Hysteresis Loop: E(t) vs S(t)
  const hysteresisLoop = useMemo(() => {
    if (!points.length) return null;
    const padding = 20;
    const maxE = Math.max(...points.map((p) => Math.abs(p.E))) || 1;
    const maxS = Math.max(...points.map((p) => Math.abs(p.S))) || 1;

    const getX = (E: number) => svgW / 2 + (E / (maxE * 1.1)) * (svgW / 2 - padding);
    const getY = (SVal: number) => svgH / 2 - (SVal / (maxS * 1.1)) * (svgH / 2 - padding);

    let path = '';
    points.forEach((p, index) => {
      const x = getX(p.E);
      const y = getY(p.S);
      if (index === 0) {
        path = `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });

    let companionPath = '';
    const companion = savedSnapshots.find(s => s.id === selectedComparisonId);
    if (companion && companion.points && companion.points.length) {
      companion.points.forEach((p, index) => {
        const x = getX(p.E);
        const y = getY(p.S);
        if (index === 0) {
          companionPath = `M ${x} ${y}`;
        } else {
          companionPath += ` L ${x} ${y}`;
        }
      });
    }

    return (
      <svg className="w-full h-full bg-slate-950/80 rounded" viewBox={`0 0 ${svgW} ${svgH}`} id="hysteresis-svg">
        <line x1={svgW / 2} y1={0} x2={svgW / 2} y2={svgH} stroke="#334155" strokeDasharray="3 3" />
        <line x1={0} y1={svgH / 2} x2={svgW} y2={svgH / 2} stroke="#334155" strokeDasharray="3 3" />
        
        <path d={path} fill="none" stroke="#f43f5e" strokeWidth={1.3} />

        {companionPath && (
          <path d={companionPath} fill="none" stroke="#a78bfa" strokeWidth={1.1} strokeDasharray="2 2" strokeOpacity={0.7} />
        )}

        <g transform="translate(10, 15)" className="text-[9px] font-mono fill-slate-400">
          <text y={0}>Loop de Histerese</text>
          <text y={11}>Horizontal: Força E(t)</text>
          <text y={22}>Vertical: Resposta S(t)</text>
          {companion && (
            <text y={33} className="fill-purple-400">Ghost: {companion.name.substring(0, 10)}</text>
          )}
        </g>
      </svg>
    );
  }, [points, savedSnapshots, selectedComparisonId]);

  // Interactive Live Model Of the Potential Energy Well (molecular slide representation)
  const potentialWellVisualizer = useMemo(() => {
    const pW = 350;
    const pH = 120;
    const numPoints = 80;
    const maxS = 2.0;

    let path = '';
    const getX_proj = (SVal: number) => pW / 2 + (SVal / maxS) * (pW / 2 - 10);
    const getY_proj = (EVal: number) => pH - 15 - (EVal / 1.5) * (pH - 30);

    for (let i = 0; i < numPoints; i++) {
      const sVal = -maxS + (i / (numPoints - 1)) * (2 * maxS);
      const energy = getPotentialEnergy(sVal, params);
      const x = getX_proj(sVal);
      const y = getY_proj(energy);

      if (i === 0) {
        path = `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }

    // Get current position of S to plot the actual ball
    const currentPoint = points[points.length - 1] || { S: 0 };
    const currentS = currentPoint.S;
    const currentU = getPotentialEnergy(currentS, params);
    const ballX = getX_proj(currentS);
    const ballY = getY_proj(currentU);

    return (
      <div className="flex flex-col gap-2 p-3 bg-slate-900 border border-slate-800 rounded-lg" id="potential-well-card">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1">
            <Info size={12} className="text-emerald-400" />
            V(S) Poço de Potencial & Partícula Escorregando
          </span>
          <span className="font-mono text-[10px] text-zinc-400 italic">
            Potencial: {params.potential.toUpperCase()}
          </span>
        </div>
        <div className="relative w-full h-[120px] bg-slate-950 rounded border border-slate-950 flex items-center justify-center">
          <svg className="w-full h-full" viewBox={`0 0 ${pW} ${pH}`}>
            {/* Potential curve */}
            <path d={path} fill="none" stroke="#38bdf8" strokeWidth={2.5} />
            
            {/* Base line */}
            <line x1={0} y1={pH - 15} x2={pW} y2={pH - 15} stroke="#334155" strokeWidth={1} />
            
            {/* Physical State ball */}
            <circle cx={ballX} cy={ballY} r={6} className="fill-emerald-400 animate-pulse stroke-slate-900 stroke-2" />
            
            {/* Well legends */}
            {params.potential === 'double_well' && (
              <>
                <text x={getX_proj(-1)} y={pH - 3} className="text-[8px] fill-slate-500 font-mono text-center" textAnchor="middle">-1 (Poço A)</text>
                <text x={getX_proj(1)} y={pH - 3} className="text-[8px] fill-slate-500 font-mono text-center" textAnchor="middle">+1 (Poço B)</text>
              </>
            )}
          </svg>
        </div>
      </div>
    );
  }, [params, points]);

  // Render Clone Sincronization Test Graph
  const clonePlot = useMemo(() => {
    if (!cloneResults) return null;
    const padding = 20;
    const cW = 500;
    const cH = 170;

    const maxS = Math.max(
      ...cloneResults.timeSeries.map((p) => Math.max(Math.abs(p.S_A), Math.abs(p.S_B)))
    ) || 1;

    const getX = (t: number) => padding + (t / 15) * (cW - 2 * padding);
    const getY = (v: number) => cH / 2 - (v / (maxS * 1.1)) * (cH / 2 - padding);

    let pathSA = '';
    let pathSB = '';
    let pathDiv = '';

    cloneResults.timeSeries.forEach((p, index) => {
      const x = getX(p.t);
      const yA = getY(p.S_A);
      const yB = getY(p.S_B);
      const yDiv = cH - padding - (p.divergence / (maxS * 2)) * (cH / 2 - padding);

      if (index === 0) {
        pathSA = `M ${x} ${yA}`;
        pathSB = `M ${x} ${yB}`;
        pathDiv = `M ${x} ${yDiv}`;
      } else {
        pathSA += ` L ${x} ${yA}`;
        pathSB += ` L ${x} ${yB}`;
        pathDiv += ` L ${x} ${yDiv}`;
      }
    });

    return (
      <svg className="w-full h-full bg-slate-950/80 rounded" viewBox={`0 0 ${cW} ${cH}`} id="clone-svg">
        <line x1={0} y1={cH / 2} x2={cW} y2={cH / 2} stroke="#334155" strokeDasharray="3 3" />
        
        {/* Trajectories */}
        <path d={pathSA} fill="none" stroke="#22d3ee" strokeWidth={1.5} />
        <path d={pathSB} fill="none" stroke="#fb923c" strokeWidth={1.5} />
        
        {/* Divergence curve filled */}
        <path d={pathDiv} fill="none" stroke="#ef4444" strokeWidth={1} strokeDasharray="2 2" strokeOpacity={0.6} />

        <g transform={`translate(${cW - 160}, 15)`} className="text-[9px] font-mono fill-slate-300">
          <circle cx={5} cy={-2} r={3} fill="#22d3ee" />
          <text x={12} y={1}>Clone A (f_ant={cloneFreqA} Hz)</text>
          <circle cx={5} cy={10} r={3} fill="#fb923c" />
          <text x={12} y={13}>Clone B (f_ant={cloneFreqB} Hz)</text>
          <line x1={2} y1={22} x2={8} y2={22} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="2 2" />
          <text x={12} y={25}>Divergência D(t)</text>
        </g>

        <text x={10} y={cH - 10} className="text-[8px] fill-slate-500 font-mono">
          *Ambos sincronizados exatamente em S_A=S_B e dS_A=dS_B no tempo t=0
        </text>
      </svg>
    );
  }, [cloneResults, cloneFreqA, cloneFreqB]);

  // Variational Energy Balance Plot K_S + V_S + U_dF + E_coupling = Hamiltonian
  const energyBalancePlot = useMemo(() => {
    if (!points.length) return null;
    const padding = 20;

    const energies = points.map(p => {
      const K_S = (p.P_S * p.P_S) / (2 * params.m);
      const V_S = p.V_S;
      const U_dF = p.U_dF;
      const E_coupling = - params.beta * p.S * p.dF;
      const H = p.Hamiltonian;
      return { t: p.t, K_S, V_S, U_dF, E_coupling, H };
    });

    const allVals = energies.flatMap(e => [e.K_S, e.V_S, e.U_dF, e.E_coupling, e.H]);
    const maxVal = Math.max(...allVals.map(Math.abs)) || 1;
    const yRange = maxVal * 1.15;

    const getX = (t: number) => padding + (t / simDuration) * (svgW - 2 * padding);
    const getY = (v: number) => svgH / 2 - (v / yRange) * (svgH / 2 - padding);

    let pathKS = '';
    let pathVS = '';
    let pathUdF = '';
    let pathCoupling = '';
    let pathH = '';

    energies.forEach((e, idx) => {
      const x = getX(e.t);
      const yKS = getY(e.K_S);
      const yVS = getY(e.V_S);
      const yUdF = getY(e.U_dF);
      const yCoupling = getY(e.E_coupling);
      const yH = getY(e.H);

      if (idx === 0) {
        pathKS = `M ${x} ${yKS}`;
        pathVS = `M ${x} ${yVS}`;
        pathUdF = `M ${x} ${yUdF}`;
        pathCoupling = `M ${x} ${yCoupling}`;
        pathH = `M ${x} ${yH}`;
      } else {
        pathKS += ` L ${x} ${yKS}`;
        pathVS += ` L ${x} ${yVS}`;
        pathUdF += ` L ${x} ${yUdF}`;
        pathCoupling += ` L ${x} ${yCoupling}`;
        pathH += ` L ${x} ${yH}`;
      }
    });

    return (
      <svg className="w-full h-full bg-slate-950/80 rounded animate-fade-in" viewBox={`0 0 ${svgW} ${svgH}`} id="energy-balance-svg">
        <line x1={0} y1={svgH / 2} x2={svgW} y2={svgH / 2} stroke="#334155" strokeDasharray="3 3" />
        
        <path d={pathKS} fill="none" stroke="#f43f5e" strokeWidth={1} strokeOpacity={0.75} />
        <path d={pathVS} fill="none" stroke="#38bdf8" strokeWidth={1} strokeOpacity={0.75} />
        <path d={pathUdF} fill="none" stroke="#a78bfa" strokeWidth={1} strokeOpacity={0.75} />
        <path d={pathCoupling} fill="none" stroke="#f59e0b" strokeWidth={1} strokeOpacity={0.65} />
        <path d={pathH} fill="none" stroke="#10b981" strokeWidth={2} />

        <g transform={`translate(${svgW - 135}, 15)`} className="text-[8px] font-mono fill-slate-400">
          <circle cx={4} cy={-2} r={2.5} fill="#f43f5e" />
          <text x={10} y={1}>Cinética K_S</text>
          <circle cx={4} cy={8} r={2.5} fill="#38bdf8" />
          <text x={10} y={11}>Potencial V(S)</text>
          <circle cx={4} cy={18} r={2.5} fill="#a78bfa" />
          <text x={10} y={21}>Interna U(ΔF)</text>
          <circle cx={4} cy={28} r={2.5} fill="#f59e0b" />
          <text x={10} y={31}>Acoplamento (-βSΔF)</text>
          <circle cx={4} cy={38} r={2.5} fill="#10b981" />
          <text x={10} y={41} className="fill-emerald-400 font-bold">Hamiltoniano H</text>
        </g>
        
        <g transform="translate(10, 15)" className="text-[8px] font-mono fill-slate-500">
          <text>Balanço de Energia de Euler-Lagrange</text>
          <text y={9}>Provando dissipação e acoplamento</text>
        </g>
      </svg>
    );
  }, [points, params.m, params.beta, simDuration]);

  return (
    <div className="flex flex-col gap-6" id="core-tab">
      
      {/* 3-Mode Decisivo Dashboard Toggle Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl" id="modes-navbar">
        <div className="flex items-center gap-3">
          <Layers className="text-emerald-400 rotate-12" size={20} />
          <div className="flex flex-col">
            <h1 className="text-xs uppercase font-mono tracking-widest text-slate-300 font-bold">Prisantemotria Lab v2.0</h1>
            <span className="text-[10px] text-slate-500 font-mono">Teoria Operacional da Historicidade Dinâmica</span>
          </div>
        </div>

        {/* The Toggle Buttons */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 w-full md:w-auto" id="mode-buttons-wrapper">
          <button
            onClick={() => setViewMode('scientific')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-[11px] font-mono font-medium rounded-md transition-all ${
              viewMode === 'scientific'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-inner'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🔬 Modo Pesquisa (Avançado)
          </button>
          <button
            onClick={() => setViewMode('operational')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-[11px] font-mono font-medium rounded-md transition-all ${
              viewMode === 'operational'
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/40 shadow-inner'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📋 Modo Técnico (Prático)
          </button>
          <button
            onClick={() => setViewMode('human')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-[11px] font-mono font-medium rounded-md transition-all ${
              viewMode === 'human'
                ? 'bg-violet-950 text-violet-300 border border-violet-500/40 shadow-inner'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            💡 Modo Leigo (Intuitivo)
          </button>
        </div>

        {/* Global Live Verdict Indicator */}
        <div className="flex items-center gap-3 bg-slate-950 px-3.5 py-1.5 rounded-lg border border-slate-800 shrink-0 w-full md:w-auto" id="global-verdict">
          <span className="text-[10px] uppercase font-mono text-slate-500">Veredito:</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
              verdict.status === 'GREENLIGHT' ? 'bg-emerald-500' :
              verdict.status === 'MARGINAL' ? 'bg-amber-500' :
              verdict.status === 'REDLIGHT' ? 'bg-rose-500' : 'bg-slate-500'
            }`} />
            <span className={`text-xs font-bold font-mono ${
              verdict.status === 'GREENLIGHT' ? 'text-emerald-400' :
              verdict.status === 'MARGINAL' ? 'text-amber-400' :
              verdict.status === 'REDLIGHT' ? 'text-rose-400' : 'text-slate-400'
            }`}>
              {verdict.status}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic System State Badge - Qualitative Translation bar */}
      <div className={`border rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg transition-colors duration-300 ${systemState.color}`} id="system-state-badge">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-950/50 flex items-center justify-center font-mono text-xl border border-current/15 shrink-0 mt-0.5">
            📊
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-70">Estado Atual do Sistema:</span>
              <strong className="text-sm font-bold font-display uppercase tracking-tight text-white">{systemState.name}</strong>
            </div>
            <p className="text-xs opacity-90 leading-relaxed font-sans mt-0.5 text-zinc-300">{systemState.desc}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto shrink-0 md:justify-end">
          <span className="px-2.5 py-1 bg-slate-950/60 rounded-lg border border-slate-800 text-[10px] font-mono font-bold text-zinc-300">
            Φ = {(computedMetrics.phi * 100).toFixed(2)}%
          </span>
          <span className="px-2.5 py-1 bg-slate-950/60 rounded-lg border border-slate-800 text-[10px] font-mono font-bold text-zinc-300">
            Histerese = {computedMetrics.hysteresisArea.toFixed(3)}
          </span>
          <span className="px-2.5 py-1 bg-slate-950/60 rounded-lg border border-slate-800 text-[10px] font-mono font-bold text-zinc-300">
            Clones D_max = {computedMetrics.cloneDivergence.toFixed(3)}
          </span>
        </div>
      </div>

      {/* Guide / Onboarding collapsible panel */}
      {showWelcomeGuide && (
        <div className="bg-[#0b101c] border border-violet-800/25 rounded-xl p-5 relative overflow-hidden shadow-2xl animate-fade-in" id="welcome-onboarding-panel">
          <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/5 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-600 via-emerald-500 to-indigo-600" />
          <div className="flex justify-between items-start pb-2 border-b border-slate-850/60 mb-3.5">
            <div className="flex items-center gap-2">
              <Sparkles className="text-violet-400" size={16} />
              <h2 className="text-xs font-bold font-display uppercase text-slate-200 tracking-wide">Guia Rápido dos Primeiros 3 Minutos</h2>
            </div>
            <button
              onClick={() => setShowWelcomeGuide(false)}
              className="text-zinc-500 hover:text-slate-300 font-mono text-[10px] uppercase bg-slate-950/60 p-1 px-2 border border-slate-850 rounded hover:scale-[1.02] active:scale-1.0 font-bold cursor-pointer transition-all"
            >
              Recolher Guia
            </button>
          </div>
          <p className="text-[11.5px] text-slate-300 font-sans leading-relaxed">
            Este laboratório explora cenários e sistemas onde o <strong className="text-violet-400 font-semibold font-sans">passado de trajetórias continua influenciando fisicamente o presente</strong> (sistema viscoelástico com histerese). Siga a rota sugerida no mapa de metas cognitivas abaixo para testar fenômenos de atraso mental e desvios. 
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mt-4 text-[11px]">
            <div className="bg-[#0a0d14] p-3 rounded-lg border border-slate-850/60 flex flex-col gap-1.5 shadow-sm">
              <span className="text-[9px] font-bold font-mono text-violet-400">1. ESCOLA DE CENÁRIOS</span>
              <p className="text-zinc-400 leading-normal font-sans">Escolha um cenário guiado abaixo (ex: <em className="text-violet-300 not-italic font-medium">Sistema Sem Memória</em>) para carregar parâmetros iniciais.</p>
            </div>
            <div className="bg-[#0a0d14] p-3 rounded-lg border border-slate-850/60 flex flex-col gap-1.5 shadow-sm">
              <span className="text-[9px] font-bold font-mono text-amber-500">2. INTERAÇÃO E SLIDERS</span>
              <p className="text-zinc-400 leading-normal font-sans">Ajuste <strong className="text-amber-400/90 font-medium">β (beta)</strong> e <strong className="text-amber-400/90 font-medium font-mono">τ_H (tauH)</strong> no painel esquerdo para alterar a retenção e atrito fásico.</p>
            </div>
            <div className="bg-[#0a0d14] p-3 rounded-lg border border-slate-850/60 flex flex-col gap-1.5 shadow-sm">
              <span className="text-[9px] font-bold font-mono text-sky-400">3. SIMULAR ESTADOS</span>
              <p className="text-zinc-400 leading-normal font-sans">Clique em <strong className="text-emerald-400 font-semibold">Rodar Simulação</strong> no topo ou alterne os estimuladores físicos.</p>
            </div>
            <div className="bg-[#0a0d14] p-3 rounded-lg border border-slate-850/60 flex flex-col gap-1.5 shadow-sm">
              <span className="text-[9px] font-bold font-mono text-zinc-400">4. COMPARAÇÕES</span>
              <p className="text-zinc-400 leading-normal font-sans">Grave runs no <strong className="text-zinc-300 font-medium">Caderno de Experimentos</strong> em fotos fantasmas (Overlay) para ver atrasos de fase.</p>
            </div>
            <div className="bg-[#0a0d14] p-3 rounded-lg border border-slate-850/60 flex flex-col gap-1.5 shadow-sm">
              <span className="text-[9px] font-bold font-mono text-rose-400">5. DIVERGIR CLONES</span>
              <p className="text-zinc-400 leading-normal font-sans">Sincronize clones na calha comum. Veja como passados distintos desviam órbitas futuras.</p>
            </div>
          </div>
          <div className="mt-3.5 pt-2.5 border-t border-slate-850/45 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>💡 Dica: Você <strong className="text-emerald-400 font-semibold">NÃO precisa entender matemática</strong> para se divertir e explorar as interações.</span>
            <span className="text-zinc-500 uppercase font-bold">Prisantemotria Education Kit</span>
          </div>
        </div>
      )}
      {!showWelcomeGuide && (
        <div className="flex justify-end -mt-3 mb-2">
          <button 
            onClick={() => setShowWelcomeGuide(true)}
            className="text-[10px] font-mono font-bold text-violet-400 hover:text-slate-100 bg-slate-950 px-3 py-1.5 border border-slate-850 rounded hover:scale-[1.02] active:scale-1.0 cursor-pointer transition text-right"
          >
             Mostrar Guia de Onboarding (3 minutos)
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sliders and Presets panel (Always active on left for live control) */}
        <div className="lg:card bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4" id="params-panel">
          <div className="flex items-center justify-between pb-2 border-b border-slate-805">
            <div className="flex items-center gap-2">
              <Sliders className="text-emerald-400" size={17} />
              <h2 className="text-sm font-semibold text-slate-100 font-display">Parâmetros Ativos</h2>
            </div>
            <button 
              onClick={logCurrentRun}
              className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-2 py-0.5 rounded hover:bg-emerald-900/40 transition"
              title="Gravar configurações no registro histórico"
            >
              Gravar Run
            </button>
          </div>

          {/* Quick presets */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-zinc-500 font-mono font-semibold uppercase">Estudos Sugeridos:</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                id="preset-critical"
                onClick={() => applyPreset('critical')}
                className="px-2 py-1 text-[10px] font-mono font-semibold border border-slate-700 hover:border-emerald-500 rounded bg-slate-800 hover:bg-slate-750 transition text-slate-200 text-left"
              >
                ● Memória Crítica
              </button>
              <button
                id="preset-chaos"
                onClick={() => applyPreset('chaotic')}
                className="px-2 py-1 text-[10px] font-mono font-semibold border border-slate-700 hover:border-violet-500 rounded bg-slate-800 hover:bg-slate-750 transition text-slate-200 text-left"
              >
                ● Caótico Sweep
              </button>
              <button
                id="preset-damped"
                onClick={() => applyPreset('damped')}
                className="px-2 py-1 text-[10px] font-mono font-semibold border border-slate-700 hover:border-sky-500 rounded bg-slate-800 hover:bg-slate-750 transition text-slate-200 text-left"
              >
                ● Amortecido Limpo
              </button>
              <button
                id="preset-trapped"
                onClick={() => applyPreset('double_well_trap')}
                className="px-2 py-1 text-[10px] font-mono font-semibold border border-slate-700 hover:border-amber-500 rounded bg-slate-800 hover:bg-slate-750 transition text-slate-200 text-left"
              >
                ● Poço Bloqueado
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3.5 pt-2">
            {/* System Potential Selector */}
            <div className="flex flex-col gap-1 text-xs" id="potential-selector-container">
              <span className="font-mono text-slate-400">Poço de Potencial V(S)</span>
              <div className="grid grid-cols-3 gap-1">
                {(['harmonic', 'double_well', 'soft_asymmetric'] as PotentialType[]).map((p) => (
                  <button
                    key={p}
                    id={`potential-btn-${p}`}
                    onClick={() => setParams((params) => ({ ...params, potential: p }))}
                    className={`py-1 text-[10px] font-mono rounded font-semibold capitalize border ${
                      params.potential === p
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {p.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            {renderSlider('Massa / Inércia State (m)', 'm', 0.2, 5.0, 0.1)}
            {renderSlider('Fricção / Dissipação (\u03B3)', 'gamma', 0.05, 1.5, 0.05)}
            {renderSlider('Acoplamento Histórico (\u03B2)', 'beta', 0.0, 3.0, 0.1)}
            {renderSlider('Escala de Memória (\u03C4_H)', 'tauH', 0.2, 10.0, 0.2, 's')}
            {renderSlider('Impressão por Mudança (\u03B1)', 'alpha', 0.0, 2.0, 0.1)}
            {renderSlider('Impressão por Exposição (\u03B7)', 'eta', 0.0, 2.0, 0.1)}

            {params.potential === 'double_well' &&
              renderSlider('Altura da Barreira (Well)', 'V_height', 0.1, 2.5, 0.1)}
          </div>

          {/* Stimulus settings */}
          <div className="mt-2 p-3 bg-slate-950 border border-slate-850 rounded-lg flex flex-col gap-3" id="stimulus-config">
            <span className="text-[10px] text-zinc-500 font-mono font-semibold uppercase flex items-center gap-1">
              <Settings2 size={12} /> CONFIGURAÇÃO DO ESTÍMULO E(t)
            </span>

            <div className="flex flex-col gap-1 text-xs">
              <span className="text-slate-400 font-mono">Tipo de Sinal Entrada</span>
              <select
                id="stim-type-select"
                value={stimType}
                onChange={(e) => setStimType(e.target.value as StimulusType)}
                className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded font-mono text-[11px] text-slate-200"
              >
                <option value="sine">Onda Senoidal</option>
                <option value="pulse">Pulso Periódico</option>
                <option value="chirp">Sinal Chirp (Freq Varredura)</option>
                <option value="bistable">Degraus Alternados</option>
                <option value="thermal_noise">Ruído Térmico Colorido</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-0.5 text-[10px]">
                <span className="text-zinc-400 font-mono">Amplitude (Amp)</span>
                <input
                  type="number"
                  id="stim-amp-input"
                  value={amp}
                  step={0.1}
                  onChange={(e) => setAmp(parseFloat(e.target.value) || 0)}
                  className="w-full px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300 font-mono"
                />
              </div>
              <div className="flex flex-col gap-0.5 text-[10px]">
                <span className="text-zinc-400 font-mono">Frequência (Hz)</span>
                <input
                  type="number"
                  id="stim-freq-input"
                  value={freq}
                  step={0.01}
                  onChange={(e) => setFreq(parseFloat(e.target.value) || 0)}
                  className="w-full px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Dashboard Area (2 columns span) */}
        <div className="lg:col-span-2 flex flex-col gap-6" id="curves-board">

          {/* BARRA DE PROGRESSÃO CONCEITUAL: JORNADA DE COMPLEXIDADE (12 CENÁRIOS EM 4 TIERS) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 shadow-xl font-sans" id="concept-progression-bar">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pb-2 border-b border-slate-800">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono tracking-widest text-violet-400 font-bold uppercase flex items-center gap-1.5 animate-pulse">
                  🎓 Sistema de Estado Cognitivo • Jornada de Complexidade
                </span>
                <h2 className="text-xs font-bold text-slate-100 font-display uppercase tracking-wide mt-0.5">Scenários Científicos Pré-definidos</h2>
              </div>
              <div className="text-[10px] font-mono text-zinc-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                Cenário Ativo: <strong className="text-violet-400 font-bold">#{cognitiveStage} / 12</strong>
              </div>
            </div>

            {/* Tier Selectors */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-850">
              {[
                { id: 1, label: "T1: Entender Memória" },
                { id: 2, label: "T2: Historicidade" },
                { id: 3, label: "T3: Não-Localidade" },
                { id: 4, label: "T4: Limite Teórico" },
              ].map((t) => {
                const isActive = selectedScenarioTier === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedScenarioTier(t.id)}
                    className={`py-1.5 text-[10px] font-mono rounded font-medium transition cursor-pointer text-center ${
                      isActive
                        ? 'bg-violet-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Grid of the 3 scenarios inside the selected Tier */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {PROGRESS_STAGES.filter(stage => stage.tier === selectedScenarioTier).map((stage) => {
                const isActive = cognitiveStage === stage.id;
                const localizedStageInfo = dict.scenarios.find(s => s.id === stage.id) || stage;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setCognitiveStage(stage.id)}
                    className={`flex flex-col gap-1.5 p-3 rounded-lg border text-left transition-all ${
                      isActive
                        ? 'bg-violet-950/25 border-violet-500/70 shadow-lg shadow-violet-500/5'
                        : 'bg-slate-950/50 border-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-mono text-slate-500 uppercase">CENÁRIO 0{stage.id}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-violet-400 animate-pulse' : 'bg-slate-850'}`} />
                    </div>
                    <span className={`text-[11px] font-bold leading-tight ${isActive ? 'text-violet-300' : 'text-slate-300'}`}>
                      {localizedStageInfo.title}
                    </span>
                    <span className="text-[8.5px] font-mono text-zinc-500 leading-snug">
                      Modo: {stage.stimType.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Interactive scenario explainer panel */}
            {(() => {
              const activeStage = PROGRESS_STAGES.find(s => s.id === cognitiveStage) || PROGRESS_STAGES[0];
              const localizedActiveStage = dict.scenarios.find(s => s.id === activeStage.id) || dict.scenarios[0];
              const isEn = locale === 'en-US';
              return (
                <div className="bg-slate-950/60 border border-slate-850/60 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5 md:col-span-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-mono uppercase bg-violet-950 text-violet-400 font-bold border border-violet-900/40">
                        {localizedActiveStage.tierTitle}
                      </span>
                      <h3 className="text-xs font-bold text-slate-200">{localizedActiveStage.title}</h3>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">{localizedActiveStage.description}</p>
                    
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-[8px] font-mono uppercase text-zinc-500 font-bold tracking-wider">
                        {isEn ? "Experiment Test Roadmap:" : "Roteiro do Experimento para Testagem:"}
                      </span>
                      <div className="flex flex-col gap-1">
                        {localizedActiveStage.checklist.map((item, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-300 bg-slate-900/45 p-1 px-2.5 border border-slate-850/35 rounded leading-normal">
                            <span className="text-violet-400">✓</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between bg-slate-950 p-3.5 rounded border border-slate-850 min-h-[140px] text-[11px]">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[8px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
                        {isEn ? "Scientific Configurator" : "Configurador Científico"}
                      </span>
                      <span className="text-[9px] text-slate-500 leading-normal font-mono">
                        {isEn 
                          ? "Instantly configures all mathematical ODE models, potential landscapes, and recommended driving signals."
                          : "Ajusta instantaneamente todas as ODEs, potenciais e geradores de sinais harmônicos fásicos recomendados."}
                      </span>

                      <div className="flex flex-col gap-1 bg-slate-900/30 border border-slate-850 p-1.5 rounded font-mono text-[8px] text-zinc-400 mt-1">
                        <div className="flex justify-between">
                          <span>{isEn ? "Suggested Signal:" : "Sinal Sugerido:"}</span>
                          <span className="text-cyan-400 font-bold">{activeStage.stimType.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{isEn ? "Target Signature:" : "Assinatura Alvo:"}</span>
                          <span className="text-violet-400">{localizedActiveStage.expectedSignature}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setParams({ ...activeStage.presetParams });
                        setStimType(activeStage.stimType);
                        setAmp(activeStage.amp);
                        setFreq(activeStage.freq);
                        logCurrentRun();
                      }}
                      className="w-full mt-3 py-2 bg-violet-600 hover:bg-violet-500 rounded text-slate-100 font-mono text-[9px] font-bold tracking-wider uppercase cursor-pointer transition text-center shadow-lg shadow-violet-950/20"
                    >
                      ⚡ {isEn ? "Load Scenario" : "Carregar Cenário"}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* CENTRAL DE EXPERIMENTOS (CADERNO DE EXPERIMENTOS) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 shadow-xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-2 border-b border-slate-800">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono tracking-widest text-sky-400 font-bold uppercase flex items-center gap-1.5">
                  <HistoryIcon size={12} className="text-sky-450 animate-spin" style={{ animationDuration: '15s' }} /> Caderno Experimental de Campo & Overlays
                </span>
                <h2 className="text-xs font-bold text-slate-100 font-display uppercase tracking-wide mt-0.5">Caderno de Experimentos (Ensaio e Registros)</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportSnapshots}
                  title="Exportar anotações do caderno como arquivo JSON"
                  className="px-2 py-1 bg-slate-950 hover:bg-slate-850 text-slate-300 hover:text-white rounded border border-slate-800 font-mono text-[9px] transition flex items-center gap-1"
                >
                  <Download size={10} /> EXPORTAR CADERNO
                </button>
                <label className="px-2 py-1 bg-slate-950 hover:bg-slate-850 text-slate-300 text-[9px] hover:text-white rounded border border-slate-800 font-mono transition flex items-center gap-1 cursor-pointer">
                  <Layers size={10} /> IMPORTAR CADERNO
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportSnapshots}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* CADERNO CREATION & ANNOTATIONS */}
              <div className="flex flex-col gap-3 p-4 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-[10px] font-mono uppercase text-sky-400 font-semibold block">📓 Anotar & Congelar Ensaio Ativo</span>
                
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Título da Descoberta (ex: Histerese Máxima T2)"
                    value={newSnapshotName}
                    onChange={(e) => setNewSnapshotName(e.target.value)}
                    className="bg-slate-900 border border-slate-800 px-2 py-1.5 rounded text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500/50"
                  />
                  <textarea
                    placeholder="Anotações científicas, hipóteses, tags e observações observadas do fenômeno..."
                    value={newSnapshotNotes}
                    onChange={(e) => setNewSnapshotNotes(e.target.value)}
                    className="bg-slate-900 border border-slate-800 px-2 py-1.5 rounded text-xs text-white placeholder-slate-500 outline-none h-12 focus:border-sky-500/50 resize-none font-sans"
                  />
                  <button
                    onClick={handleSaveSnapshot}
                    className="py-1.5 bg-sky-700 hover:bg-sky-600 rounded text-slate-100 font-mono text-[9px] font-bold tracking-wide uppercase cursor-pointer transition text-center"
                  >
                    💾 Gravar Run no Caderno (+ Ativar Linha Fantasma)
                  </button>
                </div>

                {/* SAVED SNAPSHOTS */}
                <div className="flex flex-col gap-1 border-t border-slate-850 pt-3">
                  <span className="text-[9px] font-mono text-slate-400 font-semibold mb-1">🗂️ Registro de Ensaios (Projetam Linha Fantasma Comparativa):</span>
                  {savedSnapshots.length === 0 ? (
                    <span className="text-[10px] italic text-zinc-600 font-mono">Nenhum registro anotado localmente neste dispositivo ainda.</span>
                  ) : (
                    <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1.5">
                      {selectedComparisonId && (
                        <button
                          onClick={() => setSelectedComparisonId(null)}
                          className="text-left px-2 py-1 bg-rose-950/20 hover:bg-rose-900/10 text-rose-450 text-[9px] font-mono rounded border border-rose-900/30 flex justify-between items-center transition"
                        >
                          <span>✕ Ocultar Overlay Gráfico Comparativo</span>
                          <span className="text-[9px] opacity-70 font-semibold">Limpar Tela</span>
                        </button>
                      )}
                      {savedSnapshots.map((snap) => {
                        const isComparing = selectedComparisonId === snap.id;
                        return (
                          <div
                            key={snap.id}
                            className={`p-2 rounded border transition text-left flex flex-col gap-1 ${
                              isComparing
                                ? 'bg-sky-950/20 border-sky-500/50'
                                : 'bg-slate-900/50 border-slate-850 hover:border-slate-800'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono font-bold text-slate-200 truncate pr-2 w-[130px]" title={snap.name}>
                                {snap.name}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setSelectedComparisonId(isComparing ? null : snap.id)}
                                  className={`px-1 rounded text-[8px] font-mono font-bold transition ${
                                    isComparing
                                      ? 'bg-sky-600 text-slate-100'
                                      : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
                                  }`}
                                >
                                  {isComparing ? '👁️ ATIVO' : '👁️ VER GHOST'}
                                </button>
                                <button
                                  onClick={() => {
                                    setParams({ ...snap.params });
                                    setStimType(snap.stimType);
                                    setAmp(snap.amp);
                                    setFreq(snap.freq);
                                    logCurrentRun();
                                  }}
                                  title="Recriar parâmetros desta simulação"
                                  className="px-1.5 py-0.5 bg-slate-950 hover:bg-slate-850 hover:text-white border border-slate-800 rounded text-slate-400 text-[8px] font-mono"
                                >
                                  CARREGAR
                                </button>
                                <button
                                  onClick={() => {
                                    const updated = savedSnapshots.filter(s => s.id !== snap.id);
                                    saveSnapshotsToStorage(updated);
                                    if (selectedComparisonId === snap.id) setSelectedComparisonId(null);
                                  }}
                                  className="text-slate-500 hover:text-rose-400 text-[9px] px-0.5 transition"
                                  title="Deletar"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                            <p className="text-[9px] text-zinc-400 italic font-mono truncate">{snap.notes}</p>
                            <div className="flex justify-between text-[8px] font-mono text-zinc-500">
                              <span>\u03A6: {(snap.metrics.phi * 100).toFixed(1)}% • D_max: {snap.metrics.cloneDivergence.toFixed(3)}</span>
                              <span>{snap.timestamp}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* OUTBOARD DISCOVERIES / MARCOS CIENTÍFICOS */}
              <div className="flex flex-col gap-3 p-4 rounded-lg bg-slate-950 border border-slate-850 justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold block">
                    {locale === 'en-US' ? "🔬 Field Discoveries Registry" : "🔬 Registro de Descobertas de Campo"}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono leading-relaxed mb-1.5">
                    {locale === 'en-US' 
                      ? "Deform potential landscape barriers or trigger fast transitions to record historical evidence phenomena:"
                      : "Ajuste os parâmetros físicos das heranças ou simule colisões para registrar fenômenos de evidência histórica:"}
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2 max-h-[170px] overflow-y-auto">
                    {Object.entries(ACHIEVEMENT_REGISTRY).map(([id, ach]) => {
                      const isUnlocked = unlockedAchievements.includes(id);
                      const achInfo = dict.achievements[id] || ach;
                      return (
                        <div
                          key={id}
                          className={`p-1.5 rounded border transition flex items-start gap-1.5 ${
                            isUnlocked
                              ? 'bg-[#121422] border-indigo-500/30 text-slate-100'
                              : 'bg-[#090b0f] border-slate-900 text-slate-600 opacity-55'
                          }`}
                          title={`${achInfo.condition} — ${achInfo.feedback}`}
                        >
                          <span className="text-xs shrink-0">{isUnlocked ? "🔹" : "🔒"}</span>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold leading-tight font-sans text-slate-300">{achInfo.title}</span>
                            <span className="text-[7.5px] font-mono bg-[#080a0e] text-indigo-400 p-0.5 rounded block w-fit border border-slate-850/60 mt-0.5 uppercase tracking-wider">
                              {achInfo.badge}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-[8px] bg-slate-900/50 p-2 rounded border border-slate-850/50 text-slate-400 font-mono text-center">
                  {locale === 'en-US' ? (
                    <>Observed Field Milestones: <strong className="text-white">{unlockedAchievements.length} of {Object.keys(ACHIEVEMENT_REGISTRY).length} discovered</strong></>
                  ) : (
                    <>Marcos de Campo Observados: <strong className="text-white">{unlockedAchievements.length} de {Object.keys(ACHIEVEMENT_REGISTRY).length} identificados</strong></>
                  )}
                </div>

              </div>

            </div>
          </div>

          {/* ORÁCULO DE PRISANTEMOTRIA - CONSOLE DO COPILOTO INTELIGENTE (GERADO VIA GEMINI API) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 shadow-xl relative overflow-hidden" id="oracle-console-card">
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500" />
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono tracking-widest text-violet-400 font-bold uppercase flex items-center gap-1.5">
                  <Sparkles size={11} className="text-violet-400 animate-pulse" /> Oráculo Científico & Epistemólogo Sênior
                </span>
                <h2 className="text-xs font-bold text-slate-100 font-display uppercase tracking-wide mt-0.5">Console de Debate Hermenêutico</h2>
              </div>
              <span className="px-1.5 py-0.5 bg-violet-950 border border-violet-800/40 text-[8px] font-mono font-bold text-violet-400 rounded uppercase">
                Gemini-3.5-Active
              </span>
            </div>

            {/* Chat Box Conversation Log */}
            <div className="bg-slate-950/80 border border-slate-850 rounded-lg p-4 h-[240px] overflow-y-auto flex flex-col gap-3 font-sans text-xs">
              {oracleChat.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col gap-1 rounded-lg p-3 max-w-[85%] ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 border border-slate-800 self-end text-right' 
                      : 'bg-indigo-950/15 border border-indigo-900/40 self-start text-left'
                  }`}
                >
                  <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                    {msg.role === 'user' ? 'Você (Investigador)' : 'Oráculo de Prisantemotria'}
                  </span>
                  <div className="text-slate-200 leading-relaxed font-normal whitespace-pre-line text-xs">
                    {msg.text}
                  </div>
                </div>
              ))}
              {oracleLoading && (
                <div className="flex items-center gap-2 text-[11px] font-mono text-violet-400 p-2 italic self-start">
                  <RefreshCw size={11} className="animate-spin" />
                  <span>O Oráculo está decifrando o estado variacional das equações...</span>
                </div>
              )}
              {oracleError && (
                <div className="text-[10px] bg-rose-950/20 border border-rose-900/30 text-rose-400 rounded p-2 text-center font-mono">
                  ⚠ {oracleError}
                </div>
              )}
            </div>

            {/* Sugestões de Tópicos Experimentais */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[9px] font-mono text-zinc-500 uppercase font-semibold mr-1">Sugestões rápidas:</span>
              <button
                onClick={() => handleOracleQuery("Como atingir o Veredito Máximo (GREENLIGHT)? Quais coeficientes sintonizar?")}
                disabled={oracleLoading}
                className="px-2 py-1 bg-slate-950 hover:bg-slate-850 hover:text-white rounded border border-slate-800 font-mono text-[9px] text-slate-400 transition cursor-pointer"
              >
                Como obter GREENLIGHT?
              </button>
              <button
                onClick={() => handleOracleQuery("Explique a interpretação física de Euler-Lagrange sob acoplamentos β altos.")}
                disabled={oracleLoading}
                className="px-2 py-1 bg-slate-950 hover:bg-slate-850 hover:text-white rounded border border-slate-800 font-mono text-[9px] text-slate-400 transition cursor-pointer"
              >
                Física de Euler-Lagrange
              </button>
              <button
                onClick={() => handleOracleQuery("Explique o significado dinâmico da Histerese em Regimes de Energia Dissipada.")}
                disabled={oracleLoading}
                className="px-2 py-1 bg-slate-950 hover:bg-slate-850 hover:text-white rounded border border-slate-800 font-mono text-[9px] text-slate-400 transition cursor-pointer"
              >
                Entender Histerese
              </button>
            </div>

            {/* Input Form Box */}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Debata com o oráculo (ex: Qual a relação entre a massa m e a compressão do histórico?)..."
                value={oracleInput}
                onChange={(e) => setOracleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleOracleQuery();
                }}
                disabled={oracleLoading}
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-violet-500/50 outline-none rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 font-mono transition"
              />
              <button
                onClick={() => handleOracleQuery()}
                disabled={oracleLoading || !oracleInput.trim()}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-slate-100 hover:text-white rounded-lg text-xs font-mono font-semibold transition hover:scale-[1.01] active:scale-1.0 inline-flex items-center gap-1.5 cursor-pointer font-bold shrink-0 shadow-lg shadow-indigo-900/20"
              >
                {oracleLoading ? <RefreshCw size={11} className="animate-spin" /> : <Sparkles size={11} />}
                FALAR COM ORÁCULO
              </button>
            </div>
            
            <div className="text-[10px] text-zinc-500 font-mono italic flex items-center gap-1">
              <span>*O oráculo consome os coeficientes ativos e resultados das regressões para fornecer uma análise contextual real.</span>
            </div>
          </div>

          {/* DICA DE APOIO À NAVEGAÇÃO COGNITIVA */}
          {!selectedCopilotTopic && (
            <div className="bg-slate-900 border border-slate-800/60 rounded-xl p-3 px-4 flex items-center justify-between text-xs font-mono text-slate-400 gap-3">
              <span className="flex items-center gap-2">
                <Info size={14} className="text-emerald-400 animate-pulse" />
                <span>
                  <strong>Dica de Navegação:</strong> Clique no ícone <HelpCircle size={10} className="inline mx-0.5 text-emerald-400" /> ao lado de qualquer parâmetro ou métrica para ativar as <strong>3 Camadas de Tradução Cognitiva</strong> do Copiloto Epistemológico.
                </span>
              </span>
            </div>
          )}

          {/* COPILOTO EPISTEMOLÓGICO: TRADUTOR DE COMPLEXIDADE (Suporte Legibilidade Cognitiva v1.0) */}
          {selectedCopilotTopic && COPILOT_TOPICS[selectedCopilotTopic] && (() => {
            const topic = COPILOT_TOPICS[selectedCopilotTopic];
            return (
              <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-5 flex flex-col gap-4 shadow-xl relative overflow-hidden transition-all duration-300" id="copilot-card">
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500" />
                {/* Visual glow indicator */}
                <div className="absolute right-0 top-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[65px] pointer-events-none" />
                
                {/* Header with Title, Symbol and Close button */}
                <div className="flex justify-between items-start pb-2 border-b border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold uppercase flex items-center gap-1">
                      <Sparkles size={11} className="animate-spin" style={{ animationDuration: '6s' }} /> Copiloto Epistemológico • Tradução de Complexidade
                    </span>
                    <h3 className="text-sm font-semibold text-slate-100 font-display flex items-center gap-2 mt-1">
                      {topic.title} 
                      <span className="px-1.5 py-0.5 bg-slate-950 border border-slate-850 text-cyan-400 font-mono text-[10px] rounded font-bold">
                        {topic.symbol}
                      </span>
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedCopilotTopic(null)}
                    className="p-1 px-2 bg-slate-955 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white rounded border border-slate-850 font-mono text-[9px] cursor-pointer transition"
                  >
                    ✕ ESCAPAR GUIA
                  </button>
                </div>

                {/* 3-Layer Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left column: Human and Metaphors (Camada 1: Intuição) */}
                  <div className="flex flex-col gap-2 bg-slate-950/70 p-4 rounded border border-slate-850 justify-between">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-emerald-400 font-bold tracking-wider block">
                        Camada 1: Intuição e Metáfora Visual
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans py-2 italic border-b border-slate-900 mt-1">
                        "{topic.analogia}"
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 text-[11px] pt-2">
                      <strong className="text-teal-400 font-bold uppercase text-[9px] font-mono">Analogia Prática:</strong>
                      <span className="text-slate-400 font-mono">{topic.metaphor}</span>
                    </div>
                  </div>

                  {/* Right column: Practice and Controls (Camada 2: Operação) */}
                  <div className="flex flex-col gap-3 justify-between bg-slate-950/70 p-4 rounded border border-slate-850">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] font-mono uppercase text-cyan-400 font-bold tracking-wider block">
                        Camada 2: Operação Prática no Laboratório
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed font-mono font-medium mt-1">
                        {topic.shortTooltip}
                      </p>
                    </div>

                    <div className="border-t border-slate-900 pt-2 flex flex-col gap-1">
                      <div className="text-[10px] text-zinc-400 font-mono">
                        <strong className="text-emerald-400 font-bold">Dica Científica:</strong> {topic.experimento}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Camada 3: Formalismo Científico (LaTeX formulary inside) */}
                <div className="bg-slate-950 border border-slate-850 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setEntenderMelhor(!entenderMelhor)}
                      className="text-xs font-mono font-bold text-slate-400 hover:text-white flex items-center gap-1.5 uppercase transition cursor-pointer"
                    >
                      <Layers size={11} className={`transition-transform duration-200 ${entenderMelhor ? 'text-emerald-400 rotate-90' : 'text-slate-500'}`} />
                      {entenderMelhor ? 'Recolher Camada Formal' : '[ Entender Melhor - Ver Rigor Teórico & Equações ]'}
                    </button>
                    <span className="text-[8px] font-mono uppercase text-zinc-700 tracking-widest font-bold">Camada 3</span>
                  </div>

                  {entenderMelhor && (
                    <div className="mt-3 pt-3 border-t border-slate-900 flex flex-col gap-2.5 text-xs font-mono transition-all duration-300">
                      <div className="flex flex-col gap-1 bg-slate-900/60 p-2.5 rounded border border-slate-850/40">
                        <strong className="text-zinc-500 uppercase text-[9px] tracking-wider font-bold">Equações e Estrutura de Campo:</strong>
                        <span className="text-emerald-400 text-sm font-semibold tracking-wide py-1 text-center font-mono block">
                          {topic.formula}
                        </span>
                      </div>
                      <div className="text-slate-400 leading-relaxed">
                        <strong className="text-slate-300">Interpretação Física Rigorosa:</strong> {topic.interpretacaoFisica}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* CAMADA DE DIAGNÓSTICO VIVO & TRADUÇÃO NARRATIVA (What is happening right now?) */}
          {(() => {
            const liveInfo = getLiveDiagnosis(params, computedMetrics, locale);
            const activeSignsCount = [
              computedMetrics.phi > 0.05,
              computedMetrics.cloneDivergence > 0.05,
              computedMetrics.kStar >= 3,
              computedMetrics.hysteresisArea > 0.1
            ].filter(Boolean).length;
            
            const evidenceLevel = activeSignsCount <= 1 ? "FRACA" : activeSignsCount === 2 ? "MODERADA" : "FORTE";
            const evidenceColor = evidenceLevel === "FRACA" ? "text-rose-450 text-rose-450 border-rose-950 bg-rose-950/20" :
                                  evidenceLevel === "MODERADA" ? "text-amber-400 border-amber-950 bg-amber-950/20" :
                                  "text-emerald-400 border-emerald-950 bg-emerald-950/20";
            
            return (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4 shadow-xl" id="diagnostic-vivo-card">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-2 border-b border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                      <Zap size={11} className="text-emerald-450 animate-pulse" /> Diagnóstico Vivo • O Que Está Acontecendo Agora?
                    </span>
                    <span className="text-xs font-semibold text-slate-100 font-display mt-0.5">Estado Emocional da Simulação</span>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-850 text-slate-300 font-mono font-bold">
                      Estado: <span className="text-emerald-400 font-bold">{liveInfo.state}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${evidenceColor}`}>
                      Evidência: {evidenceLevel}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Left Column: Human narrative translation (Camada 1: Intuição) */}
                  <div className="md:col-span-2 bg-slate-950/40 border border-slate-850/50 rounded p-3 flex flex-col justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-mono uppercase text-zinc-500 font-bold tracking-wider">
                        Tradução Narrativa e Comportamento
                      </span>
                      <p className="text-[11px] text-zinc-300 leading-normal font-sans font-medium">
                        {liveInfo.primaryMessage}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-900 flex flex-col gap-0.5">
                      <span className="text-[8px] font-mono uppercase text-zinc-600 font-bold block">
                        Interpretação Científica:
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {computedMetrics.phi > 0.02
                          ? `O modelo com memória superou o baseline local e reduziu o erro quadrático relativo em ${(computedMetrics.phi * 100).toFixed(1)}%.`
                          : "A inércia local responde sem qualquer atraso de fase relevante. Comportamento predominantemente Markoviano clássico."}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Live Diagnostic Log Lines (Camada 2: Operação) */}
                  <div className="bg-slate-950/80 border border-slate-850/60 rounded p-2.5 flex flex-col gap-1.5 h-full max-h-[140px] overflow-y-auto">
                    <span className="text-[8px] font-mono uppercase text-emerald-400 font-bold tracking-wider pb-1 border-b border-slate-900 block shrink-0">
                      Monitor Geral
                    </span>
                    <div className="flex flex-col gap-1.5 text-[9px] font-mono">
                      {liveInfo.diagnosis.map((line, idx) => (
                        <div key={idx} className="flex gap-1 leading-snug text-slate-400 border-b border-slate-900 p-0.5 pb-1 last:border-0 last:pb-0">
                          <span className="text-emerald-400 shrink-0">•</span>
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Camada de Tradução de Variáveis Visual */}
                <div className="bg-slate-950 border border-slate-850/60 rounded p-2 flex flex-wrap justify-between items-center gap-2">
                  <span className="text-[8px] font-mono uppercase text-zinc-500 font-bold tracking-wider shrink-0">
                    Glossário Rápido de Símbolos:
                  </span>
                  <div className="flex flex-wrap items-center gap-3 text-[9px] font-mono">
                    <span className="flex items-center gap-1 text-indigo-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      ΔF: névoa de memória
                    </span>
                    <span className="flex items-center gap-1 text-cyan-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      Φ: acréscimo preditivo
                    </span>
                    <span className="flex items-center gap-1 text-violet-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                      τ_H: retenção residual
                    </span>
                    <span className="flex items-center gap-1 text-pink-400">
                      <span className="w-1.5 h-1.5 rounded bg-pink-450 bg-pink-500" />
                      β: acoplamento histórico
                    </span>
                    <span className="flex items-center gap-1 text-rose-400">
                      <span className="w-1.5 h-1.5 rounded bg-rose-500" />
                      D_max: rastro divergente
                    </span>
                  </div>
                </div>

              </div>
            );
          })()}
          
          {/* MODO 1: SCIENTIFIC VIEW */}
          {viewMode === 'scientific' && (
            <div className="flex flex-col gap-6" id="scientific-panel-wrapper">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Trajectory plot */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-200 font-display">Trajetória Temporal do Estado S(t)</span>
                      <button 
                        onClick={() => setShowHelpTrajectory(!showHelpTrajectory)}
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-slate-950 hover:bg-slate-800 border border-slate-850 rounded text-violet-400 cursor-pointer transition"
                      >
                        {showHelpTrajectory ? 'Ocultar Guia ✕' : 'Dúvidas? 💡'}
                      </button>
                    </div>
                    <span className="px-1.5 py-0.5 bg-emerald-950 border border-emerald-800/40 text-emerald-400 text-[8px] font-mono uppercase font-bold rounded">
                      Sistema v1.0
                    </span>
                  </div>
                  {showHelpTrajectory && (
                    <div className="bg-[#080d16] border border-violet-900/30 rounded-lg p-3 text-[11px] font-sans text-zinc-300 leading-relaxed flex flex-col gap-2 animate-fade-in">
                      <div>
                        <strong className="text-sky-450 font-semibold block">❓ O que estou lendo aqui?</strong>
                        <p className="text-zinc-400 text-[10.5px] mt-0.5">O percurso do sistema (partícula) oscilando no poço duplo de potencial ao longo das etapas de tempo.</p>
                      </div>
                      <div className="border-t border-slate-850/40 pt-1.5">
                        <strong className="text-amber-400 font-semibold block">🔍 O que isso significa de verdade?</strong>
                        <p className="text-zinc-400 text-[10.5px] mt-0.5">Se o sistema tiver retenção ativa (<strong className="text-violet-400 font-medium">β &gt; 0</strong>), a oscilação se deforma atipicamente. A linha pontilhada (se ativada no Caderno de Experimentos) mostra o percurso do seu ensaio anterior para comparação visual.</p>
                      </div>
                      <div className="border-t border-slate-850/40 pt-1.5">
                        <strong className="text-emerald-450 font-semibold block">⚡ O que tentar agora?</strong>
                        <p className="text-zinc-400 text-[10.5px] mt-0.5">No painel de controle básico à esquerda, aumente o atrito de herança (<strong className="font-mono">η</strong> - eta) para observar dilações temporais.</p>
                      </div>
                    </div>
                  )}
                  <div className="h-[150px] w-full mt-2" id="trajectory-plot-container">
                    {trajectoryPlot}
                  </div>
                </div>

                {/* Coupled memory field plot */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-200 font-display font-mono">Variável Histórica ΔF(t)</span>
                      <button 
                        onClick={() => setShowHelpMemory(!showHelpMemory)}
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-slate-950 hover:bg-slate-800 border border-slate-850 rounded text-violet-400 cursor-pointer transition"
                      >
                        {showHelpMemory ? 'Ocultar Guia ✕' : 'Dúvidas? 💡'}
                      </button>
                    </div>
                    <span className="px-1.5 py-0.5 bg-indigo-950 border border-indigo-800/40 text-indigo-400 text-[8px] font-mono uppercase font-bold rounded">
                      Campo de Memória
                    </span>
                  </div>
                  {showHelpMemory && (
                    <div className="bg-[#080d16] border border-violet-900/30 rounded-lg p-3 text-[11px] font-sans text-zinc-300 leading-relaxed flex flex-col gap-2 animate-fade-in">
                      <div>
                        <strong className="text-sky-450 font-semibold block">❓ O que estou lendo aqui?</strong>
                        <p className="text-zinc-400 text-[10.5px] mt-0.5">O campo de herança acumulada que atua como uma força de tração viscosa retardada contra a partícula.</p>
                      </div>
                      <div className="border-t border-slate-850/40 pt-1.5">
                        <strong className="text-amber-400 font-semibold block">🔍 O que isso significa de verdade?</strong>
                        <p className="text-zinc-400 text-[10.5px] mt-0.5">Representa a força invisível com que o passado acumulado puxa a partícula de volta baseado nas heranças pregressas. Se a curva for plana e travada em zero, o sistema vive apenas no presente puro.</p>
                      </div>
                      <div className="border-t border-slate-850/40 pt-1.5">
                        <strong className="text-emerald-450 font-semibold block">⚡ O que tentar agora?</strong>
                        <p className="text-zinc-400 text-[10.5px] mt-0.5">Escolha os estimuladores "Senoidal Harmônica" no topo da área central para olhar esta curva sinusoidalmente ondular com curvas elegantes.</p>
                      </div>
                    </div>
                  )}
                  <div className="h-[150px] w-full mt-2" id="memory-plot-container">
                    {memoryPlot}
                  </div>
                </div>

                {/* Phase space orbit S vs dS */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-200 font-display font-mono">Espaço de Fase Orbits (S, S')</span>
                      <button 
                        onClick={() => setShowHelpPhase(!showHelpPhase)}
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-slate-950 hover:bg-slate-800 border border-slate-850 rounded text-violet-400 cursor-pointer transition"
                      >
                        {showHelpPhase ? 'Ocultar Guia ✕' : 'Dúvidas? 💡'}
                      </button>
                    </div>
                    <span className="px-1.5 py-0.5 bg-amber-950 border border-amber-800/40 text-amber-400 text-[8px] font-mono uppercase font-bold rounded">
                      Retrato de Fase
                    </span>
                  </div>
                  {showHelpPhase && (
                    <div className="bg-[#080d16] border border-violet-900/30 rounded-lg p-3 text-[11px] font-sans text-zinc-300 leading-relaxed flex flex-col gap-2 animate-fade-in">
                      <div>
                        <strong className="text-sky-450 font-semibold block">❓ O que estou lendo aqui?</strong>
                        <p className="text-zinc-400 text-[10.5px] mt-0.5 font-sans">O gráfico orbital que cruza a posição instantânea da partícula (eixo x) com sua velocidade fásica (eixo y).</p>
                      </div>
                      <div className="border-t border-slate-850/40 pt-1.5">
                        <strong className="text-amber-400 font-semibold block">🔍 O que isso significa de verdade?</strong>
                        <p className="text-zinc-400 text-[10.5px] mt-0.5 font-sans">Sistemas sem memória formam círculos ou laços fechados repetitivos. Quando há herança, as órbitas passam pelo mesmo ponto com velocidades diferentes (não-localidade temporal).</p>
                      </div>
                      <div className="border-t border-slate-850/40 pt-1.5">
                        <strong className="text-emerald-450 font-semibold block">⚡ O que tentar agora?</strong>
                        <p className="text-zinc-400 text-[10.5px] mt-0.5 font-sans">Sincronize Clones no painel esquerdo para testemunhar duas partículas na mesma posição se repelirem devido à diferença de seus passados históricos!</p>
                      </div>
                    </div>
                  )}
                  <div className="h-[150px] w-full mt-2" id="phase-portrait-container">
                    {phasePortrait}
                  </div>
                </div>

                {/* Hysteresis curve */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-200 font-display">Dependência de Trajetória: Histerese</span>
                      <button 
                        onClick={() => setShowHelpHysteresis(!showHelpHysteresis)}
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-slate-950 hover:bg-slate-800 border border-slate-850 rounded text-violet-400 cursor-pointer transition"
                      >
                        {showHelpHysteresis ? 'Ocultar Guia ✕' : 'Dúvidas? 💡'}
                      </button>
                    </div>
                    <span className="px-1.5 py-0.5 bg-rose-950 border border-rose-800/40 text-rose-400 text-[8px] font-mono uppercase font-bold rounded font-mono">
                      Loops dE vs S
                    </span>
                  </div>
                  {showHelpHysteresis && (
                    <div className="bg-[#080d16] border border-violet-900/30 rounded-lg p-3 text-[11px] font-sans text-zinc-300 leading-relaxed flex flex-col gap-2 animate-fade-in">
                      <div>
                        <strong className="text-sky-450 font-semibold block">❓ O que estou lendo aqui?</strong>
                        <p className="text-zinc-400 text-[10.5px] mt-0.5">O ciclo que cruza as flutuações de entrada mecânica do estimulador com as respostas reais da partícula.</p>
                      </div>
                      <div className="border-t border-slate-850/40 pt-1.5">
                        <strong className="text-amber-400 font-semibold block">🔍 O que isso significa de verdade?</strong>
                        <p className="text-zinc-400 text-[10.5px] mt-0.5">A área vazada no meio da curva (ciclo) mede a energia total retida e dissipada de forma irreversível. Sistema sem memória desenham uma linha fina estática (área zero).</p>
                      </div>
                      <div className="border-t border-slate-850/40 pt-1.5">
                        <strong className="text-emerald-450 font-semibold block">⚡ O que tentar agora?</strong>
                        <p className="text-zinc-400 text-[10.5px] mt-0.5">Altere o amortecimento fásico (<strong className="font-mono">τ_H</strong>) no painel esquerdo para alargar instantaneamente a área do ciclo de histerese.</p>
                      </div>
                    </div>
                  )}
                  <div className="h-[150px] w-full mt-2" id="hysteresis-loop-container">
                    {hysteresisLoop}
                  </div>
                </div>

              </div>

              {/* Hamiltonian Energy Balance */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-2">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-200 font-display font-mono flex items-center gap-1.5 font-bold uppercase tracking-wide">
                      <TrendingUp size={14} className="text-emerald-400" /> Monitor Variacional de Energia: Lagrangiano e Hamiltoniano H(t)
                    </span>
                    <button 
                      onClick={() => setShowHelpEnergy(!showHelpEnergy)}
                      className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-slate-950 hover:bg-slate-800 border border-slate-850 rounded text-violet-400 cursor-pointer transition select-none"
                    >
                      {showHelpEnergy ? 'Ocultar Guia ✕' : 'Dúvidas? 💡'}
                    </button>
                  </div>
                  <span className="px-1.5 py-0.5 bg-emerald-950 border border-emerald-800/40 text-emerald-400 text-[8px] font-mono uppercase font-bold rounded">
                    CONSERVAÇÃO DO CAMPO EM REGIME VISCOELÁSTICO
                  </span>
                </div>
                {showHelpEnergy && (
                  <div className="bg-[#080d16] border border-violet-900/30 rounded-lg p-3 text-[11px] font-sans text-zinc-300 leading-relaxed flex flex-col gap-2 animate-fade-in mb-2">
                    <div>
                      <strong className="text-sky-450 font-semibold block">❓ O que estou lendo aqui?</strong>
                      <p className="text-zinc-400 text-[10.5px] mt-0.5">O equilíbrio dinâmico e contínuo de energia dividida entre cinética, poço restaurador e o integrador da mola histórica.</p>
                    </div>
                    <div className="border-t border-slate-850/40 pt-1.5">
                      <strong className="text-amber-400 font-semibold block">🔍 O que isso significa de verdade?</strong>
                      <p className="text-zinc-400 text-[10.5px] mt-0.5">Demonstra de forma irrefutável que a energia dissipada e retida é conservadora ao carregar o campo histórico oculto. O hamiltoniano oscila e se ajusta demonstrando equilíbrio viscoelástico.</p>
                    </div>
                    <div className="border-t border-slate-850/40 pt-1.5">
                      <strong className="text-emerald-450 font-semibold block">⚡ O que tentar agora?</strong>
                      <p className="text-zinc-400 text-[10.5px] mt-0.5">Altere as perturbações de estimulação para "Ruído de Sobrevivência" e observe as oscilações estocásticas agitando as flutuações harmônicas de energia.</p>
                    </div>
                  </div>
                )}
                <div className="h-[150px] w-full mt-2" id="energy-balance-plot-container font-mono">
                  {energyBalancePlot}
                </div>
                <div className="text-[10px] text-zinc-500 italic mt-1 font-mono leading-relaxed">
                  *Comprova rigorosamente que a energia acumulada se redistribui continuamente entre a cinética K_S, o poço V(S), a resiliência interna do integrador de memória U(ΔF) e as forças dissipativas transientes.
                </div>
              </div>

              {/* Potential energies well */}
              {potentialWellVisualizer}

              {/* Sincronização Clone section */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4" id="clone-test-section">
                <div className="flex justify-between items-center border-b border-slate-805 pb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="text-cyan-400" size={17} />
                    <h2 className="text-xs font-bold text-slate-200 font-mono">Teste de Sincronização de Clones Históricos</h2>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">
                    Limite Crítico: <span className="text-rose-400 font-bold">0.05 S-units</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-3.5 rounded border border-slate-850 flex flex-col gap-3 justify-between">
                    <div className="text-[11px] text-slate-400 leading-relaxed">
                      Sincronizamos os clones em <span className="text-emerald-400 font-mono">t=0</span>: <span className="font-mono text-cyan-300">S_A=S_B</span>. 
                      Se divergirem futuramente, a historicidade é provada em termos absolutos!
                    </div>
                    <div className="flex flex-col gap-2 border-t border-slate-850 pt-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1 text-[9px] font-mono">
                          <span>F_priming A</span>
                          <input
                            type="number"
                            value={cloneFreqA}
                            step={0.01}
                            onChange={(e) => setCloneFreqA(parseFloat(e.target.value) || 0)}
                            className="bg-slate-900 border border-slate-800 px-1 py-0.5 rounded text-white"
                          />
                        </div>
                        <div className="flex flex-col gap-1 text-[9px] font-mono">
                          <span>F_priming B</span>
                          <input
                            type="number"
                            value={cloneFreqB}
                            step={0.01}
                            onChange={(e) => setCloneFreqB(parseFloat(e.target.value) || 0)}
                            className="bg-slate-900 border border-slate-800 px-1 py-0.5 rounded text-white"
                          />
                        </div>
                      </div>

                      {cloneResults && (
                        <div className="p-2 bg-slate-900 border border-slate-800 rounded flex items-center gap-1.5 mt-2">
                          {cloneResults.isCausallyDivergent ? (
                            <ShieldAlert size={14} className="text-red-400 shrink-0" />
                          ) : (
                            <AlertCircle size={14} className="text-amber-400 shrink-0" />
                          )}
                          <div className="flex flex-col text-[10px] leading-tight">
                            <span className="font-mono font-bold text-slate-200">D: {cloneResults.finalDivergence.toFixed(4)}</span>
                            <span className={cloneResults.isCausallyDivergent ? 'text-red-400' : 'text-slate-400'}>
                              {cloneResults.isCausallyDivergent ? 'HISTÓRICO PROVADO!' : 'Memória curta redundante.'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2 bg-slate-950/80 border border-slate-850 rounded p-2.5">
                    <div className="text-[9px] text-zinc-500 font-mono mb-2">TRAJETÓRIA S_A(t) vs S_B(t) & DIVERGÊNCIA</div>
                    <div className="h-[150px] w-full">{clonePlot}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODO 2: OPERATIONAL VIEW (Test status, checklists, comparative metrics) */}
          {viewMode === 'operational' && (
            <div className="flex flex-col gap-6" id="operational-panel-wrapper">
              
              {/* Veredito, Semáforo, e Confiança Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row gap-6 items-center shadow-lg">
                <div className="flex flex-col items-center justify-center shrink-0 w-32 h-32 bg-slate-950 rounded-xl border border-slate-800 text-center relative overflow-hidden">
                  <div className={`absolute top-0 w-full h-1.5 ${
                    verdict.status === 'GREENLIGHT' ? 'bg-emerald-500' :
                    verdict.status === 'MARGINAL' ? 'bg-amber-500' :
                    verdict.status === 'REDLIGHT' ? 'bg-rose-500' : 'bg-slate-500'
                  }`} />
                  <span className="text-[9px] uppercase tracking-widest text-slate-500 font-mono font-bold">REDE JUÍZA</span>
                  
                  {verdict.status === 'GREENLIGHT' ? (
                    <ShieldCheck className="text-emerald-500 my-2 animate-bounce" size={40} style={{ animationDuration: '3s' }} />
                  ) : verdict.status === 'MARGINAL' ? (
                    <AlertCircle className="text-amber-500 my-2" size={40} />
                  ) : (
                    <ShieldAlert className="text-rose-500 my-2" size={40} />
                  )}

                  <span className={`text-xs font-bold font-mono ${
                    verdict.status === 'GREENLIGHT' ? 'text-emerald-400' :
                    verdict.status === 'MARGINAL' ? 'text-amber-400' :
                    verdict.status === 'REDLIGHT' ? 'text-rose-400' : 'text-slate-400'
                  }`}>
                    {verdict.status}
                  </span>
                </div>

                <div className="flex-1 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-400">Declaração de Validação Física:</span>
                    <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-slate-300">
                      Grau de Confiança: <strong className="text-cyan-400">{(verdict.confidence * 100).toFixed(0)}%</strong>
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100 font-display">
                    {verdict.summarySentence}
                  </h3>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        verdict.status === 'GREENLIGHT' ? 'bg-emerald-500' :
                        verdict.status === 'MARGINAL' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${verdict.confidence * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-mono">
                    {verdict.humanExplanation.substring(0, 195)}...
                  </p>
                </div>
              </div>

              {/* Checklist de Critérios de Coerência e Indicadores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Checklist Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1 pb-1 border-b border-slate-800">
                    <CheckCircle size={12} className="text-emerald-400" /> Checklist de Critérios Científicos
                  </span>
                  
                  <div className="flex flex-col gap-2.5 text-xs">
                    
                    {/* Item 1 */}
                    <div className="flex items-start gap-2 p-1.5 rounded bg-slate-950/40 border border-slate-850">
                      <input 
                        type="checkbox" 
                        readOnly 
                        checked={computedMetrics.phi > 0.05} 
                        className="mt-0.5 pointer-events-none accent-emerald-500 shrink-0" 
                      />
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-center w-full">
                          <span className="font-semibold text-slate-300">Significância Preditiva (Φ &gt; 5%)</span>
                          <button
                            onClick={() => { setSelectedCopilotTopic('phi'); setEntenderMelhor(false); }}
                            className="text-slate-500 hover:text-cyan-400 transition cursor-pointer"
                            title="Explicação do Copiloto"
                          >
                            <HelpCircle size={10} />
                          </button>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">Actual: {(computedMetrics.phi * 100).toFixed(1)}%</span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-start gap-2 p-1.5 rounded bg-slate-950/40 border border-slate-850">
                      <input 
                        type="checkbox" 
                        readOnly 
                        checked={computedMetrics.cloneDivergence > 0.05} 
                        className="mt-0.5 pointer-events-none accent-emerald-500 shrink-0" 
                      />
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-center w-full">
                          <span className="font-semibold text-slate-300">Divergência Assíncrona de Clones</span>
                          <button
                            onClick={() => { setSelectedCopilotTopic('clone_div'); setEntenderMelhor(false); }}
                            className="text-slate-500 hover:text-rose-400 transition cursor-pointer"
                            title="Explicação do Copiloto"
                          >
                            <HelpCircle size={10} />
                          </button>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">Actual: {computedMetrics.cloneDivergence.toFixed(4)} S-units</span>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-start gap-2 p-1.5 rounded bg-slate-950/40 border border-slate-850">
                      <input 
                        type="checkbox" 
                        readOnly 
                        checked={computedMetrics.kStar >= 3} 
                        className="mt-0.5 pointer-events-none accent-emerald-500 shrink-0" 
                      />
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-center w-full">
                          <span className="font-semibold text-slate-300">Irredutibilidade de Embedding (k* &ge; 3)</span>
                          <button
                            onClick={() => { setSelectedCopilotTopic('k_star'); setEntenderMelhor(false); }}
                            className="text-slate-500 hover:text-amber-400 transition cursor-pointer"
                            title="Explicação do Copiloto"
                          >
                            <HelpCircle size={10} />
                          </button>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">Dimensão Mínima: {computedMetrics.kStar} lags</span>
                      </div>
                    </div>

                    {/* Item 4 */}
                    <div className="flex items-start gap-2 p-1.5 rounded bg-slate-950/40 border border-slate-850">
                      <input 
                        type="checkbox" 
                        readOnly 
                        checked={computedMetrics.hysteresisArea > 0.1} 
                        className="mt-0.5 pointer-events-none accent-emerald-500 shrink-0" 
                      />
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-center w-full">
                          <span className="font-semibold text-slate-300 font-mono font-sans font-semibold text-slate-300">Trabalho dissipativo fásico (Histerese &gt; 0.10)</span>
                          <button
                            onClick={() => { setSelectedCopilotTopic('hysteresis'); setEntenderMelhor(false); }}
                            className="text-slate-500 hover:text-rose-450 transition cursor-pointer"
                            title="Explicação do Copiloto"
                          >
                            <HelpCircle size={10} />
                          </button>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">Área Métrica: {computedMetrics.hysteresisArea.toFixed(4)} u.a.</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Real-time Indicator Gauges */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1 pb-1 border-b border-slate-800">
                    <TrendingUp size={12} className="text-cyan-400" /> Velocímetro de Coerência Operacional
                  </span>
                  
                  <div className="flex flex-col gap-3 mt-1 text-slate-300 text-xs">
                    
                    {/* Gauge 1 */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                        <span className="flex items-center gap-1">
                          Ganhos preditivos (Φ)
                          <button
                            onClick={() => { setSelectedCopilotTopic('phi'); setEntenderMelhor(false); }}
                            className="text-slate-500 hover:text-cyan-400 transition cursor-pointer"
                          >
                            <HelpCircle size={9} />
                          </button>
                        </span>
                        <span className="text-emerald-400 font-bold">{(computedMetrics.phi * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.max(0, computedMetrics.phi * 100)}%` }} />
                      </div>
                    </div>

                    {/* Gauge 2 */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                        <span className="flex items-center gap-1">
                          Divergência de Clones
                          <button
                            onClick={() => { setSelectedCopilotTopic('clone_div'); setEntenderMelhor(false); }}
                            className="text-slate-500 hover:text-rose-400 transition cursor-pointer"
                          >
                            <HelpCircle size={9} />
                          </button>
                        </span>
                        <span className="text-indigo-400 font-bold">{computedMetrics.cloneDivergence.toFixed(3)} S-unit</span>
                      </div>
                      <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, (computedMetrics.cloneDivergence / 0.8) * 100)}%` }} />
                      </div>
                    </div>

                    {/* Gauge 3 */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                        <span className="flex items-center gap-1">
                          Embedding Dimension (k*)
                          <button
                            onClick={() => { setSelectedCopilotTopic('k_star'); setEntenderMelhor(false); }}
                            className="text-slate-500 hover:text-amber-400 transition cursor-pointer"
                          >
                            <HelpCircle size={9} />
                          </button>
                        </span>
                        <span className="text-amber-400 font-bold">k* = {computedMetrics.kStar} lags</span>
                      </div>
                      <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(computedMetrics.kStar / 8) * 100}%` }} />
                      </div>
                    </div>

                    {/* Gauge 4 */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                        <span className="flex items-center gap-1">
                          Robustez a Ruído Estocástico (R_idx)
                          <button
                            onClick={() => { setSelectedCopilotTopic('noise_robustness'); setEntenderMelhor(false); }}
                            className="text-slate-500 hover:text-violet-400 transition cursor-pointer"
                          >
                            <HelpCircle size={9} />
                          </button>
                        </span>
                        <span className="text-violet-400 font-bold">{(computedMetrics.noiseSurvival * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${computedMetrics.noiseSurvival * 100}%` }} />
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Tabela de erros de Regressões Markoviana vs Histórica */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1 pb-1 border-b border-slate-805">
                  <Cpu size={12} className="text-indigo-400 animate-pulse" /> Resíduos Quadráticos de Modelagem Comparada
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded border border-slate-850 flex flex-col justify-between">
                    <div>
                      <h4 className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-bold">Baseline local (Markoviano AR(p))</h4>
                      <div className="text-slate-100 font-mono text-xl font-bold mt-2">
                        {fitResults.metrics.errMarkov.toFixed(5)} 
                        <span className="text-xs text-rose-450 font-normal ml-1">MSE</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-zinc-500 italic mt-3 pt-2 border-t border-slate-900 leading-tight">
                      *Tenta estimar o estado futuro do sistema apenas por lags p imediatos. Ignora variáveis ocultas acumuladas.
                    </div>
                  </div>

                  <div className="bg-slate-955 border border-indigo-900/60 p-4 rounded bg-slate-950 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute right-2 top-2 bg-indigo-900/35 text-indigo-400 border border-indigo-800 px-1.5 py-0.5 rounded font-mono text-[8px] font-bold">
                      {(computedMetrics.phi * 100).toFixed(1)}% MELHOR
                    </div>
                    <div>
                      <h4 className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Histórico (Markoviano AR(p) + \u0394F)</h4>
                      <div className="text-slate-100 font-mono text-xl font-bold mt-2">
                        {fitResults.metrics.errHistoric.toFixed(5)}
                        <span className="text-xs text-emerald-450 font-normal ml-1">MSE</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-zinc-500 italic mt-3 pt-2 border-t border-slate-900 leading-tight">
                      *Mapeia o estado físico local alimentado pelo acoplamento fásico \u03B2 do campo de memórias dinâmicas.
                    </div>
                  </div>
                </div>
              </div>

              {/* Log de rodadas em tempo real */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
                <div className="flex justify-between items-center pb-1 border-b border-slate-805">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1">
                    <HistoryIcon size={12} className="text-zinc-400" /> Registro Histórico de Runs (Últimos 5 Experimentos)
                  </span>
                  <button 
                    onClick={logCurrentRun}
                    className="flex items-center gap-1.5 text-[10px] px-2 py-0.5 bg-slate-950 border border-slate-800 font-mono text-slate-300 hover:text-white rounded"
                  >
                    <RefreshCw size={10} /> Salvar Run Atual
                  </button>
                </div>
                {runLogs.length === 0 ? (
                  <div className="text-center py-6 text-xs text-zinc-500 italic font-mono bg-slate-950 rounded border border-slate-950">
                    Nenhum registro gravado nesta sessão técnica. Clique em "Salvar Run" para arquivar.
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5 max-h-[185px] overflow-y-auto pr-1" id="run-logs-list">
                    {runLogs.map((log) => (
                      <div 
                        key={log.id} 
                        className="flex justify-between items-center bg-slate-950 p-2.5 rounded border border-slate-850 hover:border-slate-800 text-[11px] font-mono"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-indigo-400 font-bold">{log.id}</span>
                          <span className="text-zinc-600">{log.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-zinc-400">
                            \u0394F-Gain: <strong className="text-emerald-400">{(log.phi * 100).toFixed(1)}%</strong>
                          </span>
                          <span className="text-zinc-400">
                            Div: <strong className="text-cyan-400">{log.divergence.toFixed(3)}</strong>
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            log.verdict === 'GREENLIGHT' ? 'bg-emerald-950 text-emerald-400 border border-emerald-990/40' :
                            log.verdict === 'MARGINAL' ? 'bg-amber-950 text-amber-400' : 'bg-rose-950 text-rose-400'
                          }`}>
                            {log.verdict}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* MODO 3: HUMAN VIEW (Semantic Narration, metaphors, friendly summaries) */}
          {viewMode === 'human' && (
            <div className="flex flex-col gap-6" id="human-panel-wrapper">
              
              {/* Veredito Humano / Opinião do Narrador */}
              <div className="bg-slate-900 border border-slate-850 rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden shadow-xl" id="humanizer-narrator-card">
                <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none" />
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Sparkles className="text-violet-400 animate-pulse" size={18} />
                  <h2 className="text-xs uppercase font-mono font-bold tracking-widest text-violet-300">A Voz do Narrador Científico</h2>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="bg-slate-950/80 p-5 rounded-lg border border-slate-850 text-slate-100 font-display text-sm leading-relaxed whitespace-pre-line italic">
                    "{verdict.humanExplanation}"
                  </div>
                </div>
              </div>

              {/* Quadro Comparativo de Metáforas Comuns */}
              <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 flex flex-col gap-4">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1 pb-1 border-b border-slate-800">
                  <BookOpen size={12} className="text-violet-400" /> Metáforas d'A Vida Real do Sistema
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                  
                  {/* Metáfora Phi */}
                  <div className="bg-slate-950 p-4 rounded border border-slate-850 flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-violet-300 font-mono">1. Causalidade Histórica (Φ)</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        hPhi.status === 'OPTIMAL' ? 'bg-emerald-950 text-emerald-300' :
                        hPhi.status === 'MODERATE' ? 'bg-amber-950 text-amber-300' : 'bg-slate-900 text-slate-400'
                      }`}>
                        {hPhi.status}
                      </span>
                    </div>
                    <p className="text-slate-400 leading-relaxed italic">
                      {hPhi.human}
                    </p>
                    <div className="text-[10px] text-zinc-500 font-mono leading-tight bg-slate-900 p-2 rounded border border-slate-850 mt-1">
                      <strong className="text-violet-400 font-bold uppercase text-[9px] block">Analogia:</strong>
                      {hPhi.metaphor}
                    </div>
                    <div className="text-[10px] text-emerald-400/95 font-mono leading-normal bg-emerald-950/20 p-2.5 rounded border border-emerald-900/20 mt-1 flex items-start gap-1">
                      <span className="text-emerald-400 font-bold shrink-0">⚡ Sugestão:</span>
                      <span>{hPhi.nextStep}</span>
                    </div>
                  </div>

                  {/* Metáfora Clones */}
                  <div className="bg-slate-950 p-4 rounded border border-slate-850 flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-violet-300 font-mono">2. O Teste de Sincronização</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        hClone.status === 'OPTIMAL' ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-900 text-slate-400'
                      }`}>
                        {hClone.status}
                      </span>
                    </div>
                    <p className="text-slate-400 leading-relaxed italic">
                      {hClone.human}
                    </p>
                    <div className="text-[10px] text-zinc-500 font-mono leading-tight bg-slate-900 p-2 rounded border border-slate-850 mt-1">
                      <strong className="text-cyan-400 font-bold uppercase text-[9px] block">Analogia:</strong>
                      {hClone.metaphor}
                    </div>
                    <div className="text-[10px] text-emerald-400/95 font-mono leading-normal bg-emerald-950/20 p-2.5 rounded border border-emerald-900/20 mt-1 flex items-start gap-1">
                      <span className="text-emerald-400 font-bold shrink-0">⚡ Sugestão:</span>
                      <span>{hClone.nextStep}</span>
                    </div>
                  </div>

                  {/* Metáfora kStar */}
                  <div className="bg-slate-950 p-4 rounded border border-slate-850 flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-violet-300 font-mono">3. Compressibilidade Temporal (k*)</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        hKStar.status === 'CRITICAL' ? 'bg-rose-950 text-rose-300 animate-pulse' : 'bg-slate-900 text-slate-400'
                      }`}>
                        {hKStar.status === 'CRITICAL' ? 'IRREDUTÍVEL' : hKStar.status}
                      </span>
                    </div>
                    <p className="text-slate-400 leading-relaxed italic">
                      {hKStar.human}
                    </p>
                    <div className="text-[10px] text-zinc-500 font-mono leading-tight bg-slate-900 p-2 rounded border border-slate-850 mt-1">
                      <strong className="text-amber-400 font-bold uppercase text-[9px] block">Analogia:</strong>
                      {hKStar.metaphor}
                    </div>
                    <div className="text-[10px] text-emerald-400/95 font-mono leading-normal bg-emerald-950/20 p-2.5 rounded border border-emerald-900/20 mt-1 flex items-start gap-1">
                      <span className="text-emerald-400 font-bold shrink-0">⚡ Sugestão:</span>
                      <span>{hKStar.nextStep}</span>
                    </div>
                  </div>

                  {/* Metáfora Hysteresis */}
                  <div className="bg-slate-950 p-4 rounded border border-slate-850 flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-violet-300 font-mono">4. Energia Retardada (Histerese)</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        hHysteresis.status === 'OPTIMAL' ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-900 text-slate-400'
                      }`}>
                        {hHysteresis.status}
                      </span>
                    </div>
                    <p className="text-slate-400 leading-relaxed italic">
                      {hHysteresis.human}
                    </p>
                    <div className="text-[10px] text-zinc-500 font-mono leading-tight bg-slate-900 p-2 rounded border border-slate-850 mt-1">
                      <strong className="text-rose-450 font-bold uppercase text-[9px] block">Analogia:</strong>
                      {hHysteresis.metaphor}
                    </div>
                    <div className="text-[10px] text-emerald-400/95 font-mono leading-normal bg-emerald-950/20 p-2.5 rounded border border-emerald-900/20 mt-1 flex items-start gap-1">
                      <span className="text-emerald-400 font-bold shrink-0">⚡ Sugestão:</span>
                      <span>{hHysteresis.nextStep}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Quadro "O que isso significa de verdade?" Q&A */}
              <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 flex flex-col gap-3">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1 pb-1 border-b border-slate-800">
                  <HelpCircle size={12} className="text-violet-400" /> Perguntas Críticas de Entendimento Rápido
                </span>
                
                <div className="flex flex-col gap-3.5 text-xs text-slate-300 mt-1">
                  
                  <div className="flex flex-col gap-1 bg-slate-950 p-2.5 rounded border border-slate-900">
                    <strong className="text-slate-100 flex items-center gap-1.5">
                      <strong className="w-5 h-5 rounded-full bg-violet-950 border border-violet-850 text-violet-400 flex items-center justify-center font-mono text-[10px]">Q</strong>
                      Como provamos matematicamente que o sistema de fato retém memória?
                    </strong>
                    <p className="text-slate-400 pl-6 leading-relaxed">
                      Se o comportamento futuro dependesse unicamente do presente (Sistema Markoviano), o nosso modelo de histórico ΔF traria erro residual idêntico. Um ganho preditivo de Φ &gt; 5% prova de forma definitiva e falsificável que o sistema armazena informação de forma unicamente temporal.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 bg-slate-950 p-2.5 rounded border border-slate-900">
                    <strong className="text-slate-100 flex items-center gap-1.5">
                      <strong className="w-5 h-5 rounded-full bg-violet-950 border border-violet-850 text-violet-400 flex items-center justify-center font-mono text-[10px]">Q</strong>
                      Por que os dois clones idênticos se separam após o tempo zero?
                    </strong>
                    <p className="text-slate-400 pl-6 leading-relaxed">
                      Eles estavam exatamente na mesma posição e velocidade no instante inicial. No entanto, um deles foi estimulado lentamente no passado (ondas lentas), enquanto o outro foi estimulado rapidamente. Como as variáveis históricas ocultas ΔF armazenadas foram preservadas, os futuros divergem!
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 bg-slate-950 p-2.5 rounded border border-slate-900">
                    <strong className="text-slate-100 flex items-center gap-1.5">
                      <strong className="w-5 h-5 rounded-full bg-violet-950 border border-violet-850 text-violet-400 flex items-center justify-center font-mono text-[10px]">Q</strong>
                      O que significa dizer que a memória possui "Complexidade k*"?
                    </strong>
                    <p className="text-slate-400 pl-6 leading-relaxed">
                      Significa a quantidade de dados passados que você seria forçado a coletar continuamente se quisesse ignorar ΔF. Se k* for igual a 7, significa que você precisa coletar as coordenadas dos últimos 7 instantes para começar a adivinhar o comportamento dinâmico.
                    </p>
                  </div>

                </div>
              </div>

              {/* Botão de download do relatório e Sugestões didáticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Download Report Card (Spans 2 columns) */}
                <div className="md:col-span-2 bg-gradient-to-br from-violet-950/60 to-slate-900 border border-violet-800/40 rounded-xl p-5 flex flex-col justify-between gap-4 shadow-lg">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-violet-200 flex items-center gap-1.5 font-display">
                      <Download size={14} className="animate-bounce" /> Relatório Técnico & Decisório Oficial
                    </h3>
                    <p className="text-[11px] text-violet-400/80 leading-relaxed font-mono">
                      Arquive este estado de simulação agora. Nós compilamos automaticamente a configuração fásica, os resíduos AR(2) das regressões, os tempos dos clones, e as interpretações humanas traduzidas em um arquivo compilado Markdown (.md) científico.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadReport}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-slate-100 font-mono text-xs font-semibold hover:scale-[1.01] active:scale-[1.0] transition shadow-lg shadow-violet-900/30 font-bold"
                  >
                    <Download size={14} /> GERAR & COMPILAR RELATÓRIO OFICIAL (.MD)
                  </button>
                </div>

                {/* Sugestões de Ajuste Card */}
                <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 flex flex-col justify-between gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-violet-300 font-bold uppercase block mb-1">Passos Recomendados:</span>
                    <ul className="flex flex-col gap-1.5 text-[11px] text-slate-400 font-mono list-disc pl-3">
                      <li>Tente aumentar o acoplamento beta (&gt;1.5) para expandir Φ.</li>
                      <li>Compare o modelo bistável no tipo de potencial "Double Well".</li>
                      <li>Observe se ao elevar a dissipação gama os clones demoram mais para divergir.</li>
                    </ul>
                  </div>
                  <div className="text-[10px] bg-slate-950 p-2 border border-slate-855 rounded text-zinc-500 font-mono italic">
                    Ajustes de parâmetros atualizam os dados instantaneamente.
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

