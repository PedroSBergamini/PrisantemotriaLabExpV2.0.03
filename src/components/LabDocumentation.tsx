/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, HelpCircle, CheckCircle, Info, ChevronDown, Award } from 'lucide-react';
import { useState } from 'react';

export default function LabDocumentation() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const sections = [
    {
      title: '1. O Núcleo Dinâmico Mínimo (Equações Diferenciais)',
      content: (
        <div className="flex flex-col gap-4 text-xs font-sans leading-relaxed text-zinc-300">
          <p>
            O núcleo representacional da Prisantemotria v1.0 consiste em um acoplamento mútuo entre as coordenadas instantâneas do estado físico de um sistema $S$ e seu histórico de tensões, denotado por $\Delta F$.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-950 border border-slate-850 rounded">
              <span className="text-emerald-400 font-mono block font-bold mb-1">// Dinâmica Física do Estado:</span>
              <p className="font-mono text-[11px] text-zinc-200">
                {"m \\ddot{S} + \\gamma \\dot{S} + V'(S) = E(t) + \\beta \\Delta F"}
              </p>
              <p className="text-[10px] text-slate-500 mt-2">
                Onde m é a inércia efetiva, &gamma; representa a taxa dissipativa amortecedora, E(t) é a excitação mecânica exógena, e &beta;&Delta;F é a força elástica exercida pelo histórico do sistema.
              </p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-850 rounded">
              <span className="text-cyan-400 font-mono block font-bold mb-1">// Dinâmica Histórica Local (Campo de Memória):</span>
              <p className="font-mono text-[11px] text-zinc-200">
                {"\\tau_H \\dot{\\Delta F} = -\\Delta F + \\alpha \\dot{S} + \\eta S"}
              </p>
              <p className="text-[10px] text-slate-500 mt-2">
                Onde &tau;_H é o tempo característico para o esquecimento espontâneo, &alpha; mede o impacto de transição abrupta e &eta; quantifica a deposição de hábito por tempo de exposição estático.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 p-3 rounded text-[11px] border border-slate-800">
            <strong className="text-slate-100 block mb-1">Equivalência Física de Generalized Langevin:</strong>
            Substituindo a expressão analítica integrada de &Delta;F(t) na dinâmica mecânica inicial, o sistema colapsa para uma equação diferencial integrodiferencial do tipo Langevin Geral:
            <span className="block font-mono text-zinc-300 my-1 font-bold text-center">
              {"m\\ddot{S}(t) + \\gamma\\dot{S}(t) + V'(S(t)) = E(t) + \\frac{\\beta}{\\tau_H}\\int_{-\\infty}^t e^{-(t-s)/\\tau_H}(\\alpha\\dot{S}(s)+\\eta S(s))ds"}
            </span>
            Isso remove qualquer traço de misticismo sobre a teoria, provando que a historicidade se comporta nos exatos termos de viscoelasticidades de polímeros ou tensões de deformabilidade com relaxações retardadas.
          </div>
        </div>
      ),
    },
    {
      title: '2. Formalismo Variacional de Lagrangiano e Hamiltoniano (Euler-Lagrange)',
      content: (
        <div className="flex flex-col gap-4 text-xs font-sans leading-relaxed text-zinc-300">
          <p>
            Diferente de sistemas sem perdas clássicos, os setores de acoplamento viscoelásticos podem ser formalizados de forma variacional utilizando-se extensões dissipativas. O Lagrangiano mínimo definido para Prisantemotria é:
          </p>

          <div className="bg-slate-950 p-4 rounded border border-slate-850 font-mono text-center text-zinc-200">
            {"L = \\frac{1}{2} m \\dot{S}^2 - V(S) + \\frac{1}{2} m_H \\dot{\\Delta F}^2 - U(\\Delta F) + \\beta S \\Delta F - \\gamma_H \\Delta F \\dot{\\Delta F}"}
          </div>

          <p>
            {"E definindo-se os momentos canônicos associados como $P_S = m\\dot{S}$ e $P_H = m_H \\dot{\\Delta F}$, as equações Hamiltonianas representam atratores históricos de forma compacta e intuitiva:"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[11px] text-zinc-300">
            <div className="bg-slate-950 border border-slate-850 p-3 rounded">
              <span className="text-violet-400 font-bold block mb-1">// Hábito Dinâmico:</span>
              <p>Hábito é análogo a mínimos estruturais na paisagem do potencial histórico {"U(\\Delta F) = \\frac{1}{2} k_H \\Delta F^2"}, aprisionando o momento histórico.</p>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-3 rounded">
              <span className="text-violet-400 font-bold block mb-1">// Trauma Mecânico:</span>
              <p>Trauma é modelado por poços de potenciais históricos duplos (trava de bistabilidade), exigindo flutuações de altíssima energia para o desencarceramento.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '3. Regimes Críticos Operacionais do Índice de Historicidade \u03A6',
      content: (
        <div className="flex flex-col gap-3 text-xs font-sans text-zinc-300 leading-relaxed">
          <p>
            O Índice de Historicidade $\Phi$ é definido operacionalmente para medir o ganho preditivo de próximo passo que uma variável histórica confere sobre o modelo de estado simplificado. O sistema transita por três regimes principais bem delineados pela constante crítica de acoplamento temporal:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
            <div className="bg-slate-950 border border-slate-850 p-3 rounded flex flex-col gap-1">
              <span className="text-slate-400 font-mono font-bold">1. Memória Curta (&tau;_H &lt;&lt; &tau;_S)</span>
              <p className="text-slate-400">Esquecimento rápido. &Delta;F se comporta como ruído de relaxação instantâneo. O índice &Phi; colapsa para ~0, tornando o sistema puramente Markoviano e sem dependência histórica macroscópica.</p>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-3 rounded flex flex-col gap-1 bg-emerald-950/20 border-emerald-900/40">
              <span className="text-emerald-400 font-mono font-bold">2. Memória Crítica (&tau;_H ~ &tau;_S)</span>
              <p className="text-emerald-300">Ressonância temporal. Máximo acúmulo de causalidade dinâmica. O índice &Phi; atinge seu ápice absoluto e os clones históricos exibem a maior aceleração de divergência caótica.</p>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-3 rounded flex flex-col gap-1">
              <span className="text-slate-400 font-mono font-bold">3. Memória Congelada (&tau;_H &gt;&gt; &tau;_S)</span>
              <p className="text-slate-400">Cristalização extrema. O passado vira uma constante geológica ou atrator estático. O sistema perde flexibilidade dinâmica, reduzindo a volatilidade de &Delta;F e derrubando &Phi;.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '4. Critérios de Falseamento & Rigor de Validação',
      content: (
        <div className="text-xs font-sans text-zinc-300 leading-relaxed flex flex-col gap-2">
          <p>Para garantir que a teoria permaneça no escopo da ciência experimental fidedigna, as seguintes matrizes de decisão são permanentemente mantidas na v1.0:</p>
          
          <table className="w-full text-left font-mono mt-2 text-[10px] border border-slate-800 rounded overflow-hidden">
            <thead>
              <tr className="bg-slate-950 text-slate-350 border-b border-slate-800">
                <th className="p-2 border-r border-slate-800">Resultado do Sweep</th>
                <th className="p-2 border-r border-slate-800">Mapeamento Direto</th>
                <th className="p-2">Decisão de Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-900">
                <td className="p-2 border-r border-slate-900 text-red-400">&Phi; &lt; 0.01 / Clone Estático</td>
                <td className="p-2 border-r border-slate-900 text-zinc-400">Lags não fornecem causalidade extra.</td>
                <td className="p-2 text-red-500 font-bold">FALSEADA (Teoria Nula/Inexistente)</td>
              </tr>
              <tr className="border-b border-slate-900 text-zinc-300">
                <td className="p-2 border-r border-slate-900 text-yellow-400">&Phi; &gt; 0.1 / ARIMA(2) mimetiza</td>
                <td className="p-2 border-r border-slate-900 text-zinc-400">Variável histórica compactável em lags lineares.</td>
                <td className="p-2 text-yellow-500 font-semibold">Parcialmente Verdadeira (Compactável)</td>
              </tr>
              <tr className="text-zinc-300">
                <td className="p-2 border-r border-slate-900 text-emerald-400">&Phi; &gt; 0.15 / Clone diverge e ARIMA quebra</td>
                <td className="p-2 border-r border-slate-900 text-zinc-400">Grau de historicidade irredutível ao escopo.</td>
                <td className="p-2 text-emerald-500 font-extrabold">PRISANTEMOTRIA COMPROVADA v1.2</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    }
  ];

  return (
    <div className="flex flex-col gap-6" id="docs-tab">
      
      {/* Visual Identity Logo in Doc */}
      <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-3 relative overflow-hidden" id="docs-core-hero">
        <div className="absolute right-[-10px] top-[-10px] p-6 bg-emerald-950/10 text-emerald-500 rounded-full">
          <Award size={65} className="opacity-10" />
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="text-emerald-400 shrink-0" size={24} />
          <h1 className="text-lg font-bold font-display tracking-tight text-white leading-none">
            Caderno Teórico de Investigação Prisantemotria
          </h1>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed max-w-[95%]">
          Bem-vindo ao memorial oficial de investigação estruturado para sistematizar a evolução da historicidade causal do sistema. Este caderno provê a fundamentação mecânica integrada das dinâmicas expressas em dados no painel interativo.
        </p>
      </div>

      {/* Interactive scientific accordions */}
      <div className="flex flex-col gap-3" id="accordions-container">
        {sections.map((sec, idx) => {
          const isOpen = activeAccordion === idx;
          return (
            <div
              key={idx}
              id={`doc-section-${idx}`}
              className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full px-5 py-4 flex justify-between items-center bg-slate-900 hover:bg-slate-850 text-left text-slate-100 transition-colors"
              >
                <span className="text-sm font-semibold font-display">{sec.title}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-850 mt-1">
                  {sec.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Final science footnotes */}
      <div className="bg-slate-950 border border-slate-850 p-4 rounded-lg flex items-start gap-3 text-slate-400 font-mono text-[10px] leading-relaxed">
        <Info size={16} className="text-slate-500 shrink-0 mt-0.5" />
        <div>
          <span className="text-zinc-300 block font-bold font-mono">CONDIÇÕES DE NOTA DE DISCIPLINA EPISTEMOLÓGICA</span>
          A Prisantemotria v2.0 abandona expressamente quaisquer inferências transcendentais, interpretações psicossomáticas ou apelos semânticos de livre arbítrio sobre os polinômios de $\Delta F$. Em vez disso, postula-se a rigorosa análise analítica de acoplamentos viscoelásticos mecânicos, cuja consistência é atestada pelas rotinas de divergência dos clone-tests no laboratório experimental.
        </div>
      </div>

    </div>
  );
}
