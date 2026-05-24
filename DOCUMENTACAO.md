# PRISANTEMOTRIA v2.0
## Teoria Operacional da Historicidade Dinâmica e Compressibilidade de Memória
### Memorial Científico e Guia de Engenharia do Laboratório Experimental

---

## 1. Introdução e Mudança de Paradigma

A formulação teórica inicial da **Prisantemotria** (v1.0) tratava a história de sistemas complexos sob uma ontologia excessivamente ampla e abstrata: identidade, memória, trauma, hábito e tradição eram analisados como deformações intrínsecas a um espaço fenomenológico subjetivo. 

O avanço epistemológico central introduzido na **versão v2.0** foi o abandono deliberado da metafísica inicial em prol de uma metodologia de teste empírico e rigorosamente falseável. Toda a teoria foi reestruturada sobre uma pergunta operacional fundamental:

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

A modelagem analítica elementar da Prisantemotria v2.0 é expressa por um sistema de duas equações diferenciais ordinárias acopladas:

### 3.1 Dinâmica de Evolução do Estado Físico
$$m \ddot{S} + \gamma \dot{S} + V'(S) = E(t) + \beta \Delta F$$

Onde:
* $m$: Inércia mecânica / massa efetiva do estado físico.
* $\gamma$: Coeficiente de amortecimento ou dissipação viscosa para o exterior.
* $V'(S)$: Força restauradora derivada do poço de potencial $V(S)$ estudado (Harmônico, Poço Duplo ou Assimétrico).
* $E(t)$: Estímulo/Atuador exógeno que impulsiona a trajetória temporal.
* $\beta$: Intensidade de acoplamento da força termodinâmica residual ou histórica.

### 3.2 Dinâmica de Evolução do Campo Histórico
$$\tau_H \dot{\Delta F} = -\Delta F + \alpha \dot{S} + \eta S$$

Onde:
* $\tau_H$: Tempo característico de relaxação de memória (constante de decaimento/esquecimento).
* $\alpha$: Taxa de impressão plástica decorrente de transições abruptas ou velocidade ($\dot{S}$).
* $\eta$: Taxa de deposição cumulativa gerada pela mera exposição estática prolongada ao estado ($\mathbf{S}$).
* $-\Delta F$: Termo de dissipação/relaxamento espontâneo do campo de memórias.

### 3.3 Equivalência com as Equações de Langevin (GLE)
Demonstra-se analiticamente que a solução particular para a evolução de $\Delta F(t)$ expressa uma convolução causal exponencial:

$$\Delta F(t) = \frac{1}{\tau_H} \int_{-\infty}^{t} e^{-\frac{t-s}{\tau_H}} \left( \alpha \dot{S}(s) + \eta S(s) \right) \, ds$$

Substituindo a integral de convolução na dinâmica de $S$, temos:

$$m \ddot{S}(t) + \gamma \dot{S}(t) + V'(S(t)) = E(t) + \frac{\beta}{\tau_H} \int_{-\infty}^t e^{-\frac{t-s}{\tau_H}} \left( \alpha \dot{S}(s) + \eta S(s) \right) \, ds$$

Esta integral de memória revela que o core dinâmico mínimo da Prisantemotria é rigorosamente equivalente a uma **Equação Generalizada de Langevin (GLE)** clássica com kernel exponencial de relaxação de um modo térmico, inserindo a Prisantemotria no rol das ciências físicas de materiais viscoelásticos e termodinâmica de não-equilíbrio.

---

## 4. Estrutura Variacional (Lagrangeana e Hamiltoniana)

Para conferir consistência energética à dinâmica acoplada, o sistema é integrado em uma base variacional clássica estendida.

### 4.1 Densidade Lagrangeana do Sistema Completo
$$L = L_{\text{mat}} + L_{\text{hist}} + L_{\text{acopl}}$$

$$L = \frac{1}{2}m\dot{S}^2 - V(S) + \frac{1}{2}m_H \dot{\Delta F}^2 - U(\Delta F) + \beta S \Delta F - \gamma_H \Delta F \dot{\Delta F}$$

Onde:
* $m_H$: Inércia de ativação do campo histórico, definida de modo que $m_H = \tau_H \gamma_H$.
* $U(\Delta F)$: Potencial histórico regulador (determina a facilidade estrutural de sedimentação de cargas e desvios).
* $-\gamma_H \Delta F \dot{\Delta F}$: Termo dissipativo de esquecimento sob fricção em coordenadas de memória.

### 4.2 Paisagem de Potencial Histórico $U(\Delta F)$
Dependendo da morfologia atribuída ao potencial de armazenamento $U$, modela-se diferentes fenômenos comportamentais:
1. **Hábito Convencional**: Modelado por uma curva harmônica $U(\Delta F) = \frac{1}{2} k_H \Delta F^2$. O sistema tende a retornar ao estado neutro de deformação sob decaimento linear regular.
2. **Trauma Bistável**: Modelado por um potencial de bi-estabilidade do tipo Landau-Ginzburg $U(\Delta F) = a\Delta F^4 - b\Delta F^2$. Nesta morfologia, flutuações transitórias elevadas podem prender a memória em vales de potencial secundários permanentes (assinatura matemática de aprisionamento cognitivo/trauma).

### 4.3 Formulário Hamiltoniano
Definindo os momentos canonicamente conjugados $P_S = \frac{\partial L}{\partial \dot{S}} = m\dot{S}$ e $P_H = \frac{\partial L}{\partial \dot{\Delta F}} = m_H \dot{\Delta F} - \gamma_H \Delta F$:

$$H = \frac{P_S^2}{2m} + V(S) + \frac{\left(P_H + \gamma_H \Delta F\right)^2}{2m_H} + U(\Delta F) - \beta S \Delta F$$

As equações canônicas de Hamilton guiam a evolução do sistema no espaço de fase estendido de 4 dimensões $(S, P_S, \Delta F, P_H)$:

$$\dot{S} = \frac{P_S}{m}, \quad \dot{P}_S = -V'(S) + \beta \Delta F$$

$$\dot{\Delta F} = \frac{P_H + \gamma_H \Delta F}{m_H}, \quad \dot{P}_H = -U'(\Delta F) - \frac{\gamma_H}{m_H}\left(P_H + \gamma_H \Delta F\right) + \beta S$$

---

## 5. Programa Experimental e Observáveis

Cada tab e recurso do painel interativo **Prisantemotria Lab v2.0** foi projetado para atuar como colisor experimental, colhendo assinaturas dinâmicas fidedignas:

### 5.1 O Teste de Sincronização de Clones Históricos (Divergência Causal)
O experimento de maior rigor científico da teoria nula consiste em isolar $\Delta F$. 
1. Dois clones idênticos (Sistemas A e B) são excitados com históricos passados totalmente distintos para carregar seus respectivos setores de memória de forma assimétrica ($\Delta F_A(0) \neq \Delta F_B(0)$).
2. No tempo crítico de sincronização $t = 0$, forçamos o alinhamento unívoco de seus estados mecânicos instantâneos locais:
   
$$(S_A(0), \dot{S}_A(0)) = (S_B(0), \dot{S}_B(0))$$

3. Mantendo seus campos históricos assíncronos e intocados, aplicamos exatamente o mesmo sinal de condução exógena futuro.
4. Medimos a métrica de divergência de clone $D(t)$:
   
$$D(t) = \left\| S_A(t) - S_B(t) \right\|$$

Se $D(t) > 0.05$ sob as mesmas forças, o caráter não-markoviano é comprovado. O presente instantâneo local não fecha a dinâmica causal do futuro do sistema.

### 5.2 O Índice Científico de Historicidade ($\Phi$)
Mede quantitativamente a utilidade do campo retardado na previsão de passos futuros. Treina-se analiticamente dois aproximadores por regressão linear de cume (Ridge Regression) para $S_{t+1}$:
1. **Regressor Markoviano Basal**: Usa puramente o vetor instantâneo em $S$ com lags específicos.
2. **Regressor Histórico**: Incorpora explicitamente $\Delta F(t)$ como variável preditiva e regressor livre extra.

O Índice de Historicidade $\Phi$ é definido por:

$$\Phi = 1 - \frac{\text{Err}_{\text{Hist}}}{\text{Err}_{\text{Mark}}}$$

* $\Phi \approx 0$: Memória redundante. O sistema comporta-se eficientemente em bases markovianas locais.
* $\Phi \gg 0$: Historicidade dominante. $\Delta F$ provê dados causais cruciais irredutíveis.

### 5.3 Loops de Histerese $A = \oint S \, dE$
Surgimento de curvas de retardamento magnético/viscoelástico quando o estimulador opera ciclicamente. A magnitude da área fechada representa a energia dissipada e armazenada temporariamente nas dobras da variável histórica.

---

## 6. Baselines de Compressibilidade de Lag e Espaço de Fase Estendido ($k^*$)

O principal desafio metodológico da Prisantemotria é provar que $\Delta F$ não é apenas um artifício conveniente ou filtro de aproximação autoregressivo clássico.

### 6.1 A Dimensão Mínima de Embedding de Markov $k^*(\epsilon)$
No módulo **Margem Crítica de Memória**, define-se a métrica $k^*(\epsilon)$ como a menor ordem de autorregressão linear de atraso de tempo $AR(p)$ em $S$ capaz de imitar os resultados obtidos pelo regressor histórico dentro de uma tolerância residual pré-estabelecida $\epsilon$:

$$\text{Err}_{AR(p^*)} \le \text{Err}_{\Delta F} + \epsilon$$

Se plotarmos $k^*$ versus a escala de memória do sistema $\tau_H$:
* **Caso Compressível**: Se $k^*$ se mantém em valores fixos e baixos (ex. $2 \le k^* \le 3$), significa que $\Delta F$ é apenas um atalho computacional conveniente que pode ser mimetizado com poucos vetores de estado oculto.
* **Caso Crítico e Escalante**: Se defrontarmos com picos dramáticos de explosão de $k^*$ nas imediações do regime ótimo temporário ($\tau_H \approx \tau_S$), comprova-se que o sistema detém **historicidade irredutível e não-local**, ratificando a hipótese forte de forma inapelável.

---

## 7. Deep Learning e Echo State Networks (ESN)

Para consolidar as validações algorítmicas frente às mais modernas táticas de ML e Deep Learning de séries temporais não-lineares, o painel interativo acopla uma **Rede de Estado de Eco (Echo State Network - ESN)**, classe proeminente de *Reservoir Computing*:

### 7.1 Arquitetura Interna da ESN
1. **Reservatório de Recorrência**: Projetado com um volume ajustável de $N_R$ neurônios que processam excitações mútuas sob uma matriz de adjacência densa e randomizada $W_{\text{res}}$.
2. **Raio Espectral ($\rho$)**: Condiciona a velocidade de amortecimento e reflexão de traços passados na topologia de rede. Para manter a "propriedade de estado de eco" estável, limita-se a $\rho < 1.0$.
3. **Escoamento (Leakage Rate $L$)**: Funciona como um modulador analógico análogo a $\tau_H$, definindo a persistência das trajetórias na hidrodinâmica neural interna.
4. **Mínimos Quadrados Analíticos**: Diferente de RNNs de treino demorado (Backpropagation Through Time), a ESN treina puramente as conexões de saída $W_{\text{out}}$ resolvendo uma regressão linear analítica instantânea de cume.

---

## 8. Arquitetura do Software e Estrutura de Arquivos

O laboratório de validação é estruturado de forma hiper-modular, segregando visualizadores, solucionadores matemáticos e analíticos analíticos em estrito alinhamento com os preceitos de *Clean Architecture* e *SOLID*:

```
/src
├── App.tsx                    # Shell de Interface principal, roteador de Abas e rodapé científico.
├── types.ts                   # Definição e empacotamento unificado de interfaces, dados e enums.
├── index.css                  # Folha global de Estilos, importações de fontes sofisticadas e temas Slate.
├── main.tsx                   # Ponto de entrada SPA.
│
├── simulator
│   ├── ode.ts                 # Integrador Runge-Kutta 4 (RK4) para trajetórias e experimentos de Clones.
│   ├── baselines.ts           # Métricas analíticas do e-fit, inversões de matriz e determinação de k*.
│   └── esn.ts                 # Implementação de Rede neural Echo State (Reservoir Computing) determinística.
│
└── components
    ├── LabCore.tsx            # Execução de Trajetórias v1.0, Retratos de Fases, loops e Testagem de Clones físicos.
    ├── LabBaselines.tsx       # Experimentos comparativos com aproximadores autoregressivos lineares basais.
    ├── LabReservoir.tsx       # Simulação neural ESN e inspeção vetorial de ativação interna passiva.
    ├── LabCompression.tsx     # Sweep paramétrico tridimensional, mapa de fase de Ф e curvas k* de irredução.
    └── LabDocumentation.tsx   # Painel explicativo, equações integradas e guia analítico-variacional formal.
```

---

## 9. Síntese Epistemológica e Falseabilidade

| Fenômeno Observado | Linha de Modelagem | Diagnóstico Epistemológico |
|---|---|---|
| **Divergência Crítica Nula ($D_{\max} \approx 0$)** | Equivalente markoviano perfeito. | Prisantemotria Redundante. O sistema não necessita de estado histórico. Teoria considerada **Nula/Falsa**. |
| **Divergência $D > 0$ com $k^* \le 2$** | Equação diferencial linear simples. | Útil como empacotador de coordenadas de atraso, mas sem quebras de simetria dimensional. |
| **Divergência Forte $D \ge 0.1$, $\Phi \ge 0.15$ com explosão local de $k^*$** | Historicidade irredutível. | **Validação Científica Absoluta.** O sistema requer explicitamente armazenamento local histórico não-markoviano sob GLE de escala crítica. |

---
**Memorial científico revisado e homologado para os padrões Prisantemotria Lab v2.0.**  
*Relações dinâmicas causalmente ativas e falseáveis em tempo real.*
