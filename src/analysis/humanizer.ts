/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HumanizedMetric {
  name: string;
  value: number;
  technical: string;    // Highly precise scientific explanation
  operational: string;  // Laboratory-level operational meaning
  human: string;        // Simple, metaphorical, and intuitive explanation
  metaphor: string;     // Relatable real-world metaphor
  nextStep: string;     // Contextual suggestion: "What to try now?"
  status: 'OPTIMAL' | 'MODERATE' | 'NEUTRAL' | 'CRITICAL';
}

/**
 * Translates rigorous physical/mathematical parameters into distinct tiers of human comprehension.
 * Supports pt-BR and en-US locales.
 */
export function humanizeMetric(
  metricName: 'phi' | 'clone_div' | 'k_star' | 'hysteresis' | 'noise_robustness',
  value: number,
  locale: 'pt-BR' | 'en-US' = 'pt-BR',
  additionalContext?: any
): HumanizedMetric {
  const isEn = locale === 'en-US';

  switch (metricName) {
    case 'phi': {
      let status: 'OPTIMAL' | 'MODERATE' | 'NEUTRAL' | 'CRITICAL' = 'NEUTRAL';
      let technical = isEn
        ? `Historical Index Φ: ${value.toFixed(4)}. Predictive information gain relative to a local linear optimal AR(p) regression model.`
        : `Índice Φ: ${value.toFixed(4)}. Ganho de informação preditiva relativa ao incluir o regressor ΔF(t) em relação à regressão linear AR(p).`;
      
      let name = isEn ? 'Historical Index (Φ)' : 'Índice de Historicidade (Φ)';
      let operational = '';
      let human = '';
      let metaphor = '';
      let nextStep = '';

      if (value <= 0.02) {
        status = 'NEUTRAL';
        operational = isEn
          ? 'Redundant history. The system behaves efficiently within standard local Markovian baselines.'
          : 'História redundante. O sistema comporta-se eficientemente em bases markovianas locais.';
        human = isEn
          ? 'The past does not make any difference in predicting this system\'s future. It operates purely in the immediate present.'
          : 'O passado não parece fazer diferença para prever o futuro deste sistema agora. Ele vive apenas no imediato.';
        metaphor = isEn
          ? 'Like a fish in a tiny bowl: each circle feels like the very first time, carrying zero historical weight.'
          : 'É como um peixe em um aquário pequeno: cada volta é como se fosse a primeira vez, sem carregar bagagem.';
        nextStep = isEn
          ? 'Try increasing historical coupling β (beta) to 0.8 and retention tauH to 4.0s to reactive the memory channel.'
          : 'Tente aumentar o acoplamento β (beta) para 0.8 e o tempo de retenção τ_H para 4.0s para reativar o canal de memória histórica.';
      } else if (value <= 0.18) {
        status = 'MODERATE';
        operational = isEn
          ? 'Moderately active memory coupling. The delayed field ΔF(t) retains relevant statistical markers.'
          : 'Acoplamento de memória ativa moderada. ΔF(t) retém informação estatística relevante.';
        human = isEn
          ? 'The system exhibits a subtle memory of where it has been, gently warping its next step in Phase space.'
          : 'O sistema demonstra uma lembrança leve de onde esteve, afetando sutilmente seu próximo passo.';
        metaphor = isEn
          ? 'Like riding a bike on wet sand: recent tracks create small valleys that guide tires gently along the way.'
          : 'Como andar de bicicleta em solo macio: o caminho recente cria leves sulcos na terra que guiam sutilmente os pneus.';
        nextStep = isEn
          ? 'Your memory channel is pulsing now. Elevate memory retention delay tauH past 4.5s to consolidate history.'
          : 'Seu canal de memória começou a pulsar. Aumente o tempo de retenção de memória τ_H acima de 4.5s para consolidar essa historicidade.';
      } else {
        status = 'OPTIMAL';
        operational = isEn
          ? 'Dominant state-space historicity. The instantaneous state coordinates fail severely to capture predictive trends.'
          : 'Historicidade dominante comprovada. O estado visível instantâneo falha severamente em explicar o comportamento preditivo.';
        human = isEn
          ? 'The past is fully active and absolutely critical! Trying to project paths based purely on the present fails miserably.'
          : 'O passado do sistema é ativo e crucial! Tentar prever suas ações usando apenas o presente falha absurdamente.';
        metaphor = isEn
          ? 'Like trying to read a long paper knowing only the last word of the sheet: without the plot, nothing makes sense.'
          : 'É como tentar ler um livro sabendo apenas a última palavra da página: sem o enredo anterior, nada faz sentido.';
        nextStep = isEn
          ? 'Historicity proven! Now experiment by enabling thermal noise (advanced section) to test if memory survives chaos.'
          : 'Historicidade provada! Agora experimente ligar o ruído térmico estocástico (seção avançada) para medir se a memória sobrevive à agitação.';
      }

      return {
        name,
        value,
        technical,
        operational,
        human,
        metaphor,
        nextStep,
        status,
      };
    }

    case 'clone_div': {
      let status: 'OPTIMAL' | 'MODERATE' | 'NEUTRAL' | 'CRITICAL' = 'NEUTRAL';
      let technical = isEn
        ? `Maximum divergence: max(D) = ${value.toFixed(4)} state units. Asymptotic deviation post mismatched historical priming.`
        : `Divergência máxima observada: max(D) = ${value.toFixed(4)} unidades de estado. Desvio assintótico pós-sincronização de clones históricos acoplados.`;
      
      let name = isEn ? 'Causal Clone Divergence' : 'Divergência de Clones Causal';
      let operational = '';
      let human = '';
      let metaphor = '';
      let nextStep = '';

      if (value <= 0.05) {
        status = 'NEUTRAL';
        operational = isEn
          ? 'Rapid and symmetric phase convergence. Synchronized clones operate with negligible historical hysteresis.'
          : 'Convergência rápida e simétrica. Clones sincronizados operam sem histerese histórica perceptível.';
        human = isEn
          ? 'The identical clones behaved in the exact same manner, indicating that previous historical variations were forgotten.'
          : 'Os clones idênticos agiram da mesma forma, indicando que diferenças passadas foram esquecidas rapidamente.';
        metaphor = isEn
          ? 'Like two separate balls rolling down the same hill: no matter how they got there, they roll identical paths.'
          : 'Como duas pedras soltas na mesma rampa: não importa como chegaram lá, se soltas juntas, caem do mesmo jeito.';
        nextStep = isEn
          ? 'To destabilize clones and expose temporal non-locality, raise β (beta) to 1.0 and use low dissipation gamma (e.g., 0.15).'
          : 'Para desestabilizar os clones e revelar a não-localidade do tempo, aumente o fator β (beta) para 1.0 e use atrito de dissipação (gamma) mais baixo (ex: 0.15).';
      } else if (value <= 0.25) {
        status = 'MODERATE';
        operational = isEn
          ? 'Persistent divergence. Asymmetric attractor lanes arising from latent historical priming differentials in ΔF.'
          : 'Divergência persistente. Assimetria lenta de atratores devido à diferença de carpa em ΔF.';
        human = isEn
          ? 'They started in the same physical spot, but their separate historical loads gradually pushed them into different lanes.'
          : 'Eles começaram no mesmo lugar físico, mas suas histórias ocultas gradualmente os empurraram para caminhos diferentes.';
        metaphor = isEn
          ? 'Two friends living in the same dynamic neighborhood: they look identical today, but their past memories dictate different decisions.'
          : 'Dois amigos que moram na mesma rua histórica: no presente parecem iguais, mas as vivências de cada um guiam decisões diferentes.';
        nextStep = isEn
          ? 'Divergence initiated! Try shaping the cyclic exciter E(t) into low frequencies (e.g., 0.08 Hz) to witness opposing bais.'
          : 'A divergência já começou! Tente sintonizar o estimulador cíclico E(t) em frequência lenta (ex: 0.08 Hz) para ver os clones em atratores opostos.';
      } else {
        status = 'OPTIMAL';
        operational = isEn
          ? 'Severe causal bifurcation. Absolute collapse of local state predictability under uniform external driving.'
          : 'Divergência causal severa. Queda absoluta de previsibilidade de estado instantâneo sob forças idênticas.';
        human = isEn
          ? 'A monumental difference! Given identical coordinates, clone twins behaved oppositely due to their hidden pasts.'
          : 'Diferença monumental! Mesmo colocados exatamente na mesma posição física inicial, os clones agiram de formas opostas devido a seus passados.';
        metaphor = isEn
          ? 'Identical twins stepping inside the same room: one experiences panic while the other is fully relaxed due to hidden past trauma.'
          : 'Gêmeos idênticos postos no exato mesmo cenário físico: um reage com pânico e o outro com calma por traumas passados distintos.';
        nextStep = isEn
          ? 'Monumental divergence established! Freeze this scientific exploit into your Experimental Notebook at the footer.'
          : 'Divergência monumental estabelecida! Salve essa façanha no Caderno de Experimentos gravando um snapshot no rodapé do sistema.';
      }

      return {
        name,
        value,
        technical,
        operational,
        human,
        metaphor,
        nextStep,
        status,
      };
    }

    case 'k_star': {
      const k = Math.round(value);
      let status: 'OPTIMAL' | 'MODERATE' | 'NEUTRAL' | 'CRITICAL' = 'NEUTRAL';
      let technical = isEn
        ? `Minimal embedding dimension k* = ${k}. Lag order AR required to match the residual error bounds of ΔF.`
        : `Dimensão mínima de embedding k* = ${k}. Ordem ARIMA do baseline linear necessária para equiparar o resíduo do modelo com ΔF.`;
      
      let name = isEn ? 'Embedding Complexity (k*)' : 'Complexidade de Embedding (k*)';
      let operational = '';
      let human = '';
      let metaphor = '';
      let nextStep = '';

      if (k <= 2) {
        status = 'NEUTRAL';
        operational = isEn
          ? 'Highly compressible and short memory. The historical field behaves model-reducible.'
          : 'Memória curta linear e compressível. O sistema histórico se comporta de maneira redutível.';
        human = isEn
          ? 'Just checking the last 1 or 2 past seconds is enough to capture the full feedback. Very simple to summarize.'
          : 'Basta olhar para os últimos 1 ou 2 segundos para entender tudo o que o passado causou. Memória simples de resumir.';
        metaphor = isEn
          ? 'Like looking into a rear-view mirror: you only need the vehicle directly behind you to make a brake decision.'
          : 'Como olhar para o retrovisor de um carro: você só precisa ver o carro imediatamente atrás para decidir se freia.';
        nextStep = isEn
          ? 'The system is highly compressible. Try aggressively raising retention delay tauH to 5.0s and watch embedding k* spike.'
          : 'O sistema é muito compressível e simples. Aumente significativamente a escala de retenção τ_H para 5.0s e veja se a complexidade de embedding k* se eleva.';
      } else if (k <= 7) {
        status = 'MODERATE';
        operational = isEn
          ? 'Medium-scale embedding. The historical system recruits structural visco-elastic lag dependency.'
          : 'Embedding de média escala. O sistema começa a exibir dependência temporal estrutural e viscoelástica.';
        human = isEn
          ? 'Current state predictions require recording 3 to 7 consecutive past seconds to fully capture history.'
          : 'O comportamento presente exige coletar de 3 a 7 atrasos passados consecutivos na tentativa de adivinhar o efeito histórico.';
        metaphor = isEn
          ? 'Like carrying an unstable cup of shaking water: you need past movements of your hand to settle it down.'
          : 'Como pegar um copo d\'água que está chacoalhando e instável: você precisa dos últimos movimentos da sua mão para acalmá-lo.';
        nextStep = isEn
          ? 'Moderate complexity. Try raising kinetic impression index α (alpha) to around 1.3.'
          : 'Grau médio de complexidade. Experimente elevar brusca e rapidamente a gravação de trauma dinâmico α (alpha) próximo a 1.2.';
      } else {
        status = 'CRITICAL';
        operational = isEn
          ? 'Severe dynamical irreducibility. High lag orders indicate non-local robust exponential decay.'
          : 'Irredução dinâmica extrema. Dimensão de embedding elevada aponta para um kernel exponencial robusto ou dispersão temporal.';
        human = isEn
          ? 'Memory has become so deep and complex that modeling it with standard flat linear equations is unfeasible.'
          : 'A memória do sistema se tornou tão profunda e intrincada que mapeá-la de forma linear clássica é inviável!';
        metaphor = isEn
          ? 'Describing the profile of an aged wine by separately analyzing rain droplet velocities for each year of crop.'
          : 'Desejar descrever o sabor de um vinho envelhecido décadas listando separadamente os pingos de chuva de cada ano de cultivo.';
        nextStep = isEn
          ? 'Irreducible linear memory. Navigate to the Neural Reservoir ESN tab to process this dimensional scaling.'
          : 'O sistema tornou-se irreduzível lineamente e exige lags elevados. Experimente visitar a aba dos Reservatórios Neurais (ESN) para processar essa complexidade.';
      }

      return {
        name,
        value,
        technical,
        operational,
        human,
        metaphor,
        nextStep,
        status,
      };
    }

    case 'hysteresis': {
      let status: 'OPTIMAL' | 'MODERATE' | 'NEUTRAL' | 'CRITICAL' = 'NEUTRAL';
      let technical = isEn
        ? `Integrated hysteresis area: ∮ S dE = ${value.toFixed(4)}. Viscoelastic phase lag under excitation cycles.`
        : `Área integrada do loop de histerese: ∮ S dE = ${value.toFixed(4)}. Quantificação do atraso de fase de deformação viscoelástica clássica.`;
      
      let name = isEn ? 'Hysteresis Loop Area' : 'Loop de Histerese';
      let operational = '';
      let human = '';
      let metaphor = '';
      let nextStep = '';

      if (value <= 0.1) {
        status = 'NEUTRAL';
        operational = isEn
          ? 'Immediate direct elastic response. Negligible historical cyclic dissipation.'
          : 'Resposta elástica direta. Perdas dissipativas históricas insignificantes em regime linear.';
        human = isEn
          ? 'The system reacts instantly to forces. Released, it snaps back with direct elastic velocity.'
          : 'O sistema responde quase instantaneamente à força externa. Soltou, ele volta elástico.';
        metaphor = isEn
          ? 'Like pulling a dry cleanly-greased coil: it follows your fingers synchronously without lag or fatigue.'
          : 'Como puxar e soltar uma mola metálica limpa: ela segue sua mão em tempo real sem cansar ou atrasar.';
        nextStep = isEn
          ? 'Set exciter E(t) into Sine mode with intermediate frequencies (e.g. 0.10 Hz) and raise coupling β to 0.9.'
          : 'Sintonize o estimulador cíclico E(t) com uma frequência equilibrada (0.10 a 0.15 Hz) e suba o acoplamento β para 0.9.';
      } else if (value <= 0.6) {
        status = 'MODERATE';
        operational = isEn
          ? 'Detectable viscoelastic delay. Forming distinct paths and open phase loops in phase space.'
          : 'Retardamento viscoelástico detectável. Formação de loops e devesas dinâmicas persistentes.';
        human = isEn
          ? 'There is a slight lag. The system resists the driver force, storing historical momentum and releasing it off phase.'
          : 'Há um leve atraso. O sistema resiste ao estímulo, acumulando força do passado e liberando-a fora de fase.';
        metaphor = isEn
          ? 'Like kneading a piece of memory foam cushion: it lags behind your fingers and stays compressed for some seconds.'
          : 'Como amassar uma bola de espuma viscoelástica (Memory Foam): ela leva um tempo para recuperar sua forma original.';
        nextStep = isEn
          ? 'Clear lag response. Select DOUBLE_WELL potential to force barrier transitions to outline beautiful loops.'
          : 'Há uma resposta de atraso clara. Mude o poço de potencial para DOUBLE_WELL (poço duplo) e observe os saltos rápidos desenharem loops mais robustos.';
      } else {
        status = 'OPTIMAL';
        operational = isEn
          ? 'Severe hysteresis. Massive thermal phase storage or visco-plastic memory inside structural folds.'
          : 'Histerese cíclica severa. Armazenamento substancial de energia ou memória plástica no interior da dobra das fases.';
        human = isEn
          ? 'Giant loops! The system climbs up one lane and rolls back down an entirely different pathway.'
          : 'Loops gigantes! O sistema desenha um caminho para subir e outro completamente diferente para descer.';
        metaphor = isEn
          ? 'An emotional coaster ride: fear accelerates your heartbeat before the fall, and it stays pounding long after finishing.'
          : 'Descer uma montanha russa emocional: o medo acelera o coração antes da descida, e ele continua batendo rápido muito após acabar.';
        nextStep = isEn
          ? 'Hysteresis reached massive peaks! Verify if your 2D phase plot displays wide butterfly shapes.'
          : 'A histerese cíclica alcançou picos massivos! Verifique se a curva do gráfico de fase desenha uma borboleta ou elipse deformada clássica.';
      }

      return {
        name,
        value,
        technical,
        operational,
        human,
        metaphor,
        nextStep,
        status,
      };
    }

    case 'noise_robustness': {
      let status: 'OPTIMAL' | 'MODERATE' | 'NEUTRAL' | 'CRITICAL' = 'NEUTRAL';
      let technical = isEn
        ? `Noise Survival Index (R_idx): ${(value * 100).toFixed(1)}%. Decay factor of Φ under induced Wiener stochastics.`
        : `Índice de Sobrevivência sob Ruído (R_idx): ${(value * 100).toFixed(1)}%. Desvio de decaimento de Φ frente a flutuações estocásticas induzidas.`;
      
      let name = isEn ? 'Noise Survival Index' : 'Sobrevivência sob Ruído';
      let operational = '';
      let human = '';
      let metaphor = '';
      let nextStep = '';

      if (value < 0.4) {
        status = 'CRITICAL';
        operational = isEn
          ? 'Thermally fragile memory. Historical pathways collapse when perturbed by mid-amplitude noise.'
          : 'Memória termicamente frágil. Os caminhos históricos desmoronam frente a perturbações de ruído exógeno de média amplitude.';
        human = isEn
          ? 'Historical memory is highly vulnerable. Any small random breeze wipes out previous carvings.'
          : 'A memória histórica é muito sensível. Qualquer sopro de vento ou ruído perturba o sistema a ponto de fazê-lo esquecer tudo.';
        metaphor = isEn
          ? 'Like writing on loose sand dunes: any moderate wave clears out the entire historical canvas.'
          : 'Como desenhar na areia da praia: o menor ruído de onda apaga completamente a história gravada.';
        nextStep = isEn
          ? 'Fragile state. Increase inertia mass m to 1.5, establishing physical momentum shield against jitter.'
          : 'A memória está muito frágil. Experimente elevar a inércia m do estado para 1.5, o que cria um efeito blindado contra vibrações rápidas.';
      } else if (value < 0.75) {
        status = 'MODERATE';
        operational = isEn
          ? 'Stable robustness. Persistent field structures and memory channels remain dynamically protected.'
          : 'Robustez estável. Estrutura de campo persistente e atratores de hábitos protegidos dinamicamente.';
        human = isEn
          ? 'The system jitter with noise, but it successfully holds onto historical tracks and active attractors.'
          : 'O sistema balança com o ruído, mas ainda consegue reter as cicatrizes históricas e atratores de fundo ativos.';
        metaphor = isEn
          ? 'A muddy forest trail in mild rain: it is slippery, but travelers can still navigate the path easily.'
          : 'Uma trilha de floresta sob chuva fraca: fica enlameada, mas os caminhantes ainda conseguem ver a rota.';
        nextStep = isEn
          ? 'Decent resilience. Raise coupling β (beta) or static exposure η (eta) to strengthen basin attractor depths.'
          : 'Resiliência favorável. Aumente o acoplamento β (beta) ou a deposição estática η (eta) para reforçar as bacias de atração.';
      } else {
        status = 'OPTIMAL';
        operational = isEn
          ? 'Extreme resilience. Memory channels are fully insulated against heavy brownian Wiener fluctuations.'
          : 'Robustez robustificada (Resiliência Clássica). Memória blindada contra perturbações exógenas repetitivas.';
        human = isEn
          ? 'Absolute resilience! Not even severe thermal noise can divert the system from its historical valleys.'
          : 'Resiliência total! Nem mesmo o caos estocástico desvia o sistema de suas rotas e comportamentos moldados no passado.';
        metaphor = isEn
          ? 'A deep canyon carved directly into stubborn granite rock: surface winds trigger chaos, but the ancient stream runs unchanged.'
          : 'Como um profundo desfiladeiro cavado em granito duríssimo: a água bate, chove, faz barulho, mas o leito histórico resiste intacto.';
        nextStep = isEn
          ? 'Memory is shielded! Gradually lower viscous damping (gamma) to observe critical transition speeds.'
          : 'A memória está blindada! Reduza gradativamente o amortecimento viscoso (gamma) ou altere fásicos rápidos para observar perturbações críticas.';
      }

      return {
        name,
        value,
        technical,
        operational,
        human,
        metaphor,
        nextStep,
        status,
      };
    }
  }
}
