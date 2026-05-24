/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CognitiveTranslation } from '../types';

export const tooltips = {
  m: {
    concept: 'Inércia do Estado (m)',
    explanations: {
      simple: 'Mede o peso do sistema: quanto maior, mais devagar ele reage a empurrões e ruídos externos.',
      intuitive: 'Como tentar empurrar um caminhão pesado contra um pequeno carrinho de compras: o caminhão exige força contínua para sequer começar a andar.',
      operational: 'Controla a resistência à aceleração cinemática. Aumentar m suaviza flutuações rápidas e filtra ruídos de alta frequência.',
      formal: 'O termo inercial clássico na dinâmica de Langevin: F_inercial = m · d²S/dt², determinando a estabilidade cinemática e atraso de momentum.',
      metaphorical: 'Um caminhão de carga gigante movendo-se com persistência contra uma lancha super veloz e instável.'
    },
    suggestedAction: 'Diminua para reações imediatas ou aumente para suavizar oscilações e estabilizar o percurso.'
  },
  gamma: {
    concept: 'Dissipação Viscosa (gamma)',
    explanations: {
      simple: 'Amortecimento ou atrito do sistema: controla com que velocidade ele perde velocidade e energia.',
      intuitive: 'É como empurrar um pêndulo no ar contra empurrá-lo mergulhado em um pote de mel espesso: o mel suga toda a energia instantaneamente.',
      operational: 'Regula o amortecimento de velocidade. Valores baixos (gamma < 0.1) geram oscilações livres e ressonância; valores altos (> 1.0) sufocam o movimento.',
      formal: 'Coeficiente de fricção viscosa clássico na dinâmica do poço: F_dissipativa = -gamma · dS/dt, responsável pelas perdas dissipativas lineares.',
      metaphorical: 'Caminhar livremente contra arrastar os pés em uma poça de óleo viscoso.'
    },
    suggestedAction: 'Reduza para menos de 0.15 para liberar movimentos harmônicos exuberantes e de longo alcance.'
  },
  potential: {
    concept: 'Regime de Potencial V(S)',
    explanations: {
      simple: 'O terreno ou mapa de caminhos onde a partícula se move (harmonicamente elástica ou em dois poços concorrentes).',
      intuitive: 'Uma tigela redonda comum (único poço estável) vs. duas tigelas coladas com uma lombada entre elas (poço duplo).',
      operational: 'Altera o gradiente restaurador -dV/dS. O poço duplo (double well) permite bistabilidade, saltos de barreira e histerese não-linear.',
      formal: 'Função de energia potencial V(S) que prescreve o campo de forças restauradoras conservativas. Medido em Joules equivalentes.',
      metaphorical: 'Um vale plano e amigável contra um desfiladeiro com duas cavernas estreitas e profundas.'
    },
    suggestedAction: 'Selecione poço duplo (double_well) para observar fenômenos de decisão instável e saltos de barreira.'
  },
  beta: {
    concept: 'Fator de Força Histórica (beta)',
    explanations: {
      simple: 'O peso que o passado tem sobre o presente: quanto maior beta, mais o rastro acumulado puxa a partícula.',
      intuitive: 'Como dirigir um carro em uma estrada de terra com sulcos profundos: se o vínculo (beta) for alto, você é obrigado a andar sobre as marcas que já fez.',
      operational: 'Fator de acoplamento da variável histórica ΔF sobre o estado real. Governa de forma linear o torque restabelecedor das forças de memória.',
      formal: 'Constante de acoplamento da força de restauração temporal não-local: F_historica = beta · ΔF(t), conectando o passado oculto ao movimento instantâneo.',
      metaphorical: 'Um elástico invisível e tenaz que puxa cada passo novo de volta às marcas dos passos antigos na neblina.'
    },
    suggestedAction: 'Eleve acima de 1.0 para ativar a divergência de clones e ver o gráfico de histerese se abrir visualmente.'
  },
  tauH: {
    concept: 'Tempo de Retenção de Memória (tau_H)',
    explanations: {
      simple: 'A duração da memória: o tempo que o sistema leva para esquecer a maior parte da sua experiência pregressa.',
      intuitive: 'Giz molhado na lousa: se tauH é grande, as palavras ficam visíveis por minutos; se é curto, a água evapora e as palavras somem em segundos.',
      operational: 'Tempo característico de relaxamento térmico-viscoelástico. Define o ritmo do decaimento exponencial do integrador de heranças.',
      formal: 'Constante de decaimento exponencial do kernel de memória histórica: K(t) = e^{-t / tauH}. Rege a meia-vida da influência passada.',
      metaphorical: 'Uma nuvem densa de incenso flutuando em uma sala fechada vs. uma fumaça de vela que se dissipa ao menor sopro.'
    },
    suggestedAction: 'Aumente para mais de 5.0 segundos para mimetizar sistemas com memória profunda e persistente.'
  },
  alpha: {
    concept: 'Gravação por Impacto Dinâmico (alpha)',
    explanations: {
      simple: 'Mede o impacto da ação rápida: o quanto movimentos bruscos e colisões deixam cicatrizes na memória.',
      intuitive: 'Nós esquecemos as viagens de ônibus rotineiras, mas guardamos por anos o susto de um solavanco repentino (transição brusca).',
      operational: 'Fator de acoplamento da velocidade |dS/dt| no integrador gerador de memória. Controla a gravação plástica motivada por choques físicos.',
      formal: 'Coeficiente cinemático de impressão no integrador diferencial de memória: dF/dt = -F/tauH + alpha · |dS/dt| + eta · S.',
      metaphorical: 'Cicatrizes na madeira causadas por pancadas súbitas de martelo.'
    },
    suggestedAction: 'Suba para 1.5 e envie um estimulador tipo Pulso para gravar cicatrizes de colisão imediatas.'
  },
  eta: {
    concept: 'Gravação Estática por Exposição (eta)',
    explanations: {
      simple: 'Mede o cansaço do tempo: o quanto apenas permanecer parado na mesma posição afeta a memória futura.',
      intuitive: 'Mesmo sem pular ou bater, sentar no mesmo sofá de espuma macia todos os dias acaba por deixar uma mella permanente nele.',
      operational: 'Constante estática de polarização de campo. Integra diretamente a posição absoluta do estado ao integrador histórico, mesmo em repouso.',
      formal: 'Coeficiente estático de geração de histerese por exposição posicional: dF/dt_estatico = eta · S(t) integrado de forma contínua.',
      metaphorical: 'Caminhos ancestrais esculpidos na grama unicamente pelo peso de passos mansos e repetitivos por anos.'
    },
    suggestedAction: 'Aumente para 1.5 em regime de poço duplo para ver a mola histórica travar o sistema em uma bacia permanente.'
  },
  vHeight: {
    concept: 'Altura da Barreira V_height',
    explanations: {
      simple: 'A altura do obstáculo que separa as duas bacias no poço duplo: mede o esforço necessário para mudar de lado.',
      intuitive: 'A altura da parede ou colina dividindo duas pequenas vilas: se for baixa, passa-se fácil; se for alta, exige muita energia.',
      operational: 'Fator de escala de barreiras locais de ativação. Regula a energia crítica de transição necessária para saltar de atrator.',
      formal: 'Diferença de potencial estável de transição ΔV = V(0) - V(S_min) no modelo simétrico de bifurcação de Pitchfork.',
      metaphorical: 'Uma lombada amigável de asfalto vs. uma muralha impenetrável de granito de cinco metros de altura.'
    },
    suggestedAction: 'Equilibre a barreira com a amplitude do estimulador para garantir que a partícula consiga saltar de atrator.'
  },
  phi: {
    concept: 'Ganho Informativo Histórico (Phi)',
    explanations: {
      simple: 'Mede o poder do passado: a utilidade de conhecer a história para prever onde o sistema estará a seguir.',
      intuitive: 'Tentar adivinhar o humor de alguém sabendo apenas como ela se sente agora contra conhecer o diário dela dos últimos anos.',
      operational: 'Índice de explicabilidade preditiva em comparação direta com baselines autoregressivos lineares ótimos AR(p).',
      formal: 'Métrica de historicidade irredutível: Phi = 1 - (MSE_Histórico / MSE_Baselines). Phi > 0.05 prova dependência causal histórica.',
      metaphorical: 'A diferença espetacular entre chutar o final de uma conversa sabendo só a última palavra ou ler o livro desde o início.'
    },
    suggestedAction: 'Aumente o tempo de retenção (tauH) e a força do acoplador (beta) para fazer a vantagem preditiva Phi saltar.'
  },
  cloneDivergence: {
    concept: 'Divergência de Clones Causal (D_max)',
    explanations: {
      simple: 'O teste definitivo de história: dois clones idênticos no presente agindo de formas opostas por terem passados diferentes.',
      intuitive: 'Gêmeos idênticos postos no mesmo emprego: um reage com pânico e o outro com calma puramente por traumas passados distintos.',
      operational: 'Desvio máximo assintótico de trajetória física em teste cego pós-priming. Revela a não-localidade dinâmica no espaço.',
      formal: 'Métrica de afastamento assintótico normalizado: D_max = max(|S_A(t) - S_B(t)|) em regime estacionário sob campo externo coerente.',
      metaphorical: 'Duas sementes idênticas que crescem como arbustos opostos sob o mesmo sol por diferenças na água de suas origens ocultas.'
    },
    suggestedAction: 'Sincronize os Clones com frequências de história opostas e observe o surgimento desse desvio irreduzível.'
  },
  kStar: {
    concept: 'Dimensão Mínima de Embedding (k*)',
    explanations: {
      simple: 'Quantos blocos de informação recente você precisa monitorar em sequência para tentar simular o efeito da memória real.',
      intuitive: 'Se você perder a memória, precisará anotar as coordenadas das suas últimas 10 horas seguidas para compensar essa falha.',
      operational: 'Ordem ideal autoregressiva ARIMA necessária para mimetizar o erro quadrático médio residual do preditor histórico de campo.',
      formal: 'Ordem de truncamento k* = arg min_p { MSE_AR(p) <= MSE_Hist + epsilon }. Regula a compressibilidade da série temporal.',
      metaphorical: 'O tamanho do rolo ou diário retroativo que você precisa carregar na mochila para compensar seu esquecimento crônico.'
    },
    suggestedAction: 'Veja como a dimensão k* sobe na aba de Margem de Memória à medida que você alonga o tempo de relaxamento (tauH).'
  },
  hysteresis: {
    concept: 'Ciclo de Histerese',
    explanations: {
      simple: 'A energia retida em ciclos: o atraso geométrico entre o esforço do estimulador e a movimentação da partícula.',
      intuitive: 'Como amassar uma bola de espuma viscoelástica (Memory Foam): ela leva um tempo arrastado para recuperar a forma de antes.',
      operational: 'Integrativo de atraso estéril. Forma órbitas abertas e vazadas em gráficos bidimensionais ao invés de retas estáveis.',
      formal: 'Integral fechada de deslocamento por força de condução externa: W = oint S(t) dE. Expressa o trabalho irreversível dissipado.',
      metaphorical: 'As asas de borboleta desenhadas pelo percurso de ida sendo fisicamente desobediente ao percurso de retorno.'
    },
    suggestedAction: 'Altere o estimulador para forma senoidal na área central e assista à borboleta da histerese se formar em tempo real.'
  },
  noiseRobustness: {
    concept: 'Sobrevivência sob Ruído (R_idx)',
    explanations: {
      simple: 'A blindagem de hábitos: o quanto a história do sistema resiste e sobrevive sob tempestades de caos e ruído.',
      intuitive: 'Como uma rua calçada de blocos de pedra firme comparada com um castelo de areia na praia sob vento forte.',
      operational: 'Rendimento de robustez conformal de atratores históricos sob inclusão ativa de ruído branco de Wiener e flutuações rápidas.',
      formal: 'R_idx = Phi(ruído) / Phi(estacionário). Quantifica o amortecimento da sensibilidade informacional do canal sob desordem.',
      metaphorical: 'As cicatrizes de um desfiladeiro cavado em granito rígido resistindo à erosão de tempestades de poeira e vento constante.'
    },
    suggestedAction: 'Ligue o Ruído Térmico e observe se a conservação de energia e a órbita no gráfico mantêm-se protegidas por alta inércia.'
  }
};
