/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BookOpen, HelpCircle, Activity, Landmark, Sparkles, Binary, Compass } from 'lucide-react';
import { humanizeMetric, HumanizedMetric } from '../../interpretation/humanizer/index';

export default function InterpretationPanel() {
  const [selectedMetric, setSelectedMetric] = useState<'phi' | 'clone_div' | 'k_star' | 'hysteresis'>('phi');
  const [testValue, setTestValue] = useState<number>(0.24);

  const metricDetails: Record<'phi' | 'clone_div' | 'k_star' | 'hysteresis', { label: string; min: number; max: number; step: number }> = {
    phi: { label: 'Índice Φ (Historicidade)', min: -0.1, max: 1.0, step: 0.05 },
    clone_div: { label: 'Convergência do Clone', min: 0.0, max: 2.0, step: 0.1 },
    k_star: { label: 'Dimensão k* (Embedding)', min: 1, max: 12, step: 1 },
    hysteresis: { label: 'Área da Histerese', min: 0.0, max: 4.0, step: 0.2 }
  };

  const activeInterpreted: HumanizedMetric = humanizeMetric(
    selectedMetric === 'k_star' ? 'k_star' : selectedMetric === 'clone_div' ? 'clone_div' : selectedMetric === 'hysteresis' ? 'hysteresis' : 'phi',
    testValue,
    'pt-BR'
  );

  return (
    <div className="flex flex-col gap-6" id="interpretation-tab">
      
      {/* Introduction */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-100 font-display flex items-center gap-2">
            🧭 Camada de Interpretação e Explicação
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Traduz rigorosos dados matemáticos não-lineares em múltiplos níveis de abstração cognitiva. Esta ferramenta de explicabilidade permite compreender a dinâmica do sistema por meio de interpretações físicas, recomendações operacionais e analogias intuitivas simples.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Metric Selector Card */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-300 font-display uppercase tracking-wider flex items-center gap-1.5">
              <Compass size={14} className="text-violet-400" /> Selecionar Métrica
            </h3>

            <div className="flex flex-col gap-2">
              {(Object.keys(metricDetails) as Array<keyof typeof metricDetails>).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedMetric(key);
                    setTestValue(key === 'k_star' ? 4 : key === 'phi' ? 0.24 : key === 'clone_div' ? 0.6 : 1.2);
                  }}
                  className={`w-full text-left p-3 rounded-lg text-xs font-mono transition flex items-center justify-between border ${
                    selectedMetric === key
                      ? 'bg-violet-950/40 text-violet-300 border-violet-800/60'
                      : 'bg-slate-900 text-zinc-400 border-slate-800 hover:bg-slate-800/80'
                  }`}
                >
                  <span>{metricDetails[key].label}</span>
                  <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-zinc-300">
                    {key.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>

            {/* Simulated controller slider */}
            <div className="border-t border-slate-900 pt-4 mt-2">
              <label className="text-[11px] font-mono text-zinc-400 flex justify-between">
                <span>Ajustar valor observado (Simulação):</span>
                <span className="text-violet-400 font-bold">{testValue}</span>
              </label>
              <input
                type="range"
                min={metricDetails[selectedMetric].min}
                max={metricDetails[selectedMetric].max}
                step={metricDetails[selectedMetric].step}
                value={testValue}
                onChange={(e) => setTestValue(parseFloat(e.target.value))}
                className="w-full mt-2 accent-violet-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Cognitive Tiers display card */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 flex flex-col gap-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-850">
              <h3 className="text-sm font-bold text-slate-100 font-display flex items-center gap-2">
                <BookOpen size={16} className="text-violet-400" />
                Abstração Cognitiva do {activeInterpreted.name}
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                activeInterpreted.status === 'OPTIMAL' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' :
                activeInterpreted.status === 'MODERATE' ? 'bg-indigo-950 text-indigo-400 border border-indigo-800/40' :
                'bg-slate-950 text-zinc-400 border border-slate-800'
              }`}>
                {activeInterpreted.status}
              </span>
            </div>

            {/* Hierarchical Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Tier 1: Technical Rigor */}
              <div className="bg-slate-950/60 border border-slate-900 p-4 rounded-lg flex flex-col gap-2">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase flex items-center gap-1.5 border-b border-slate-900 pb-1.5">
                  <Binary size={12} className="text-sky-400" /> Rigor Técnico / Matemático
                </span>
                <p className="text-[11px] text-zinc-300 leading-relaxed font-mono">
                  {activeInterpreted.technical}
                </p>
              </div>

              {/* Tier 2: Operational Laboratory Meaning */}
              <div className="bg-slate-950/60 border border-slate-900 p-4 rounded-lg flex flex-col gap-2">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase flex items-center gap-1.5 border-b border-slate-900 pb-1.5">
                  <Activity size={12} className="text-emerald-400" /> Significado Operacional
                </span>
                <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                  {activeInterpreted.operational}
                </p>
              </div>

              {/* Tier 3: Intuitive Conception */}
              <div className="bg-slate-950/60 border border-slate-900 p-4 rounded-lg flex flex-col gap-2">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase flex items-center gap-1.5 border-b border-slate-900 pb-1.5">
                  <Sparkles size={12} className="text-violet-400" /> Explicação Intuitiva
                </span>
                <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                  {activeInterpreted.human}
                </p>
              </div>

              {/* Tier 4: Mechanical Metaphor */}
              <div className="bg-slate-950/60 border border-slate-900 p-4 rounded-lg flex flex-col gap-2">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase flex items-center gap-1.5 border-b border-slate-900 pb-1.5">
                  <Landmark size={12} className="text-amber-400" /> Metáfora Física Real
                </span>
                <p className="text-[11px] text-zinc-300 leading-relaxed italic font-sans">
                  "{activeInterpreted.metaphor}"
                </p>
              </div>

            </div>

            {/* What to try next recommendation banner */}
            <div className="bg-violet-950/20 border border-violet-900/30 p-3 rounded-lg flex items-center gap-3 mt-1">
              <div className="p-1.5 bg-violet-900/30 rounded text-violet-400">
                <HelpCircle size={14} />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-mono text-violet-400 uppercase font-bold tracking-wider">Ação Recomendada em Laboratório:</span>
                <p className="text-[11px] text-zinc-300 font-sans leading-normal mt-0.5">
                  {activeInterpreted.nextStep}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
