# PRISANTEMOTRIA v2.2.1-Freeze
## Teoria Operacional da Historicidade Dinâmica e Compressibilidade de Memória
### Memorial Científico, Guia de Engenharia e Protocolo de Validação Tri-Camada

---

## 1. Introdução e Mudança de Paradigma

A formulação teórica original de **Prisantemotria** (v1.0) abordava a história de sistemas complexos por meio de uma ontologia excessivamente abstrata, analisando identidade, memória, trauma e hábito como deformações em um espaço fenomenológico subjetivo.

O avanço epistemológico central consolidado a partir da **versão 2.0** e totalmente refinado na **versão 2.2.1-Freeze** é o abandono da metafísica qualitativa em favor de uma metodologia empírica e rigorosamente falseável. Todo o framework foi reestruturado para abordar uma questão operacional fundamental:

> **Um grau de liberdade histórico explícito produz observáveis dinâmicos discerníveis que não podem ser eficientemente emulados por baselines Markovianas equivalentes de baixa dimensão?**

Com essa transição, o projeto passa de uma filosofia conceitual para um escopo concreto:
* **Teoria dinâmica mínima para sistemas com memória causal explícita.**
* Estrutura analítica para identificar quando o passado molda ativamente as trajetórias de evolução do estado físico futuro.
* Ferramenta de classificação de sistemas dissipativos viscoelásticos projetados com loops de feedback temporal atrasados.

---

## 2. Postulado e Hipóteses de Trabalho

### 2.1 Postulado Fundamental
O estado instantâneo local de um sistema no espaço de fases tradicional, denotado por $(S(t), \dot{S}(t))$, é insuficiente para determinar exclusivamente sua evolução futura sob excitações externas generalizadas. Existe um grau de liberdade histórico autoconsistente e dissipativo, denotado por $\Delta F(t)$, que acopla ativamente forças físicas.

### 2.2 Hipótese Fraca (v1.0)
Existe um grau de liberdade histórico explícito $\Delta F(t)$, possuindo poder causal e preditivo sobre a evolução futura do estado físico $S$:

$$P(S_{t+1} \mid S_t, \Delta F_t) \neq P(S_{t+1} \mid S_t)$$

Esta hipótese é verificada empiricamente quando o índice de ganho preditivo ($\Phi$) obtido pela inclusão de $\Delta F$ é significativamente maior que zero em ensaios de validação, e clones submetidos a históricos de excitação diferentes exibem respostas futuras divergentes sob sinais futuros idênticos.

### 2.3 Hipótese Forte (v1.2)
Não há um equivalente em embedding Markoviano linear finito de baixa dimensão capaz de reproduzir perfeitamente as flutuações e dinâmicas internas de um sistema com dependência histórica semi-determinística. Tentar reconstruir $\Delta F$ via atrasos de tempo lineares (lags):

$$S'_t = (S_t, S_{t-1}, S_{t-2}, \dots, S_{t-k})$$

exige uma dimensão mínima de embedding $k^*(\epsilon)$ que cresce exponencialmente ou como uma lei de potência em relação à escala de tempo característica dos parâmetros de decaimento de memória.

---

## 3. O Núcleo Dinâmico Mínimo (Equações Diferenciais Governantes)

A modelagem analítica elementar de Prisantemotria é expressa como um sistema de duas equações diferenciais ordinárias acopladas:

### 3.1 Equação de Estado (Dinâmica do Sistema Físico)
$$m \ddot{S} + \gamma \dot{S} + V'(S) = E(t) + \beta \Delta F$$

Onde:
* $m$: Inércia do estado físico (massa efetiva).
* $\gamma$: Coeficiente de amortecimento viscoso que representa a dissipação para o ambiente externo.
* $V'(S)$: Força restauradora derivada do poço de potencial estudado $V(S)$ (Harmônico ou Poço Duplo).
* $E(t)$: Impulso externo exógeno.
* $\beta$: Intensidade de acoplamento da força histórica/residual.

### 3.2 Equação de Campo (Campo Dinâmico Histórico)
$$\tau_H \dot{\Delta F} = -\Delta F + \alpha \dot{S} + \eta S$$

Onde:
* $\tau_H$: Escala de tempo característica do relaxamento da memória (taxa de esquecimento).
* $\alpha$: Taxa de impressão plástica induzida por transições abruptas ou velocidade ($\dot{S}$).
* $\eta$: Taxa de impressão cumulativa induzida pela duração da exposição estática ao estado ($S$).
* $-\Delta F$: Taxa de decaimento/esquecimento espontâneo do estado histórico.

### 3.3 Equivalência Estrita com a Equação de Langevin Generalizada (GLE)
É analiticamente demonstrável que a solução particular para $\Delta F(t)$ representa uma convolução causal exponencial:

$$\Delta F(t) = \frac{1}{\tau_H} \int_{-\infty}^{t} e^{-\frac{t-s}{\tau_H}} \left( \alpha \dot{S}(s) + \eta S(s) \right) \, ds$$

Substituindo esta convolução diretamente na equação que governa $S$, obtemos:

$$m \ddot{S}(t) + \gamma \dot{S}(t) + V'(S(t)) = E(t) + \frac{\beta}{\tau_H} \int_{-\infty}^t e^{-\frac{t-s}{\tau_H}} \left( \alpha \dot{S}(s) + \eta S(s) \right) \, ds$$

Esta expansão revela que o núcleo dinâmico mínimo de Prisantemotria é matematicamente isomorfo a uma **Equação de Langevin Generalizada (GLE)** clássica com um kernel de relaxamento exponencial, alinhando a biblioteca com a ciência de materiais viscoelásticos e a termodinâmica de não-equilíbrio.

---

## 4. Fundamentação Variacional e Hamiltoniana

Para estabelecer a consistência energética do sistema acoplado, mapeamos as equações para uma base variacional clássica estendida.

### 4.1 Densidade Lagrangeana Estendida
$$L = L_{\text{mat}} + L_{\text{hist}} + L_{\text{acopl}}$$

$$L = \frac{1}{2}m\dot{S}^2 - V(S) + \frac{1}{2}m_H \dot{\Delta F}^2 - U(\Delta F) + \beta S \Delta F - \gamma_H \Delta F \dot{\Delta F}$$

Onde:
* $m_H$: Inércia de ativação do campo histórico, restringida de modo que $m_H = \tau_H \gamma_H$.
* $U(\Delta F)$ Potential regulador que governa a paisagem de armazenamento da memória.
* $-\gamma_H \Delta F \dot{\Delta F}$: Termo dissipativo de esquecimento tipo atrito em coordenadas históricas.

### 4.2 Paisagens de Energia Potencial $U(\Delta F)$
Ajustar a geometria da energia potencial histórica $U$ modela fases de comportamento distintas:
1. **Hábito Harmônico**: Modelado por uma parábola simples $U(\Delta F) = \frac{1}{2} k_H \Delta F^2$. A memória tende a decair linearmente em direção ao centro neutro.
2. **Trauma Bistável**: Modelado por um poço duplo de Landau-Ginzburg $U(\Delta F) = a\Delta F^4 - b\Delta F^2$. Transientes passados intensos travam a memória dentro de vales persistentes assimétricos (assinatura matemática do trauma sistêmico).

### 4.3 Formulário Hamiltoniano
Definindo os momentos canônicos $P_S = m\dot{S}$ e $P_H = m_H \dot{\Delta F} - \gamma_H \Delta F$:

$$H = \frac{P_S^2}{2m} + V(S) + \frac{\left(P_H + \gamma_H \Delta F\right)^2}{2m_H} + U(\Delta F) - \beta S \Delta F$$

As equações de Hamilton governam a evolução no espaço de fase estendido 4D $(S, P_S, \Delta F, P_H)$:

$$\dot{S} = \frac{P_S}{m}, \quad \dot{P}_S = -V'(S) + \beta \Delta F$$

$$\dot{\Delta F} = \frac{P_H + \gamma_H \Delta F}{m_H}, \quad \dot{P}_H = -U'(\Delta F) - \frac{\gamma_H}{m_H}\left(P_H + \gamma_H \Delta F\right) + \beta S$$

---

## 5. Arquitetura em Três Camadas (v2.2)

O laboratório de validação científica **Prisantemotria Lab v2.2** organiza-se em três pilares fundamentais, consolidando a ponte entre exploração visual, teste de hipótese falseável e explicabilidade de dados.

### 5.1 Camada de Exploração (Exploration)
Proporciona visualizações estritas em tempo real e retratos de fase dinâmicos para simulações interativas:
* **LabCore**: Controle manual de equações diferenciais, gráficos do espaço de fase 2D, histerese física e simulação de clones históricos.
* **LabBaselines**: Métodos de minimização estocástica e regressão linear autoregressiva para análise comparativa de lags.
* **LabReservoir**: Rede de Estado de Eco (Echo State Network - ESN) com até 200 nós neurais dinâmicos operando sob espectros variáveis para testes analógicos de memória em séries temporais.
* **LabCompression**: Varreduras de historicidade e dimensão de embedding $k^*$.

### 5.2 Camada de Validação Científica (Validation)
Implementa um mecanismo de **falsificação estocástica estatística**. Cada teste executa múltiplas replicações determinísticas com perturbações micro-estocásticas ($\pm 0.02$) aplicadas às variáveis de estado iniciais para verificar robustez e evitar *overfitting* de dados ideais:

#### 5.2.1 Métricas Científicas Padronizadas
1. **Energia Residual ($E_{\text{res}}$)**: Mede a persistência pós-estímulo no intervalo pós-excitação $[t_{\text{stim\_off}}, t_{\text{end}}]$:
   
   $$E_{\text{res}} = \int_{t_{\text{stim\_off}}}^{t_{\text{end}}} S(t)^2 \, dt$$

2. **Tempo de Relaxação ($T_{\text{rel}}$)**: O tempo necessário após o desligamento do estímulo para que o estado $S(t)$ entre permanentemente na banda de tolerância de 1% em relação ao máximo histórico:
   
   $$|S(t)| < 0.01 \max(|S|), \quad \forall t \ge t_{\text{stim\_off}} + T_{\text{rel}}$$

3. **Divergência de Clone ($D_{\text{clone}}$)**: Diferença em RMS entre duas trajetórias que sofreram estímulos históricos variados no passado, mas que são sincronizadas e estimuladas com o mesmo sinal futuro em tempo crítico:
   
   $$D_{\text{clone}} = \sqrt{\frac{1}{N_{points}} \sum_{i=1}^{N_{points}} (S_{A}(t_i) - S_{B}(t_i))^2}$$

4. **Estabilidade Espectral ($S_{\text{stab}}$)**: Robustez dinâmica sob ruído colorido, expressa como o inverso da variância de baixa frequência capturada via bins discretos de DFT:
   
   $$S_{\text{stab}} = \frac{1}{\text{Variance}_{\text{low\_freq}} + 10^{-6}}$$

#### 5.2.2 Suíte de Testes Falseáveis
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

---

## 6. Estrutura do Software e Diretório de Arquivos

```
/src
├── App.tsx                     # Shell da interface, abas de navegação de 3 camadas.
├── types.ts                    # Declaração unificada de tipos estritos do laboratório.
├── index.css                   # Definição do tema visual Cosmic Slate e utilidades Tailwind.
├── main.tsx                    # Inicialização do React.
│
├── shared/
│   ├── types/                  # Tipagem compartilhada de parâmetros físicos e simulação.
│   └── seeds/                  # Gerador estocástico determinista e sementes (LCG).
│
├── simulator/
│   ├── ode.ts                  # Integrador Euler e Runge-Kutta 4 (RK4) para simulações de clones.
│   ├── baselines/              # Modelos de baseline (Markovian, Lin-Oscillator, Memoryless, Backlash).
│   ├── esn/                    # Reservatório neural Echo State Network (ESN).
│   └── models/                 # Interfaces base de modelos integrados.
│
├── validation/
│   ├── metrics/                # Métodos de cálculo de Energia Residual, Relaxação, Divergência RMS e DFT.
│   ├── export/                 # Serialização para planilha CSV RFC-4180 e downloads de dados.
│   ├── sweeps/                 # Varreduras bidimensionais de parâmetros (beta, tauH).
│   ├── suite/                  # Orquestração estocástica de suítes de teste científicas.
│   ├── ValidationSuite.ts      # Export principal da suíte de testes.
│   └── tests/                  # Arquivos de testes falseáveis de ghost, clone e noise robustness.
```

---

## 7. Matriz de Falseabilidade

| Fenômeno Observado | Linha de Modelagem | Diagnóstico Epistemológico |
|---|---|---|
| **Divergência Crítica Nula ($D_{\max} \approx 0$)** | Equivalente markoviano perfeito. | Prisantemotria Redundante. O sistema não necessita de estado histórico. Teoria considerada **Nula/Falsa**. |
| **Divergência $D > 0$ com $k^* \le 2$** | Equação diferencial linear simples. | Útil como empacotador de coordenadas de atraso, mas sem quebras de simetria dimensional histórica. |
| **Divergência Forte $D \ge 0.1$, $\Phi \ge 0.15$ com explosão local de $k^*$** | Historicidade irredutível. | **Validação Científica Absoluta.** O sistema requer explicitamente armazenamento local histórico sob GLE de escala crítica. |

---

## 8. Separação Epistemológica & Congelamento Científico (Patch v2.2.1-Freeze)

Para proteger a integridade das afirmações científicas produzidas sob este framework, o **Patch v2.2.1-Freeze** impõe uma divisão estrita entre a *mecânica de validação* (formal, restrita e determinística) e os *estados exploratórios* (experimentais, ilustrativos e lúdicos).

### 8.1 Diretrizes para Aplicação Científica
*   **Isolamento da Camada de Validação**: Os módulos de validação (`validation/`) estão terminantemente proibidos de importar qualquer elemento das pastas de exploração (`exploration/`). Validação permanece estritamente autocontida.
*   **Dinâmica Diferencial Congelada**: Nenhuma alteração silenciosa de parâmetros (clamp silencioso) ou suavizações artificiais são permitidas nas rotinas de simulação de validação.
*   **Critério de Aprovação 1σ Preliminar**: As avaliações de status empregam limites de incerteza estatística conservadores ($1\sigma$), retornando a etiqueta formal `PRELIMINARY_PASS` ou `FAIL` em vez de sugerir aprovações irrefutáveis.
*   **Metadados de Exportação Expandidos**: Todas as exportações em formato CSV e JSON integram automaticamente o registro completo do preset ativo, advertências contra interpretações de certezas místicas e o cabeçalho protocolar correspondente.

---
**README compilado e homologado para os padrões Prisantemotria Lab v2.2.1-Freeze.**  
*Relações dinâmicas causalmente ativas, explicáveis e falseáveis em tempo real.*
