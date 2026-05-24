/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const diagnostics = {
  currentSystemState: 'Diagnóstico Evolutivo do Estado',
  analogies: 'Resonância e Metáforas',
  suggestions: 'Caminho Operacional Sugerido',
  narrativeTones: {
    scientific: 'Tom Científico',
    human: 'Tom Intuitivo',
    mentor: 'Tom Mentor',
    oracle: 'Tom Oráculo',
    minimal: 'Tom Minimalista'
  },
  
  metrics: {
    phi: {
      title: 'Índice de Historicidade (Φ)',
      status: {
        NEUTRAL: {
          scientific: 'Índice Φ residual. A inclusão do regressor ΔF(t) acarreta ganho preditivo estatisticamente nulo diante do baseline ótimo AR(p).',
          human: 'O passado não faz diferença para prever o futuro deste sistema agora. Ele vive apenas no imediato puro.',
          mentor: 'Note que com beta muito baixo a herança histórica encolhe. O sistema se comporta como um modelo Markoviano sem memória.',
          oracle: 'O presente basta a si mesmo; nenhuma lembrança passada desvia o curso reto dos instantes atuais.',
          minimal: 'Memória inativa. Φ residual.'
        },
        MODERATE: {
          scientific: 'Gabarito preditivo estável e moderado (Φ ≤ 18%). O campo retardado ΔF(t) retém informação de fase fidedigna.',
          human: 'O sistema demonstra uma lembrança leve de onde esteve, afetando sutilmente seu próximo passo na calha.',
          mentor: 'Ótimo começo; seu canal de memória já está pulsando levemente. Experimente elevar tau_H para acumular de forma mais longa.',
          oracle: 'Rastros tímidos flutuam no campo, sussurrando antigas posições sob o novo Sol.',
          minimal: 'Memória moderada. Φ detectado.'
        },
        OPTIMAL: {
          scientific: 'Historicidade dominante (Φ > 18%). O modelo markoviano local falha severamente em explicar as bacias dinâmicas observadas.',
          human: 'O passado do sistema é ativo e crucial! Tentar prever suas ações usando apenas o presente falha absurdamente.',
          mentor: 'Fantástico! Temos uma historicidade irredutível dominante. O kernel de memória carrega alta relevância científica agora.',
          oracle: 'O passado domina o porvir. O que se viveu outrora desenha os caminhos invisíveis de agora.',
          minimal: 'Domínio histórico absoluto. Φ máximo.'
        }
      }
    },
    clone_div: {
      title: 'Divergência de Clones Causal',
      status: {
        NEUTRAL: {
          scientific: 'Convergência e simetria assintótica absoluta. A diferença de priming histórico se dissipa sob a força de relaxamento comum.',
          human: 'Os clones idênticos agiram da mesma forma, indicando que diferenças passadas foram esquecidas rapidamente.',
          mentor: 'Como os clones convergiram rapidamente, o passado inicial foi suprimido. Tente abaixar a dissipação (gamma) para revelar desvios.',
          oracle: 'Caminhos idênticos se fundem; os gêmeos esquecem suas origens distintas e correm juntos para o mesmo abismo.',
          minimal: 'Clones idênticos convergiram.'
        },
        MODERATE: {
          scientific: 'Divergência local transitória ou assimetria estável de atratores devido à diferença latente de memória histórica.',
          human: 'Eles começaram no mesmo lugar físico, mas suas histórias ocultas gradualmente os empurraram para caminhos diferentes.',
          mentor: 'Temos uma divergência moderada estável sob condução uniforme. Veja nos gráficos que eles já passam por calhas distintas.',
          oracle: 'Os gêmeos se olham nas calhas divisoras, mas as vozes ocultas de seus passados os puxam para cantos opostos.',
          minimal: 'Divergência moderada de clones.'
        },
        OPTIMAL: {
          scientific: 'Cisão causal profunda (D_max severo). Colapso do determinismo de estado instantâneo sob campo externo uniforme.',
          human: 'Diferença monumental! Mesmo colocados exatamente na mesma posição física no presente, os clones agiram de formas opostas devido a seus passados.',
          mentor: 'Fascinante! Divergência causal máxima estabelecida. Isso prova de forma empírica que o tempo é não-local neste sistema.',
          oracle: 'Embora pisem na mesma areia do agora, um carrega o fogo e o outro a cinza de suas eras ocultas; divergem para sempre.',
          minimal: 'Clones em bifurcação causal máxima.'
        }
      }
    },
    k_star: {
      title: 'Complexidade de Embedding (k*)',
      status: {
        NEUTRAL: {
          scientific: 'Baixa dimensionalidade de lag autoregressivo (k* ≤ 2). O integrador físico é redutível de forma trivial no espaço.',
          human: 'Basta olhar para os últimos 1 ou 2 segundos para entender tudo o que o passado causou. Memória simples de resumir.',
          mentor: 'O sistema exibe baixa complexidade de atrasos temporais. Você consegue prever sua trajetória com apenas 2 coeficientes.',
          oracle: 'A semente do presente traz marcas rasas; os últimos instantes revelam todo o seu segredo.',
          minimal: 'Embedding curto. Canal altamente compressível.'
        },
        MODERATE: {
          scientific: 'Dimensão de lag intermediária (3 ≤ k* ≤ 7). A série temporal recruta dependência viscoelástica moderada.',
          human: 'O comportamento presente exige coletar de 3 a 7 atrasos passados consecutivos na tentativa de adivinhar o efeito real.',
          mentor: 'Complexidade moderada. O diário de atrasos precisa de um registro maior para igualar o efeito implícito de ΔF.',
          oracle: 'O livro de registros exige folhear algumas páginas anteriores para destrinchar os silêncios de agora.',
          minimal: 'Complexidade moderada de lags.'
        },
        CRITICAL: {
          scientific: 'Irredução dinâmica severa (k* ≥ 8). A herança residual possui alto kernel exponencial impossível de condensar de forma rasa.',
          human: 'A memória do sistema se tornou tão profunda e intrincada que mapeá-la de forma linear clássica é inviável.',
          mentor: 'Memória irredutível clássica! Os coeficientes lineares AR(p) explodem. Visite a aba Brain de Reservatórios para processá-la.',
          oracle: 'Uma teia infinita de instantes; tentar mapear cada elo é como narrar as gotas de uma chuva ancestral.',
          minimal: 'Memória irredutível. Lag de embedding máximo.'
        }
      }
    },
    hysteresis: {
      title: 'Loop de Histerese',
      status: {
        NEUTRAL: {
          scientific: 'Elasticidade direta perfeita. Trabalho dissipativo líquido nulo sem defasagem de fase operacional sob ciclos.',
          human: 'O sistema responde quase instantaneamente à força externa. Soltou, ele volta elástico.',
          mentor: 'Com histerese mínima, a partícula está alinhada à excitação sem perdas tardias. Suba beta para abrir o loop.',
          oracle: 'Dobra harmônica sem fricção; a mola do agora obedece cegamente ao empurrão da força.',
          minimal: 'Histerese nula. Resposta elástica direta.'
        },
        MODERATE: {
          scientific: 'Atraso viscoelástico detectável com perda e amortecimento fásico persistente sob ciclos de excitação.',
          human: 'Há um leve atraso. O sistema resiste ao estímulo, acumulando força do passado e liberando-a fora de fase.',
          mentor: 'Note que o atraso viscoelástico leve formou uma elipse suave. Há dissipação viscoelástica ativa no potencial.',
          oracle: 'O tempo cobra seu atrito e gera um sussurro de atraso; a partícula hesita a cada investida cíclica.',
          minimal: 'Histerese moderada.'
        },
        OPTIMAL: {
          scientific: 'Área do ciclo exuberante (∮ S dE > 0.45). Alta histerese cíclica e aprisionamento energético de fase.',
          human: 'Loops gigantes! O sistema desenha um caminho para subir e outro completamente diferente para descer.',
          mentor: 'Magnífico ciclo em forma de asa de borboleta ou elipse gigante! Isso deforma de forma considerável a curva de energia.',
          oracle: 'Duas fendas de ida e de retorno desenham asas exuberantes no espaço; o caminho para os cumes nunca é o mesmo de voltar.',
          minimal: 'Histerese exuberante detectada.'
        }
      }
    },
    noise_robustness: {
      title: 'Sobrevivência sob Ruído Estocástico',
      status: {
        CRITICAL: {
          scientific: 'Fragilidade de regime flutuante. As trajetórias de atratores históricos desmoronam sob perturbações térmicas estocásticas.',
          human: 'A memória histórica é muito sensível. Qualquer sopro de vento ou ruído perturba o sistema ao ponto de fazê-lo esquecer tudo.',
          mentor: 'Com robustez fraca sob ruído, o campo é facilmente apagado por Wiener. Considere subir m ou beta para protegê-lo.',
          oracle: 'Inscrito na areia frouxa da praia; o vento rápido do caos sopra e apaga as marcas da herança.',
          minimal: 'Memória frágil. Baixo R_idx sob ruído.'
        },
        MODERATE: {
          scientific: 'Robustez de regime estável. Os atratores e caminhos do campo retardado persistem de forma blindada contra flutuações moderadas.',
          human: 'O sistema balança com o ruído, mas ainda consegue reter as cicatrizes históricas e atratores de fundo ativos.',
          mentor: 'Muito bem, o canal de memória resiste de forma robusta às flutuações rápidas. A barreira detém a agitação.',
          oracle: 'Embora o mar balance sob ventania, a rota ancestral continua visível debaixo do espelho d\'água.',
          minimal: 'Robustez e resiliência estável.'
        },
        OPTIMAL: {
          scientific: 'Resiliência conformal total. Estruturas e hábitos persistem imunes a perturbações brownianas de Wiener de alta amplitude.',
          human: 'Resiliência total! Nem mesmo o caos térmico severo desvia o sistema de suas rotas e comportamentos moldados no passado.',
          mentor: 'Fabuloso: sistema completamente blindado contra ruídos estocásticos. Os atratores de mola acumularam bacias profundas.',
          oracle: 'Um leito profundo cavado sobre a rocha intocável de granito rígido: tempestades sacodem os galhos, mas a corrente ancestral corre imutável.',
          minimal: 'Robustez extrema sob ruído térmico.'
        }
      }
    }
  },

  verdicts: {
    GREENLIGHT: {
      scientific: 'HISTORICIDADE ADMISSÍVEL CONFIRMADA (Regime de Memória Real). Diferenças latentes de priming no integrador viscoelástico forçam o surgimento de bifurcação conformal irredutível.',
      human: 'Sucesso absoluto em provar a existência de memória histórica ativa! Os clones idênticos demonstraram trajetórias opostas devido a passados distintos, e os cálculos estatísticos provaram que a memória não pode ser resumida de maneira fácil.',
      mentor: 'Conclusão memorável! Você provou a hipótese fundamental de não-localidade dinâmica no laboratório. Os clones divergiram e Φ está altíssimo.',
      oracle: 'As ranhuras invisíveis do passado guiam a partícula com mão de ferro; o sistema lembra-se e sua história decide seu fado no poço.',
      minimal: 'Historicidade admissível provada.'
    },
    MARGINAL: {
      scientific: 'HISTORICIDADE PARCIAL (Dependência Causal Linear Fraca). A dependência do histórico físico existe, mas se comporta próxima de regimes de compressibilidade de lags baixos.',
      human: 'O sistema apresenta dependência histórica perceptível, mas ela é fraca. Um modelo clássico de apenas dois segundos atrás consegue cobrir cerca de 90% das trajetórias.',
      mentor: 'Obtivemos uma comprovação preliminar ou de baixa energia. Os vestígios de memória existem, mas são tênues. Tente esticar β ou aumentar o tempo de retenção τ_H.',
      oracle: 'Lembranças fracas que vagam no limiar do esquecimento amplo; a poeira do agora quase desfaz o rastro de onde se andou.',
      minimal: 'Historicidade parcial ativa.'
    },
    REDLIGHT: {
      scientific: 'SISTEMA COMPORTA-SE COMO MARKOVIANO (Sem Efeito de Memória Real). As dinâmicas decaem instantaneamente para o presente local puro, com simetria de clones assintótica.',
      human: 'Alerta! O sistema comporta-se como um pêndulo comum de reação rápida, sem poder de lembrança do passado. O passado é redundante para prever seu futuro.',
      mentor: 'Sinal vermelho. A hipótese de historicidade ativa foi refutada para este conjunto de parâmetros. Verifique se beta está zerado ou se a dissipação foi excessiva.',
      oracle: 'Esquecimento total. O passado dorme sob o gelo do instante, silente e sem poder de moldar ou erguer novos amanhãs.',
      minimal: 'Comportamento puramente Markoviano detectado.'
    },
    INCONCLUSIVE: {
      scientific: 'SINAIS INCONCLUSIVOS (Instabilidade Crítica ou Falha de Excitação). O intervalo amostral é insuficiente para colher assinaturas do campo fásico residual.',
      human: 'Dados insuficientes para tirar conclusões. Os clones não foram alimentados com histórias diferentes ou a simulação parou antes do tempo necessário.',
      mentor: 'Ensaio inconclusivo. Lembre-se de pulsar ou excitar o sistema para carregar o acumulador ΔF e medir as divergências.',
      oracle: 'O labirinto silencia suas respostas; sem vibrações no campo, as cinzas do passado não revelam as trilhas de amanhã.',
      minimal: 'Dados de simulação insuficientes ou estáticos.'
    }
  }
};
