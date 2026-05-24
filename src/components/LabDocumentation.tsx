/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, Info, ChevronDown, Award } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '../i18n';

export default function LabDocumentation() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const { locale } = useI18n();
  const isEn = locale === 'en-US';

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const sections = [
    {
      title: isEn 
        ? '1. The Minimum Dynamic Core (Differential Equations)' 
        : '1. O Núcleo Dinâmico Mínimo (Equações Diferenciais)',
      content: (
        <div className="flex flex-col gap-4 text-xs font-sans leading-relaxed text-zinc-300">
          <p>
            {isEn 
              ? 'The representational core of Prisantemotria v1.0 consists of a mutual coupling between the instantaneous coordinates of the physical state of a system S and its history of stresses, denoted by \u0394F.'
              : 'O núcleo representacional da Prisantemotria v1.0 consiste em um acoplamento mútuo entre as coordenadas instantâneas do estado físico de um sistema S e seu histórico de tensões, denotado por \u0394F.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-950 border border-slate-850 rounded">
              <span className="text-emerald-400 font-mono block font-bold mb-1">
                {isEn ? '// Physical State Dynamics:' : '// Dinâmica Física do Estado:'}
              </span>
              <p className="font-mono text-[11px] text-zinc-200">
                {"m \\ddot{S} + \\gamma \\dot{S} + V'(S) = E(t) + \\beta \\Delta F"}
              </p>
              <p className="text-[10px] text-slate-500 mt-2">
                {isEn 
                  ? 'Where m is the effective inertia, \u03B3 represents the damping dissipative rate, E(t) is the exogenous stimulation drive, and \u03B2\u0394F is the elastic force exerted by the system history.'
                  : 'Onde m é a inércia efetiva, &gamma; representa a taxa dissipativa amortecedora, E(t) é a excitação mecânica exógena, e &beta;&Delta;F é a força elástica exercida pelo histórico do sistema.'}
              </p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-850 rounded">
              <span className="text-cyan-400 font-mono block font-bold mb-1">
                {isEn ? '// Local Historical Dynamics (Memory Field):' : '// Dinâmica Histórica Local (Campo de Memória):'}
              </span>
              <p className="font-mono text-[11px] text-zinc-200">
                {"\\tau_H \\dot{\\Delta F} = -\\Delta F + \\alpha \\dot{S} + \\eta S"}
              </p>
              <p className="text-[10px] text-slate-500 mt-2">
                {isEn 
                  ? 'Where \u03C4_H is the characteristic time scale for spontaneous forgetting, \u03B1 measures the impact of sharp transition rate, and \u03B7 quantifies habit deposition due to static exposure duration.'
                  : 'Onde &tau;_H é o tempo característico para o esquecimento espontâneo, &alpha; mede o impacto de transição abrupta e &eta; quantifica a deposição de hábito por tempo de exposição estático.'}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 p-3 rounded text-[11px] border border-slate-800">
            <strong className="text-slate-100 block mb-1">
              {isEn ? 'Physical Equivalence to Generalized Langevin Equation:' : 'Equivalência Física de Generalized Langevin:'}
            </strong>
            {isEn 
              ? 'By substituting the integrated analytical expression of \u0394F(t) back into the initial physical equation, the system boils down to a classic integro-differential Generalized Langevin equation:'
              : 'Substituindo a expressão analítica integrada de &Delta;F(t) na dinâmica mecânica inicial, o sistema colapsa para uma equação diferencial integrodiferencial do tipo Langevin Geral:'}
            <span className="block font-mono text-zinc-300 my-1 font-bold text-center">
              {"m\\ddot{S}(t) + \\gamma\\dot{S}(t) + V'(S(t)) = E(t) + \\frac{\\beta}{\\tau_H}\\int_{-\\infty}^t e^{-(t-s)/\\tau_H}(\\alpha\\dot{S}(s)+\\eta S(s))ds"}
            </span>
            {isEn 
              ? 'This removes any layer of mysticism from the theory, proving that historicity behaves exactly like polymer viscoelasticity or deformation tensions under retarding relaxations.'
              : 'Isso remove qualquer traço de misticismo sobre a teoria, provando que a historicidade se comporta nos exatos termos de viscoelasticidades de polímeros ou tensões de deformabilidade com relaxações retardadas.'}
          </div>
        </div>
      ),
    },
    {
      title: isEn 
        ? '2. Variational Formalism of Lagrangian and Hamiltonian (Euler-Lagrange)' 
        : '2. Formalismo Variacional de Lagrangiano e Hamiltoniano (Euler-Lagrange)',
      content: (
        <div className="flex flex-col gap-4 text-xs font-sans leading-relaxed text-zinc-300">
          <p>
            {isEn 
              ? 'Unlike classical lossless systems, coupled viscoelastic properties can be variationally formulated using dissipative extensions. The minimum Lagrangian defined for Prisantemotria is:'
              : 'Diferente de sistemas sem perdas clássicos, os setores de acoplamento viscoelásticos podem ser formalizados de forma variacional utilizando-se extensões dissipativas. O Lagrangiano mínimo definido para Prisantemotria é:'}
          </p>

          <div className="bg-slate-950 p-4 rounded border border-slate-850 font-mono text-center text-zinc-200">
            {"L = \\frac{1}{2} m \\dot{S}^2 - V(S) + \\frac{1}{2} m_H \\dot{\\Delta F}^2 - U(\\Delta F) + \\beta S \\Delta F - \\gamma_H \\Delta F \\dot{\\Delta F}"}
          </div>

          <p>
            {isEn 
              ? 'By defining associated canonical momenta as P_S = m\u1E40 and P_H = m_H \u0394\u1E42, the Hamiltonian equations represent historical attractors compactly:'
              : 'E definindo-se os momentos canônicos associados como $P_S = m\\dot{S}$ e $P_H = m_H \\dot{\\Delta F}$, as equações Hamiltonianas representam atratores históricos de forma compacta e intuitiva:'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[11px] text-zinc-300">
            <div className="bg-slate-950 border border-slate-850 p-3 rounded">
              <span className="text-violet-400 font-bold block mb-1">
                {isEn ? '// Dynamic Habit:' : '// Hábito Dinâmico:'}
              </span>
              <p>
                {isEn 
                  ? 'Habit is analogous to structural local minima in the landscape of the historical potential potential potential, trapping historical momentum.'
                  : 'Hábito é análogo a mínimos estruturais na paisagem do potencial histórico U(\\Delta F) = \\frac{1}{2} k_H \\Delta F^2, aprisionando o momento histórico.'}
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-3 rounded">
              <span className="text-violet-400 font-bold block mb-1">
                {isEn ? '// Mechanical Trauma:' : '// Trauma Mecânico:'}
              </span>
              <p>
                {isEn 
                  ? 'Trauma is modeled by double wells of historical potentials (bi-stable lock), requiring very high energy fluctuations to escape.'
                  : 'Trauma é modelado por poços de potenciais históricos duplos (trava de bistabilidade), exigindo flutuações de altíssima energia para o desencarceramento.'}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: isEn 
        ? '3. Critical Operational Regimes of the Historicity Index \u03A6' 
        : '3. Regimes Críticos Operacionais do Índice de Historicidade \u03A6',
      content: (
        <div className="flex flex-col gap-3 text-xs font-sans text-zinc-300 leading-relaxed">
          <p>
            {isEn 
              ? 'The Historicity Index \u03A6 is operationally defined to measure the next-step predictive gain that a historical variable yields over a simplified state model. The system goes through three main regimes bounded by the critical temporal coupling constant:'
              : 'O Índice de Historicidade \u03A6 é definido operacionalmente para medir o ganho preditivo de próximo passo que uma variável histórica confere sobre o modelo de estado simplificado. O sistema transita por três regimes principais bem delineados pela constante crítica de acoplamento temporal:'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
            <div className="bg-slate-950 border border-slate-850 p-3 rounded flex flex-col gap-1">
              <span className="text-slate-400 font-mono font-bold">
                {isEn ? '1. Short Memory (\u03C4_H << \u03C4_S)' : '1. Memória Curta (\u03C4_H << \u03C4_S)'}
              </span>
              <p className="text-zinc-400">
                {isEn 
                  ? 'Quick forgetting. \u0394F behaves as instantaneous white noise. The \u03A6 index collapses back to ~0, leaving the system purely Markovian.'
                  : 'Esquecimento rápido. \u0394F se comporta como ruído de relaxação instantâneo. O índice \u03A6 colapsa para ~0, tornando o sistema puramente Markoviano e sem dependência histórica macroscópica.'}
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-3 rounded flex flex-col gap-1 bg-emerald-950/20 border-emerald-900/40">
              <span className="text-emerald-400 font-mono font-bold">
                {isEn ? '2. Critical Memory (\u03C4_H ~ \u03C4_S)' : '2. Memória Crítica (\u03C4_H ~ \u03C4_S)'}
              </span>
              <p className="text-emerald-300">
                {isEn 
                  ? 'Temporal resonance. Maximum buildup of dynamic causality. The \u03A6 index reaches its absolute peak and clone-tests display strong chaotic divergence.'
                  : 'Ressonância temporal. Máximo acúmulo de causalidade dinâmica. O índice \u03A6 atinge seu ápice absoluto e os clones históricos exibem a maior aceleração de divergência caótica.'}
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-850 p-3 rounded flex flex-col gap-1">
              <span className="text-slate-400 font-mono font-bold">
                {isEn ? '3. Frozen Memory (\u03C4_H >> \u03C4_S)' : '3. Memória Congelada (\u03C4_H >> \u03C4_S)'}
              </span>
              <p className="text-zinc-400">
                {isEn 
                  ? 'Extreme crystallization. The past hardens into a geological constant or static attractor. The system loses flexibility, dropping both \u0394F volatility and \u03A6.'
                  : 'Cristalização extrema. O passado vira uma constante geológica ou atrator estático. O sistema perde flexibilidade dinâmica, reduzindo a volatilidade de \u0394F e derrubando \u03A6.'}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: isEn 
        ? '4. Falsification Criteria & Validation Rigor' 
        : '4. Critérios de Falseamento & Rigor de Validação',
      content: (
        <div className="text-xs font-sans text-zinc-300 leading-relaxed flex flex-col gap-2">
          <p>
            {isEn 
              ? 'To guarantee that the theory remains soundly within the boundaries of experimental science, the following decision matrices are permanently enforced in v1.0:'
              : 'Para garantir que a teoria permaneça no escopo da ciência experimental fidedigna, as seguintes matrizes de decisão são permanentemente mantidas na v1.0:'}
          </p>
          
          <table className="w-full text-left font-mono mt-2 text-[10px] border border-slate-800 rounded overflow-hidden">
            <thead>
              <tr className="bg-slate-950 text-slate-350 border-b border-slate-800">
                <th className="p-2 border-r border-slate-800">{isEn ? 'Sweep Result' : 'Resultado do Sweep'}</th>
                <th className="p-2 border-r border-slate-800">{isEn ? 'Direct Mapping' : 'Mapeamento Direto'}</th>
                <th className="p-2">{isEn ? 'Status Decision' : 'Decisão de Status'}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-900">
                <td className="p-2 border-r border-slate-900 text-red-400">&Phi; &lt; 0.01 / Clone Estático</td>
                <td className="p-2 border-r border-slate-900 text-zinc-400">
                  {isEn ? 'Lags provide no additional causality benefit.' : 'Lags não fornecem causalidade extra.'}
                </td>
                <td className="p-2 text-red-500 font-bold">
                  {isEn ? 'FALSIFIED (Theory Dismissed)' : 'FALSEADA (Teoria Nula/Inexistente)'}
                </td>
              </tr>
              <tr className="border-b border-slate-900 text-zinc-300">
                <td className="p-2 border-r border-slate-900 text-yellow-400">&Phi; &gt; 0.1 / ARIMA(2) mimetiza</td>
                <td className="p-2 border-r border-slate-900 text-zinc-400">
                  {isEn ? 'History field fully compressible into linear autoregressive lags.' : 'Variável histórica compactável em lags lineares.'}
                </td>
                <td className="p-2 text-yellow-500 font-semibold">
                  {isEn ? 'Partially True (Compressible)' : 'Parcialmente Verdadeira (Compactável)'}
                </td>
              </tr>
              <tr className="text-zinc-300">
                <td className="p-2 border-r border-slate-900 text-emerald-400">&Phi; &gt; 0.15 / Clone diverge e ARIMA quebra</td>
                <td className="p-2 border-r border-slate-900 text-zinc-400">
                  {isEn ? 'Highly irreducible non-Markovianity context.' : 'Grau de historicidade irredutível ao escopo.'}
                </td>
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
            {isEn 
              ? 'Prisantemotria Theoretical Research Notebook' 
              : 'Caderno Teórico de Investigação Prisantemotria'}
          </h1>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed max-w-[95%]">
          {isEn 
            ? 'Welcome to the official research memorial structured to systematize the evolution of causal historicity inside the system. This notebook yields the integrated mechanical foundations of the dynamics plotted in real-time.'
            : 'Bem-vindo ao memorial oficial de investigação estruturado para sistematizar a evolução da historicidade causal do sistema. Este caderno provê a fundamentação mecânica integrada das dinâmicas expressas em dados no painel interativo.'}
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
          <span className="text-zinc-300 block font-bold font-mono">
            {isEn ? 'EPISTEMOLOGICAL DISCIPLINE FOOTNOTE' : 'CONDIÇÕES DE NOTA DE DISCIPLINA EPISTEMOLÓGICA'}
          </span>
          {isEn 
            ? 'Prisantemotria v2.0 explicitly abandons any psychosomatic interpretations, transcendental inferences, or free-will appeals over the polynomials of \u0394F. Instead, it postulates a rigorous analysis of coupled visco-elastic mechanical histories, whose consistency is proven by chaotic divergence rates during clone tests.'
            : 'A Prisantemotria v2.0 abandona expressamente quaisquer inferências transcendentais, interpretações psicossomáticas ou apelos semânticos de livre arbítrio sobre os polinômios de \u0394F. Em vez disso, postula-se a rigorosa análise analítica de acoplamentos viscoelásticos mecânicos, cuja consistência é atestada pelas rotinas de divergência dos clone-tests no laboratório experimental.'}
        </div>
      </div>

    </div>
  );
}
