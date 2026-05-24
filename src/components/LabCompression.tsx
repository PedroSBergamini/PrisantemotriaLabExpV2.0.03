/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Network, Activity, Filter, Eye, Cpu, BookOpen, Layers } from 'lucide-react';
import { SystemParameters, PhaseSweepPoint } from '../types';
import { runSimulation } from '../simulator/ode';
import { evaluateMarkovianFit, findMinimumEmbeddingDimension } from '../simulator/baselines';

export default function LabCompression() {
  const [params, setParams] = useState<SystemParameters>({
    m: 1.0,
    gamma: 0.15,
    potential: 'double_well',
    beta: 1.0,
    tauH: 3.0,
    alpha: 0.8,
    eta: 0.2,
    V_height: 0.6,
  });

  // Slider controls of tolerance epsilon
  const [epsilon, setEpsilon] = useState<number>(0.004);

  // Dynamic order Limit parameter for embedding
  const [maxOrder, setMaxOrder] = useState<number>(10);

  // Helper sweep function: computes a 10 x 10 grid of the parameter space beta vs tauH
  const phaseSweep = useMemo(() => {
    const gridRes = 10;
    const betaArr = Array(gridRes).fill(0).map((_, i) => 0.1 + (i / (gridRes - 1)) * 2.2); // beta from 0.1 to 2.3
    const tauHArr = Array(gridRes).fill(0).map((_, i) => 0.5 + (i / (gridRes - 1)) * 6.5); // tauH from 0.5 to 7.0

    const grid: PhaseSweepPoint[][] = [];

    for (let r = 0; r < gridRes; r++) {
      const row: PhaseSweepPoint[] = [];
      const beta = betaArr[r];

      for (let c = 0; c < gridRes; c++) {
        const tauH = tauHArr[c];

        // Evaluate single small run simulation
        const pMod: SystemParameters = { ...params, beta, tauH };
        const simData = runSimulation(pMod, 'sine', 1.1, 0.12, 12, 0.05); // concise simulation duration for speed

        // Get analytical fit index
        const { metrics } = evaluateMarkovianFit(simData, 2);
        
        // Find minimum embedding order
        const kStar = findMinimumEmbeddingDimension(simData, metrics.errHistoric, epsilon, maxOrder);

        row.push({
          beta: Number(beta.toFixed(3)),
          tauH: Number(tauH.toFixed(3)),
          phi: metrics.phi,
          clonesDivergence: 0,
          hysteresisArea: 0,
          kStar
        });
      }
      grid.push(row);
    }
    return { grid, betaArr, tauHArr };
  }, [params, epsilon, maxOrder]);

  // Compute curve of k*(epsilon) vs tauH over a slice with fixed beta
  const kStarCurve = useMemo(() => {
    const pointsCount = 12;
    const tauHArr = Array(pointsCount).fill(0).map((_, i) => 0.5 + (i / (pointsCount - 1)) * 8.0);
    
    return tauHArr.map((tauH) => {
      const pMod: SystemParameters = { ...params, tauH };
      const simData = runSimulation(pMod, 'bistable', 1.0, 0.12, 20, 0.05);
      const { metrics } = evaluateMarkovianFit(simData, 2);
      const kStar = findMinimumEmbeddingDimension(simData, metrics.errHistoric, epsilon, maxOrder);
      return {
        tauH: Number(tauH.toFixed(3)),
        kStar,
        phi: metrics.phi
      };
    });
  }, [params, epsilon, maxOrder]);

  // Draw Heatmap of Phase Sweep S(beta, tauH) using premium color mapping gradients
  const svgW = 320;
  const svgH = 320;

  const phaseHeatmap = useMemo(() => {
    const { grid, betaArr, tauHArr } = phaseSweep;
    const gridRes = grid.length;
    
    const boxW = (svgW - 40) / gridRes;
    const boxH = (svgH - 40) / gridRes;

    const heatboxes: React.ReactNode[] = [];

    // Map rows = beta, cols = tauH
    for (let r = 0; r < gridRes; r++) {
      for (let c = 0; c < gridRes; c++) {
        const pt = grid[r][c];
        const phi = Math.max(0, pt.phi); // positive bounds
        
        // Color mapping: 
        // 0 -> #0f172a (dark)
        // 0.5 -> #2563eb (blue)
        // 1.0 -> #10b981 (emerald)
        let color = 'rgba(15, 23, 42, 0.9)';
        if (phi > 0.05) {
          const intensityHex = Math.floor(Math.min(1, phi) * 255);
          color = `rgba(16, 185, 129, ${phi})`; // Opacity representation
        }

        const boxX = 30 + c * boxW;
        const boxY = svgH - 30 - (r + 1) * boxH;

        heatboxes.push(
          <rect
            key={`heat-${r}-${c}`}
            x={boxX}
            y={boxY}
            width={boxW - 1}
            height={boxH - 1}
            fill={color}
            className="hover:stroke-cyan-400 hover:stroke-2 cursor-pointer transition-all duration-75"
            stroke="#1e293b"
            strokeWidth={0.5}
          >
            <title>Acopl. B={pt.beta} | Mem. T={pt.tauH}s | \u03A6={pt.phi.toFixed(4)} | k*={pt.kStar}</title>
          </rect>
        );
      }
    }

    return (
      <svg className="w-full h-full bg-slate-950 rounded flex" viewBox={`0 0 ${svgW} ${svgH}`} id="phase-heatmap-svg">
        {/* Render heat cells */}
        {heatboxes}
        
        {/* Draw border */}
        <rect x={30} y={10} width={svgW - 40} height={svgH - 40} fill="none" stroke="#334155" strokeWidth={1} />

        {/* Vertical Axis labels (beta) */}
        <text x={24} y={30} className="fill-slate-500 text-[8px] font-mono" textAnchor="end">B_max</text>
        <text x={24} y={svgH - 35} className="fill-slate-500 text-[8px] font-mono" textAnchor="end">B_min</text>
        <text x={12} y={svgH / 2} className="fill-zinc-400 text-[9px] font-mono [writing-mode:vertical-lr] origin-center -rotate-180" textAnchor="middle">
          Acoplamento Histórico (&beta;)
        </text>

        {/* Horizontal Axis labels (tauH) */}
        <text x={35} y={svgH - 12} className="fill-slate-500 text-[8px] font-mono">T_min</text>
        <text x={svgW - 45} y={svgH - 12} className="fill-slate-500 text-[8px] font-mono">T_max</text>
        <text x={svgW / 2 + 10} y={svgH - 4} className="fill-zinc-400 text-[9px] font-mono" textAnchor="middle">
          Tempo de Relaxação (\u03C4_H)
        </text>
      </svg>
    );
  }, [phaseSweep]);

  // Draw kStar vs tauH projection curve
  const kStarPlotSvg = useMemo(() => {
    if (!kStarCurve.length) return null;
    const padding = 25;
    const getX = (t: number) => padding + ((t - kStarCurve[0].tauH) / (kStarCurve[kStarCurve.length - 1].tauH - kStarCurve[0].tauH)) * (svgW - 2 * padding);
    const getY = (k: number) => svgH - padding - (k / maxOrder) * (svgH - 2 * padding);

    let path = '';
    kStarCurve.forEach((p, index) => {
      const x = getX(p.tauH);
      const y = getY(p.kStar);
      if (index === 0) {
        path = `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });

    return (
      <svg className="w-full h-full bg-slate-950/80 rounded" viewBox={`0 0 ${svgW} ${svgH}`} id="kstar-plot-svg">
        <line x1={padding} y1={svgH - padding} x2={svgW} y2={svgH - padding} stroke="#334155" />
        <line x1={padding} y1={0} x2={padding} y2={svgH - padding} stroke="#334155" />

        {/* Grid lines for order labels */}
        {Array(maxOrder).fill(0).map((_, i) => {
          const y = getY(i + 1);
          return (
            <g key={`gy-${i}`}>
              <line x1={padding} y1={y} x2={svgW} y2={y} stroke="#1e293b" strokeDasharray="2 2" />
              <text x={18} y={y + 3} className="fill-slate-500 text-[8px] font-mono">{i + 1}</text>
            </g>
          );
        })}

        <path d={path} fill="none" stroke="#8b5cf6" strokeWidth={1.8} />

        {/* Scatter points dots */}
        {kStarCurve.map((pt, idx) => (
          <circle
            key={`dot-${idx}`}
            cx={getX(pt.tauH)}
            cy={getY(pt.kStar)}
            r={3.5}
            fill="#a78bfa"
            className="hover:r-5 cursor-pointer"
          >
            <title>Tempo={pt.tauH}s | k*={pt.kStar}</title>
          </circle>
        ))}

        <text x={svgW / 2} y={svgH - 4} className="fill-zinc-400 text-[9px] font-mono text-center" textAnchor="middle">
          Memory characteristics scale \u03C4_H
        </text>
        <text x={8} y={15} className="fill-violet-400 text-[8px] font-mono font-bold">
          [Dimensão de Embedding k*]
        </text>
      </svg>
    );
  }, [kStarCurve, maxOrder]);

  return (
    <div className="flex flex-col gap-6" id="compression-tab">
      
      {/* Explanation Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-2 relative overflow-hidden" id="compression-explainer">
        <div className="absolute right-[-15px] top-[-15px] p-6 bg-violet-950/20 text-[#8b5cf6] rounded-full">
          <BookOpen size={45} className="opacity-15" />
        </div>
        <h2 className="text-sm font-semibold text-slate-100 font-display flex items-center gap-1.5 leading-tight">
          <Layers size={17} className="text-violet-400 animate-pulse" />
          Módulo de Compressibilidade v1.2 & Análise de Margem Crítica de Memória
        </h2>
        <p className="text-xs text-zinc-300 leading-relaxed max-w-[90%]">
          <strong>A Pergunta Crucial do Código de Rigor Científico:</strong> Se aumentarmos a dimensão do estado markoviano linear para ordens muito elevadas, o valor de memória explicativo $\Delta F$ colapsa em redundância? No gráfico de embedding $k^*$, medimos exatamente qual é o menor estado representacional markoviano $S' = (S, h_1, h_2, \dots, h_k)$ necessário para compensar o desaparecimento de $\Delta F$ dentro de uma fidelidade de tolerância $\epsilon$.
        </p>
      </div>

      {/* Grid of sweeps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Controls Card Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4" id="compression-settings">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Filter className="text-violet-400" size={17} />
            <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wide">Filtros de Compressibilidade</h3>
          </div>

          {/* Slider for precision epsilon */}
          <div className="flex flex-col gap-1 bg-slate-950 p-3 rounded-lg border border-slate-850">
            <label className="text-xs font-mono text-zinc-300 flex justify-between">
              <span>Tolerância de Precisão (&epsilon;):</span>
              <span className="text-cyan-400 font-bold">{epsilon.toExponential(3)}</span>
            </label>
            <input
              type="range"
              id="epsilon-slider"
              min={0.001}
              max={0.02}
              step={0.001}
              value={epsilon}
              onChange={(e) => setEpsilon(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded accent-cyan-400 cursor-pointer"
            />
            <span className="text-[8px] text-zinc-500 leading-normal mt-1 block">
              *Controla o limite de erro residual aceito para o modelo AR aproximador ser considerado idêntico.
            </span>
          </div>

          {/* Slider for limits */}
          <div className="flex flex-col gap-1 bg-slate-950 p-3 rounded-lg border border-slate-850 mt-1">
            <label className="text-xs font-mono text-zinc-300 flex justify-between">
              <span>Limite da Ordem de Ajuste (Max p):</span>
              <span className="text-violet-400 font-bold">{maxOrder} lags</span>
            </label>
            <input
              type="range"
              id="max-order-slider"
              min={6}
              max={15}
              step={1}
              value={maxOrder}
              onChange={(e) => setMaxOrder(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded accent-violet-500 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-3.5 border-t border-slate-800 pt-3">
            <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase block tracking-wider">
              Análise de Escala Ótima:
            </span>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              O modelo prevê que a historicidade máxima (&Phi; alto) ocorre em tempos de memória equilibrados onde $\tau_H \sim \tau_S$. 
            </p>
            <div className="p-3 bg-violet-950/20 border border-violet-900/30 rounded flex items-center gap-2">
              <Eye className="text-violet-400 shrink-0" size={16} />
              <div className="flex flex-col text-[11px] leading-tight text-violet-300">
                <span className="font-bold">O Pico / Linha Crítica:</span>
                <span>Procure os blocos verdes brilhantes no mapa de fase: eles mostram as regiões críticas de pico causal!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic heatmap phase coordinates */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center gap-2" id="phase-heatmap-card">
          <div className="flex justify-between items-center w-full pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-200 font-display">Mapa de Fase Dinâmico &Phi;(&beta;, &tau;_H)</span>
            <span className="text-[9px] text-emerald-400 font-mono px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/50 uppercase font-bold">
              Grid Sweep Real
            </span>
          </div>
          <div className="w-[300px] h-[300px] mt-2" id="heatmap-plot-container">
            {phaseHeatmap}
          </div>
          <p className="text-[9px] text-slate-500 font-mono text-center leading-relaxed">
            *Passe o mouse por cima de cada célula para revelar os dados exatos calculados em tempo de execução.
          </p>
        </div>

        {/* Dynamic kStar plot projection lines */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center gap-2" id="kstar-plot-card">
          <div className="flex justify-between items-center w-full pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-200 font-display">Irredução: Dimensão Mínima k* vs &tau;_H</span>
            <span className="text-[9px] text-[#a78bfa] font-mono px-1.5 py-0.5 rounded bg-violet-950/40 border border-violet-900/50 uppercase font-bold">
              k*(Epsilon)
            </span>
          </div>
          <div className="w-[300px] h-[300px] mt-2" id="kstar-plot-container">
            {kStarPlotSvg}
          </div>
          <p className="text-[9px] text-zinc-500 font-mono text-center leading-relaxed">
            *Conforme $\tau_H$ (tempo de relaxação da memória) atinge a zona crítica, a ordem $k^*$ necessária para Markov mimetizar explode.
          </p>
        </div>

      </div>

    </div>
  );
}
