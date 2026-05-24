/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { AreaChart, Brain, RefreshCw, BarChart2, Info, BookOpen } from 'lucide-react';
import { SystemParameters, StimulusType } from '../types';
import { runSimulation } from '../simulator/ode';
import { evaluateMarkovianFit } from '../simulator/baselines';

interface LabBaselinesProps {
  // We can pass current parent state or regenerate locally for encapsulation
}

export default function LabBaselines() {
  // State for physical system parameter sync
  const [params, setParams] = useState<SystemParameters>({
    m: 1.0,
    gamma: 0.15,
    potential: 'double_well',
    beta: 1.0,  // Dynamic historicity coupling
    tauH: 3.5,  // Memory relaxation scale
    alpha: 0.8,
    eta: 0.2,
    V_height: 0.6,
  });

  const [stimType, setStimType] = useState<StimulusType>('sine');
  const [amp, setAmp] = useState(1.2);
  const [freq, setFreq] = useState(0.12);

  // AR lag order size parameter
  const [arOrder, setArOrder] = useState<number>(2);

  // Generate dataset
  const rawSimulationData = useMemo(() => {
    return runSimulation(params, stimType, amp, freq, 35, 0.05);
  }, [params, stimType, amp, freq]);

  // Fit Markovian vs Historical models
  const fitResults = useMemo(() => {
    return evaluateMarkovianFit(rawSimulationData, arOrder);
  }, [rawSimulationData, arOrder]);

  const { metrics, predictions, coefficientsMarkov, coefficientsHistoric } = fitResults;

  // Custom Plotting dimensions
  const fW = 500;
  const fH = 180;

  // Render prediction curve comparisons
  const predictionChart = useMemo(() => {
    if (!predictions.length) return null;
    const padding = 20;

    const maxVal = Math.max(...predictions.map(p => Math.abs(p.actual))) || 1;
    const getX = (t: number) => padding + ((t - predictions[0].t) / (predictions[predictions.length - 1].t - predictions[0].t)) * (fW - 2 * padding);
    const getY = (v: number) => fH / 2 - (v / (maxVal * 1.1)) * (fH / 2 - padding);

    let pathActual = '';
    let pathMarkov = '';
    let pathHistoric = '';

    predictions.forEach((p, index) => {
      const x = getX(p.t);
      const yAct = getY(p.actual);
      const yM = getY(p.markovPred);
      const yH = getY(p.historicPred);

      if (index === 0) {
        pathActual = `M ${x} ${yAct}`;
        pathMarkov = `M ${x} ${yM}`;
        pathHistoric = `M ${x} ${yH}`;
      } else {
        pathActual += ` L ${x} ${yAct}`;
        pathMarkov += ` L ${x} ${yM}`;
        pathHistoric += ` L ${x} ${yH}`;
      }
    });

    return (
      <svg className="w-full h-full bg-slate-950/80 rounded" viewBox={`0 0 ${fW} ${fH}`} id="predictions-svg">
        <line x1={0} y1={fH / 2} x2={fW} y2={fH / 2} stroke="#334155" strokeDasharray="3 3" />
        
        {/* Actual series S(t+1) */}
        <path d={pathActual} fill="none" stroke="#f1f5f9" strokeWidth={1.8} />

        {/* Markov Forecast AR(p) */}
        <path d={pathMarkov} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="2 2" strokeOpacity={0.8} />

        {/* Historical Forecast AR(p) + dF */}
        <path d={pathHistoric} fill="none" stroke="#10b981" strokeWidth={1.2} />

        <g transform={`translate(${fW - 210}, 15)`} className="text-[9px] font-mono fill-zinc-300">
          <line x1={0} y1={-2} x2={10} y2={-2} stroke="#f1f5f9" strokeWidth={1.8} />
          <text x={14} y={1}>S Real (Simulado)</text>

          <line x1={0} y1={10} x2={10} y2={10} stroke="#dc2626" strokeWidth={1} strokeDasharray="2 2" />
          <text x={14} y={13}>Markov AR({arOrder}) Basal</text>

          <line x1={0} y1={22} x2={10} y2={22} stroke="#10b981" strokeWidth={1.2} />
          <text x={14} y={25}>Histórico AR({arOrder}) + \u0394F</text>
        </g>
      </svg>
    );
  }, [predictions, arOrder]);

  // Render squared error residuals over time
  const residualsChart = useMemo(() => {
    if (!predictions.length) return null;
    const padding = 20;

    const maxErr = Math.max(...predictions.map(p => Math.max(p.markovError, p.historicError))) || 0.1;
    const getX = (t: number) => padding + ((t - predictions[0].t) / (predictions[predictions.length - 1].t - predictions[0].t)) * (fW - 2 * padding);
    const getY = (v: number) => fH - padding - (v / (maxErr * 1.05)) * (fH - 2 * padding);

    let pathMarkovErr = '';
    let pathHistoricErr = '';

    predictions.forEach((p, index) => {
      const x = getX(p.t);
      const yM = getY(p.markovError);
      const yH = getY(p.historicError);

      if (index === 0) {
        pathMarkovErr = `M ${x} ${yM}`;
        pathHistoricErr = `M ${x} ${yH}`;
      } else {
        pathMarkovErr += ` L ${x} ${yM}`;
        pathHistoricErr += ` L ${x} ${yH}`;
      }
    });

    return (
      <svg className="w-full h-full bg-slate-950/80 rounded" viewBox={`0 0 ${fW} ${fH}`} id="residuals-svg">
        <line x1={padding} y1={fH - padding} x2={fW - padding} y2={fH - padding} stroke="#334155" />
        
        {/* Markov residues */}
        <path d={pathMarkovErr} fill="none" stroke="#ef4444" strokeWidth={1} />
        
        {/* Historical residues */}
        <path d={pathHistoricErr} fill="none" stroke="#22c55e" strokeWidth={1} />

        <g transform="translate(15, 20)" className="text-[9px] font-mono fill-zinc-400">
          <text y={0}>Resíduos Quadráticos (S_pred - S_real)^2</text>
          <text y={11} className="fill-red-400">Linha Vermelha: Markov MSE</text>
          <text y={22} className="fill-emerald-400">Linha Verde: Histórico MSE</text>
        </g>
      </svg>
    );
  }, [predictions]);

  return (
    <div className="flex flex-col gap-6" id="baselines-tab">
      
      {/* Overview analysis metric blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="baseline-metrics-board">
        
        {/* Metric 1: Phi Index */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-1 justify-between relative overflow-hidden">
          <div className="absolute right-[-15px] top-[-15px] p-6 bg-emerald-950/20 text-emerald-500 rounded-full">
            <Brain size={45} className="opacity-15" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wide">Índice Científico de Historicidade</span>
            <h3 className="text-4xl font-extrabold text-emerald-400 font-display mt-1">
              &Phi; = {metrics.phi.toFixed(4)}
            </h3>
          </div>
          <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
            {metrics.interpretation}
          </p>
        </div>

        {/* Metric 2: Markov Damped MSE */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-1 justify-between relative overflow-hidden">
          <div className="absolute right-[-15px] top-[-15px] p-6 bg-red-950/20 text-red-500 rounded-full">
            <BarChart2 size={45} className="opacity-15" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wide">Erro de Previsão Markoviano AR({arOrder})</span>
            <h3 className="text-4xl font-extrabold text-red-400 font-display mt-1">
              {metrics.errMarkov.toExponential(4)}
            </h3>
          </div>
          <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
            Mapeia S_(t+1) baseando-se unicamente nas {arOrder} posições físicas instantâneas passadas.
          </p>
        </div>

        {/* Metric 3: Memory Augmented MSE */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-1 justify-between relative overflow-hidden">
          <div className="absolute right-[-15px] top-[-15px] p-6 bg-teal-950/20 text-teal-500 rounded-full">
            <Info size={45} className="opacity-15" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wide">Erro de Previsão Histórico AR({arOrder}) + &Delta;F</span>
            <h3 className="text-4xl font-extrabold text-teal-400 font-display mt-1">
              {metrics.errHistoric.toExponential(4)}
            </h3>
          </div>
          <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
            Adiciona explicitamente a variável de memória acíclica $\Delta F(t)$ ao conjunto de regressores.
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Settings for physical system generating history */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4" id="baseline-settings-card">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <BookOpen className="text-emerald-400" size={18} />
            <h2 className="text-sm font-semibold text-slate-100 font-display">Controles de Benchmark</h2>
          </div>

          <div className="text-xs text-zinc-300 leading-relaxed bg-slate-950 p-3 rounded border border-slate-850">
            <strong>O Propósito de Compressibilidade:</strong> No paradigma 1.2 da Prisantemotria, avaliamos se um modelo puramente autorregressivo AR(p) de ordem local consegue comprimir e anular a utilidade preditiva de $\Delta F$.
            <p className="mt-1">Aumente o número de lags (Lags do Modelo) abaixo para ver o que acontece com $\Phi$. Se $\Phi \rightarrow 0$ conforme o número de lags cresce, a memória é compacta.</p>
          </div>

          {/* Lag order setting */}
          <div className="flex flex-col gap-1 bg-slate-950 p-3 rounded-lg border border-slate-850 mt-1">
            <label className="text-xs font-mono text-slate-300 flex justify-between">
              <span>Lags do Modelo Markoviano:</span>
              <span className="text-emerald-400 font-bold">p = {arOrder}</span>
            </label>
            <input
              type="range"
              id="ar-order-slider"
              min={1}
              max={8}
              step={1}
              value={arOrder}
              onChange={(e) => setArOrder(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-1.5"
            />
            <span className="text-[9px] text-zinc-500 font-mono text-center block mt-1">
              *Equivale a expandir a dimensão implícita para R^p
            </span>
          </div>

          {/* Model generator sliders */}
          <div className="flex flex-col gap-3.5 border-t border-slate-800/60 pt-3">
            <span className="text-[10px] font-mono text-zinc-500 font-semibold uppercase block">
              Ajuste do Sistema Dinâmico Produtor:
            </span>

            {/* Slider for beta */}
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex justify-between font-mono text-slate-400">
                <span>Intensidade de Efeito Histórico (\u03B2)</span>
                <span className="text-emerald-400">{params.beta}</span>
              </div>
              <input
                type="range"
                id="baseline-beta-slider"
                min={0}
                max={2.5}
                step={0.1}
                value={params.beta}
                onChange={(e) => setParams(p => ({ ...p, beta: parseFloat(e.target.value) }))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Slider for tauH */}
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex justify-between font-mono text-slate-400">
                <span>Tempo de Memória Crítico (\u03C4_H)</span>
                <span className="text-[#38bdf8]">{params.tauH} s</span>
              </div>
              <input
                type="range"
                id="baseline-tauh-slider"
                min={0.3}
                max={8.0}
                step={0.2}
                value={params.tauH}
                onChange={(e) => setParams(p => ({ ...p, tauH: parseFloat(e.target.value) }))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
            
            {/* Input drive frequency */}
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex justify-between font-mono text-slate-400">
                <span>Freq do Estímulo Externo (Hz)</span>
                <span className="text-zinc-300">{freq} Hz</span>
              </div>
              <input
                type="range"
                id="baseline-freq-slider"
                min={0.02}
                max={0.4}
                step={0.01}
                value={freq}
                onChange={(e) => setFreq(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

        </div>

        {/* Prediction plots and fit coefficients logs */}
        <div className="lg:col-span-2 flex flex-col gap-4" id="baseline-charts-panel">
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-200 font-display">Estudo Comparativo de Previsão de Próximo Passo</span>
            <div className="h-[180px] w-full mt-2" id="baseline-predictions-container">
              {predictionChart}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-200 font-display">Evolução Temporal dos Resíduos Quadráticos</span>
            <div className="h-[180px] w-full mt-2" id="baseline-residuals-container">
              {residualsChart}
            </div>
          </div>

          {/* Matrix Weights / coefficients logger console */}
          <div className="bg-slate-950 border border-slate-850 rounded-lg p-4 flex flex-col gap-2 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-zinc-400 font-bold border-b border-slate-850 pb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SISTEMA DE EQUAÇÕES RESOLVIDO - COEFICIENTES ANALÍTICOS (W)
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1 text-[11px] text-zinc-300 leading-tight">
              <div>
                <span className="text-red-400 block font-bold mb-1">// Modelo Markoviano AR({arOrder}):</span>
                {coefficientsMarkov.map((coef, i) => {
                  const label = i === arOrder ? 'E_t (Símulo)' : i === arOrder + 1 ? 'Bias (Intercepto)' : `S_{t-${i + 1}} (Lag ${i + 1})`;
                  return (
                    <div key={i} className="flex justify-between py-0.5 border-b border-slate-900">
                      <span>{label}</span>
                      <span className="font-bold font-mono text-slate-200">{coef.toFixed(5)}</span>
                    </div>
                  );
                })}
              </div>

              <div>
                <span className="text-teal-400 block font-bold mb-1">// Modelo Histórico AR({arOrder}) + \u0394F:</span>
                {coefficientsHistoric.map((coef, i) => {
                  const label = i === arOrder ? 'E_t (Símulo)' : i === arOrder + 1 ? '\u0394F_t (Memória Oculta)' : i === arOrder + 2 ? 'Bias (Intercepto)' : `S_{t-${i + 1}} (Lag ${i + 1})`;
                  return (
                    <div key={i} className="flex justify-between py-0.5 border-b border-slate-900">
                      <span>{label}</span>
                      <span className="font-bold font-mono text-slate-200">{coef.toFixed(5)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
