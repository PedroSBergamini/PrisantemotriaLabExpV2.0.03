# PRISANTEMOTRIA v2.2
## Teoria Operacional da Historicidade Dinâmica e Compressibilidade de Memória
### Memorial Científico, Guia de Engenharia e Protocolo de Validação Tri-Camada

---

## 1. Introdução e Mudança de Paradigma

A formulação teórica inicial da **Prisantemotria** (v1.0) tratava a história de sistemas complexos sob uma ontologia excessivamente abstrata: identidade, memória, trauma e hábito eram analisados como deformações em um espaço fenomenológico subjetivo.

O avanço epistemológico central consolidado a partir da **versão v2.0** e refinado na **v2.2** é o abandono da metafísica qualitativa em prol de uma metodologia de teste empírico e rigorosamente falseável. Toda a teoria foi reestruturada para responder a uma pergunta operacional fundamental:

> **Um grau de liberdade histórico explícito produz observáveis dinâmicos discerníveis que não podem ser eficientemente emulados por sistemas markovianos equivalentes de baixa dimensão?**

Com essa transição, o programa deixa de ser uma filosofia conceitual e passa a ser:
* **Uma teoria dinâmica mínima para sistemas com memória causal explícita.**
* Uma ferramenta analítica para identificar quando o passado atua alterando as trajetórias de evolução física futura.
* Um framework de classificação de materiais viscoelásticos e sistemas dissipativos dotados de retroalimentação temporal retardada.

---

## 2. Postulado e Hipóteses de Trabalho

### 2.1 Postulado Fundamental
O estado instantâneo local de um sistema no espaço de fases tradicional, denotado por $(S(t), \dot{S}(t))$, é insuficiente para determinar de forma unívoca a trajetória de evolução futura do sistema sob excitações externas generalizadas. Existe um grau de liberdade histórico autoconsistente e dissipativo, denotado por $\Delta F(t)$, que atua ativamente no acoplamento das forças físicas.

### 2.2 Hipótese Fraca (v1.0)
Existe um grau de liberdade histórico explícito $\Delta F$ dotado de poder causal e preditivo sobre a evolução do estado físico do sistema:

$$P(S_{t+1} \mid S_t, \Delta F_t) \neq P(S_{t+1} \mid S_t)$$

Esta hipótese é validada empiricamente quando o ganho preditivo ($\Phi$) ao incluir $\Delta F$ no conjunto de dados é significativamente maior que zero e clones sob histórias de excitação distintas apresentam futuras respostas divergentes.

### 2.3 Hipótese Forte (v1.2)
Não existe embedding markoviano linear finito de baixa dimensão capaz de reproduzir as flutuações e dinâmicas internas de um sistema dotado de dependência histórica semiterminística. Se tentarmos reconstruir $\Delta F$ via atrasos de tempo lineares (lags):

$$S'_t = (S_t, S_{t-1}, S_{t-2}, \dots, S_{t-k})$$

a dimensão mínima de embedding necessária $k^*(\epsilon)$ para atingir o erro tolerável cresce exponencialmente ou acompanha uma progressão do tipo lei de potência em relação à escala temporal do estímulo externo.

---

## 3. O Núcleo Dinâmico Mínimo (Equações Diferenciais)

A modelagem analítica elementar da Prisantemotria é expressa por um sistema de duas equações diferenciais ordinárias acopladas:

### 3.1 Dinâmica de Evolução do Estado Físico
$$m \ddot{S} + \gamma \dot{S} + V'(S) = E(t) + \beta \Delta F$$

Onde:
* $m$: Inércia mecânica / massa efetiva do estado físico.
* $\gamma$: Coeficiente de amortecimento ou dissipação viscosa para o exterior.
* $V'(S)$: Força restauradora derivada do poço de potencial $V(S)$ estudado (Harmônico ou Poço Duplo).
* $E(t)$: Estímulo/Atuador exógeno que impulsiona a trajetória temporal.
* $\beta$: Intensidade de acoplamento da força termodinâmica residual ou histórica.

### 3.2 Dinâmica de Evolução do Campo Histórico
$$\tau_H \dot{\Delta F} = -\Delta F + \alpha \dot{S} + \eta S$$

Onde:
* $\tau_H$: Tempo característico de relaxação de memória (constante de decaimento/esquecimento).
* $\alpha$: Taxa de impressão plástica decorrente de transições abruptas ou velocidade ($\dot{S}$).
* $\eta$: Taxa de deposição cumulativa gerada pela mera exposição estática prolongada ao estado ($S$).
* $-\Delta F$: Termo de dissipação/relaxamento espontâneo do campo de memórias.

### 3.3 Equivalência com as Equações de Langevin (GLE)
Demonstra-se analiticamente que a solução particular para a evolução de $\Delta F(t)$ expressa uma convolução causal exponencial:

$$\Delta F(t) = \frac{1}{\tau_H} \int_{-\infty}^{t} e^{-\frac{t-s}{\tau_H}} \left( \alpha \dot{S}(s) + \eta S(s) \right) \, ds$$

Substituindo a integral de convolução na dinâmica de $S$, temos:

$$m \ddot{S}(t) + \gamma \dot{S}(t) + V'(S(t)) = E(t) + \frac{\beta}{\tau_H} \int_{-\infty}^t e^{-\frac{t-s}{\tau_H}} \left( \alpha \dot{S}(s) + \eta S(s) \right) \, ds$$

Esta integral revela que o core dinâmico mínimo da Prisantemotria é rigorosamente equivalente a uma **Equação Generalizada de Langevin (GLE)** clássica com kernel exponencial de relaxação, inserindo o laboratório no rol das ciências físicas de materiais viscoelásticos e termodinâmica de não-equilíbrio.

---

## 4. Estrutura Variacional (Lagrangeana e Hamiltoniana)

Para conferir consistência energética à dinâmica acoplada, o sistema é integrado em uma base variacional clássica estendida.

### 4.1 Densidade Lagrangeana do Sistema Completo
$$L = L_{\text{mat}} + L_{\text{hist}} + L_{\text{acopl}}$$

$$L = \frac{1}{2}m\dot{S}^2 - V(S) + \frac{1}{2}m_H \dot{\Delta F}^2 - U(\Delta F) + \beta S \Delta F - \gamma_H \Delta F \dot{\Delta F}$$

Onde:
* $m_H$: Inércia de ativação do campo histórico, definida de modo que $m_H = \tau_H \gamma_H$.
* $U(\Delta F)$: Potencial histórico regulador.
* $-\gamma_H \Delta F \dot{\Delta F}$: Termo dissipativo de esquecimento sob fricção em coordenadas de memória.

### 4.2 Paisagem de Potencial Histórico $U(\Delta F)$
Dependendo da morfologia atribuída ao potencial de armazenamento $U$, modela-se diferentes fenômenos comportamentais:
1. **Hábito Harmônico**: Modelado por uma curva parabólica simples $U(\Delta F) = \frac{1}{2} k_H \Delta F^2$. O sistema tende a decair linearmente ao estado neutro.
2. **Trauma Bistável**: Modelado por uma paisagem bistável tipo Landau-Ginzburg $U(\Delta F) = a\Delta F^4 - b\Delta F^2$. Flutuações elevadas aprisionam a memória em estados latentes persistentes (assinatura matemática do trauma sistêmico).

### 4.3 Formulário Hamiltoniano
Definindo os momentos canônicos $P_S = m\dot{S}$ e $P_H = m_H \dot{\Delta F} - \gamma_H \Delta F$:

$$H = \frac{P_S^2}{2m} + V(S) + \frac{\left(P_H + \gamma_H \Delta F\right)^2}{2m_H} + U(\Delta F) - \beta S \Delta F$$

As equações de Hamilton guiam a evolução no espaço de fase estendido de 4D $(S, P_S, \Delta F, P_H)$:

$$\dot{S} = \frac{P_S}{m}, \quad \dot{P}_S = -V'(S) + \beta \Delta F$$

$$\dot{\Delta F} = \frac{P_H + \gamma_H \Delta F}{m_H}, \quad \dot{P}_H = -U'(\Delta F) - \frac{\gamma_H}{m_H}\left(P_H + \gamma_H \Delta F\right) + \beta S$$

---

## 5. A Nova Arquitetura em Três Camadas (v2.2)

O Laboratório de Validação Científica **Prisantemotria Lab v2.2** organiza-se em três pilares fundamentais, consolidando a ponte entre exploração visual, teste de hipótese falsificável e explicabilidade de dados.

### 5.1 Camada de Exploração (Exploration)
Proporciona visualizações estritas em tempo real e retratos de fase dinâmicos para simulações interativas:
* **LabCore**: Controle manual de equações diferenciais, gráficos do espaço de fase 2D, histerese física e simulação de clones históricos.
* **LabBaselines**: Métodos de minimização estocástica e regressão linear autoregressiva para análise comparativa de lags.
* **LabReservoir**: Rede de Estado de Eco (Echo State Network - ESN) com até 200 nós neurais dinâmicos operando sob espectros variáveis para testes analógicos de memória em séries temporais.
* **LabCompression**: Varreduras de historicidade e dimensão de embedding $k^*$.

### 5.2 Camada de Validação Científica (Validation)
Implementa um mecanismo de **falsificação estocástica estatística**. Cada teste executa múltiplas replicações determinísticas com perturbações micro-estocásticas ($\pm 0.02$) aplicadas às variáveis de estado iniciais para verificar robustez e evitar *overfitting* de dados ideais:

#### 5.2.1 Métricas Científicas Padronizadas
1. **Energia Residual ($E_{\text{res}}$)**: Mede a persistência pós-estímulo no intervalo de pós-excitação $[t_{\text{stim\_off}}, t_{\text{end}}]$:
   
   $$E_{\text{res}} = \int_{t_{\text{stim\_off}}}^{t_{\text{end}}} S(t)^2 \, dt$$

2. **Tempo de Relaxação ($T_{\text{rel}}$)**: O tempo necessário após o desligamento do estímulo para que o estado $S(t)$ entre permanentemente na banda de tolerância de 1% em relação ao máximo histórico:
   
   $$|S(t)| < 0.01 \max(|S|), \quad \forall t \ge t_{\text{stim\_off}} + T_{\text{rel}}$$

3. **Divergência de Clone ($D_{\text{clone}}$)**: Diferença em RMS entre duas trajetórias que foram deparadas com estímulos históricos variados no passado, mas que são sincronizadas e estimuladas com o mesmo sinal futuro em tempo crítico:
   
   $$D_{\text{clone}} = \sqrt{\frac{1}{N_{points}} \sum_{i=1}^{N_{points}} (S_{A}(t_i) - S_{B}(t_i))^2}$$

4. **Estabilidade Espectral ($S_{\text{stab}}$)**: Robusteza dinâmica sob ruído colorido, expressa como o inverso da variância de baixa frequência capturada via bins discretos de DFT:
   
   $$S_{\text{stab}} = \frac{1}{\text{Variance}_{\text{low\_freq}} + 10^{-6}}$$

#### 5.2.2 Suite de Testes Falsificáveis
* **Ghost Residual Persistence (Test 1)**: Contrasta a energia persistente pós-pulso e tempo de relaxação do modelo com o equivalente Markoviano ($\beta = 0$). Falsifica a teoria se o controle dissipar energia mais devagar.
* **Clone Divergence (Test 2)**: Força o alinhamento de estado de dois clones sob histórias de excitação independentes e mede a divergência RMS futura. Falsifica o modelo caso os clones permaneçam agregados e simétricos ($D \approx 0$).
* **Noise Robustness (Test 3)**: Testa o amortecimento de flutuações e estabilidade estrutural sob ruído de baixa frequência.

#### 5.2.3 Varredura Bidimensional de Estabilidade (Sweep 2D)
A suíte executa uma varredura bidimensional resolvendo **220 simulações com RK4** sobre o espaço parametrizado:
* $\beta \in [0.0, 5.0]$ (11 divisões)
* $\tau_H \in [1, 20]$ (20 divisões)

Ele gera mapas térmicos de persistência que podem ser exportados como planilhas **CSV escalares** ou capturas gráficas **PNG de alta definição** via renderização direta de pixel em elemento Canvas HTML5.

### 5.3 Camada de Interpretação e Explicação (Interpretation)
Esta camada de explicabilidade converte métricas não-lineares áridas em um painel interativo estruturado em uma **hierarquia cognitiva de quatro níveis (Tiers)**:

1. **Rigor Técnico/Matemático (Tier 1)**: Definições matemáticas formais do comportamento dinâmico e teoremas aplicáveis.
2. **Significado Operacional de Laboratório (Tier 2)**: O que o dado representa em termos práticos de teste físico, impacto na previsão e sensibilidade de parâmetros.
3. **Explicação Humana Intuitiva (Tier 3)**: Analogias claras e acessíveis para leigos compreenderem o acúmulo de dobras e o atraso causal do sistema.
4. **Metáfora Física Real (Tier 4)**: Comparações tangíveis com o mundo macroscópico, como o comportamento viscoelástico do mel, a memória de forma magnética de ligas, ou a inércia térmica.

A camada conta com um painel interativo onde cientistas podem mover reguladores para verificar desvios de dinâmicas ótimas ou anomalias críticas fásicas.

---

## 6. Baselines de Compressibilidade de Lag e Espaço de Fase Estendido ($k^*$)

O principal desafio metodológico da Prisantemotria é provar que $\Delta F$ não é apenas um artifício conveniente ou filtro de aproximação autorregressivo clássico.

### 6.1 A Dimensão Mínima de Embedding de Markov $k^*(\epsilon)$
No módulo **Margem Crítica de Memória**, define-se a métrica $k^*(\epsilon)$ como a menor ordem de autorregressão linear de atraso de tempo $AR(p)$ em $S$ capaz de imitar os resultados obtidos pelo regressor histórico dentro de uma tolerância residual pré-estabelecida $\epsilon$:

$$\text{Err}_{AR(p^*)} \le \text{Err}_{\Delta F} + \epsilon$$

Se plotarmos $k^*$ versus a escala de memória do sistema $\tau_H$:
* **Caso Compressível**: Se $k^*$ se mantém em valores fixos e baixos (ex. $2 \le k^* \le 3$), significa que $\Delta F$ é apenas um atalho computacional conveniente que pode ser mimetizado com poucos vetores de estado oculto.
* **Caso Crítico e Escalante**: Se defrontarmos com picos dramáticos de explosão de $k^*$ nas imediações do regime ótimo temporário ($\tau_H \approx \tau_S$), comprova-se que o sistema detém **historicidade irredutível e não-local**, ratificando a hipótese forte de forma inapelável.

---

## 7. Deep Learning e Echo State Networks (ESN)

Para consolidar as validações algorítmicas frente às táticas modernas de ML para séries temporais não-lineares, o painel interativo acopla uma **Rede de Estado de Eco (Echo State Network - ESN)**, classe proeminente de *Reservoir Computing*:

### 7.1 Arquitetura Interna da ESN
1. **Reservatório de Recorrência**: Projetado com um volume ajustável de até $N_R = 200$ neurônios que processam excitações mútuas sob uma matriz de adjacência densa e randomizada $W_{\text{res}}$.
2. **Raio Espectral ($\rho$)**: Condiciona a velocidade de amortecimento e reflexão de traços passados na topologia de rede. Para manter a "propriedade de estado de eco" estável, limita-se a $\rho < 1.0$.
3. **Escoamento (Leakage Rate $L$)**: Funciona como um modulador analógico análogo a $\tau_H$, definindo a persistência das trajetórias na hidrodinâmica neural interna.
4. **Mínimos Quadrados Analíticos**: Diferente de RNNs de treino demorado (Backpropagation Through Time), a ESN treina puramente as conexões de saída $W_{\text{out}}$ resolvendo uma regressão linear analítica instantânea de cume.

---

## 8. Arquitetura do Software e Estrutura de Arquivos

O laboratório de validação e modelagem foi refatorado na versão **v2.2** para assegurar modularidade estrita. Os arquivos seguem um modelo disciplinado e totalmente tipado em TypeScript:

```
/src
├── App.tsx                     # Shell principal da interface, abas de navegação de 3 camadas.
├── types.ts                    # Declaração unificada de interfaces e tipos estritos do laboratório.
├── index.css                   # Definição do tema visual Cosmic Slate e utilidades Tailwind.
├── main.tsx                    # Inicialização do React.
│
├── shared/
│   ├── types/                  # Tipagem compartilhada de parâmetros físicos e pontos de simulação.
│   └── seeds/                  # Gerador estocástico determinista e pseudo-aleatoriedade com sementes (LCG).
│
├── simulator/
│   ├── ode.ts                  # Integrador Euler e Runge-Kutta 4 (RK4) para simulações e ensaios físicos de clones.
│   ├── baselines/              # Modelos de baseline (Markovian, Lin-Oscillator, Memoryless Double-Well, Backlash).
│   ├── esn/                    # Reservatório neural Echo State Network (ESN) determinístico.
│   └── models/                 # Interfaces base de modelos integrados.
│
├── validation/
│   ├── metrics/                # Métodos de cálculo de Energia Residual, Relaxação, Divergência RMS e DFT.
│   ├── export/                 # Serialização para planilha CSV RFC-4180 e downloads de ativos de dado.
│   ├── sweeps/                 # Varreduras bidimensionais de parâmetros (beta, tauH).
│   ├── suite/                  # Orquestração stochastically-perturbed de suites científicas.
│   ├── ValidationSuite.ts      # Export principal dos solucionadores de suite de teste.
│   └── tests/                  # Ficheiros de teste falsificáveis individuais (ghost, clone, noise).
│
├── interpretation/
│   ├── humanizer/              # Tradutores cognitivos das métricas físicas estruturados em 4 Tiers.
│   ├── verdicts/               # Avaliações epistemológicas consolidadas adicionais.
│   └── summaries/              # Extração de metadados gerais de execução fásica.
│
└── components/
    ├── exploration/            # Sub-painéis dedicados à geração, interação e plot de modelos físicos.
    │   ├── LabCore.tsx         # Trajetórias estendidas, espaço de fase e testes dinâmicos de clones.
    │   ├── LabBaselines.tsx    # Comparador e minificação estocástica comparando o e-fit e as baselines.
    │   ├── LabReservoir.tsx    # Controle da rede neural recorrente Echo State (ESN).
    │   ├── LabCompression.tsx  # Análise de lags de autoregressão linear e curvas de irredução de embedding.
    │   └── LabDocumentation.tsx# Guia matemático e variacional nativo das equações ordinárias.
    ├── validation/
    │   └── ValidationPanel.tsx # Interface da Suite de Falsificação Estatística e Varredura 2D.
    └── interpretation/
        └── InterpretationPanel.css # Custom hacks visuais (se houver).
        └── InterpretationPanel.tsx # Painel da Camada de Explicabilidade e Hierarquia Cognitiva em 4 níveis.
```

---

## 9. Síntese Epistemológica e Falseabilidade

A tabela abaixo resume os diagnósticos de cientificidade que regem o laboratório sob o paradigma popperiano de falseabilidade:

| Fenômeno Observado | Linha de Modelagem | Diagnóstico Epistemológico |
|---|---|---|
| **Divergência Crítica Nula ($D_{\max} \approx 0$)** | Equivalente markoviano perfeito. | Prisantemotria Redundante. O sistema não necessita de estado histórico. Teoria considerada **Nula/Falsa**. |
| **Divergência $D > 0$ com $k^* \le 2$** | Equação diferencial linear simples. | Útil como empacotador de coordenadas de atraso, mas sem quebras de simetria dimensional histórica. |
| **Divergência Forte $D \ge 0.1$, $\Phi \ge 0.15$ com explosão local de $k^*$** | Historicidade irredutível. | **Validação Científica Absoluta.** O sistema requer explicitamente armazenamento local histórico não-markoviano sob GLE de escala crítica. |

---
**Memorial científico revisado e homologado para os padrões Prisantemotria Lab v2.2.**  
*Relações dinâmicas causalmente ativas, explicáveis e falseáveis em tempo real.*
