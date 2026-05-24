/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Cpu, RefreshCw, Layers, Server, Activity, HelpCircle } from 'lucide-react';
import { SystemParameters, StimulusType } from '../types';
import { runSimulation } from '../simulator/ode';
import { EchoStateNetwork } from '../simulator/esn';

export default function LabReservoir() {
  // Model Parameters for Coupled System S <-> \Delta F
  const [params, setParams] = useState<SystemParameters>({
    m: 1.0,
    gamma: 0.15,
    potential: 'double_well',
    beta: 1.2,  // Strong historical force
    tauH: 4.0,  // Slow memory relaxation
    alpha: 1.0,
    eta: 0.3,
    V_height: 0.6,
  });

  const [stimType, setStimType] = useState<StimulusType>('chirp'); // Chirps really challenge reservoir echo state mapping
  const [amp, setAmp] = useState(1.2);
  const [freq, setFreq] = useState(0.08);

  // ESN Hyperparameters
  const [esnSize, setEsnSize] = useState<number>(16); // 16 nodes fits beautifully on graphical diagrams
  const [spectralRadius, setSpectralRadius] = useState<number>(0.92);
  const [leakage, setLeakage] = useState<number>(0.4);

  // Scanner state of simulation timestep to inspect reservoir activations
  const [inspectIndex, setInspectIndex] = useState<number>(100);

  // Generate data
  const data = useMemo(() => {
    return runSimulation(params, stimType, amp, freq, 30, 0.05);
  }, [params, stimType, amp, freq]);

  // Train and run ESN
  const esnResult = useMemo(() => {
    const esn = new EchoStateNetwork(esnSize, spectralRadius, leakage);
    return esn.trainAndRun(data);
  }, [data, esnSize, spectralRadius, leakage]);

  const { predictions, states, mse, readoutWeights } = esnResult;

  // Sync index boundaries safely
  const maxInspectIndex = Math.max(0, predictions.length - 2);
  const safeInspectIdx = Math.min(inspectIndex, maxInspectIndex);

  // Custom Plotting dimensions
  const rW = 500;
  const rH = 170;

  // Render prediction comparison curves (Actual vs ESN prediction)
  const predictionChart = useMemo(() => {
    if (!predictions.length) return null;
    const padding = 20;

    const maxVal = Math.max(...data.map(d => Math.abs(d.S))) || 1;
    const getX = (t: number) => padding + (t / 30) * (rW - 2 * padding);
    const getY = (v: number) => rH / 2 - (v / (maxVal * 1.15)) * (rH / 2 - padding);

    let pathActual = '';
    let pathESN = '';

    data.forEach((p, index) => {
      const x = getX(p.t);
      const yAct = getY(p.S);
      const yE = getY(predictions[index] !== undefined ? predictions[index] : p.S);

      if (index === 0) {
        pathActual = `M ${x} ${yAct}`;
        pathESN = `M ${x} ${yE}`;
      } else {
        pathActual += ` L ${x} ${yAct}`;
        pathESN += ` L ${x} ${yE}`;
      }
    });

    // Mark current vertical inspector line
    const inspectT = data[safeInspectIdx]?.t || 0;
    const verticalX = getX(inspectT);

    return (
      <svg className="w-full h-full bg-slate-950/80 rounded" viewBox={`0 0 ${rW} ${rH}`} id="esn-preds-svg">
        <line x1={0} y1={rH / 2} x2={rW} y2={rH / 2} stroke="#334155" strokeDasharray="3 3" />
        
        {/* Inspection guide vertical line */}
        <line x1={verticalX} y1={0} x2={verticalX} y2={rH} stroke="#06b6d4" strokeWidth={1.5} strokeDasharray="4 4" strokeOpacity={0.6} />

        {/* Actual state */}
        <path d={pathActual} fill="none" stroke="#f1f5f9" strokeWidth={1.8} strokeOpacity={0.8} />

        {/* Reservoir Echo predictions */}
        <path d={pathESN} fill="none" stroke="#06b6d4" strokeWidth={1.2} />

        <g transform={`translate(${rW - 170}, 15)`} className="text-[9px] font-mono fill-zinc-300">
          <circle cx={5} cy={-2} r={3} fill="#f1f5f9" fillOpacity={0.8} />
          <text x={12} y={1}>S Real (Simulado)</text>

          <circle cx={5} cy={10} r={3} fill="#06b6d4" />
          <text x={12} y={13}>Previsão ESN (Reservoir)</text>
          
          <line x1={0} y1={22} x2={10} y2={22} stroke="#06b6d4" strokeWidth={1.5} strokeDasharray="2 2" />
          <text x={12} y={25}>Índice Escolhido t={inspectT.toFixed(2)}s</text>
        </g>
      </svg>
    );
  }, [predictions, data, safeInspectIdx]);

  // Visual layout representing the structural Echo State Network (topological circle coordinates)
  const reservoirNetGraph = useMemo(() => {
    const sizeGraph = 220;
    const centerX = sizeGraph / 2;
    const centerY = sizeGraph / 2;
    const radius = sizeGraph / 2 - 30;

    // Arrange nodes on a circle
    const nodeCoords = Array(esnSize).fill(0).map((_, i) => {
      const theta = (i * 2 * Math.PI) / esnSize;
      return {
        id: i,
        x: centerX + radius * Math.cos(theta),
        y: centerY + radius * Math.sin(theta),
      };
    });

    // Draw lines representing recurrent links between arbitrary pairs.
    // For visual clarity, draw a subset of links (e.g., node i to i+1, i+3)
    const links: React.ReactNode[] = [];
    nodeCoords.forEach((node, i) => {
      const partners = [(i + 1) % esnSize, (i + 3) % esnSize];
      partners.forEach((partnerIdx) => {
        const target = nodeCoords[partnerIdx];
        links.push(
          <line
            key={`link-${i}-${partnerIdx}`}
            x1={node.x}
            y1={node.y}
            x2={target.x}
            y2={target.y}
            stroke="#1e293b"
            strokeWidth={1}
            strokeOpacity={0.65}
          />
        );
      });
    });

    // Node circles pulsing with current state values from states[safeInspectIdx]
    const stateValues = states[safeInspectIdx] || Array(esnSize).fill(0);

    const nodes = nodeCoords.map((node) => {
      const act = stateValues[node.id] || 0; // range [-1, 1]
      
      // Map activation value [-1, 1] to color:
      // positive is teal cyan, negative is hot deep coral red
      let fillVal = '#334155';
      if (act > 0.05) {
        fillVal = `rgba(6, 182, 212, ${Math.min(1.0, act)})`;
      } else if (act < -0.05) {
        fillVal = `rgba(239, 68, 68, ${Math.min(1.0, Math.abs(act))})`;
      }

      return (
        <g key={`node-gr-${node.id}`} className="transition-all duration-100 ease-out">
          <circle
            cx={node.x}
            cy={node.y}
            r={10 + Math.abs(act) * 3}
            fill={fillVal}
            stroke="#475569"
            strokeWidth={1}
          />
          <text
            x={node.x}
            y={node.y + 3}
            textAnchor="middle"
            className="fill-slate-100 text-[8px] font-mono leading-none select-none pointer-events-none"
          >
            {node.id}
          </text>
        </g>
      );
    });

    return (
      <div className="flex flex-col items-center justify-center p-4 bg-slate-950 border border-slate-850 rounded-lg">
        <span className="font-mono text-[10px] text-zinc-400 block mb-2 font-bold flex items-center gap-1.5 self-start uppercase">
          <Activity size={12} className="text-cyan-400" /> Ativações de Neurônios do Reservatório
        </span>
        <div className="relative">
          <svg width={sizeGraph} height={sizeGraph}>
            {links}
            {nodes}
          </svg>
        </div>
        <div className="flex gap-4 justify-center items-center text-[9px] mt-1 font-mono text-zinc-400">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 block" />
            <span>Ativação Positiva (+)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 block" />
            <span>Ativação Negativa (-)</span>
          </div>
        </div>
      </div>
    );
  }, [esnSize, states, safeInspectIdx]);

  return (
    <div className="flex flex-col gap-6" id="reservoir-tab">
      
      {/* Top dashboard stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="reservoir-dash">
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute right-[-10px] top-[-10px] p-4 bg-cyan-950/20 text-cyan-500 rounded-full">
            <Layers size={40} className="opacity-15" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wide">Erro Quadrático Médio ESN (MSE)</span>
            <h3 className="text-3xl font-extrabold text-cyan-400 font-display mt-1">
              {mse.toExponential(5)}
            </h3>
          </div>
          <p className="text-xs text-zinc-300 mt-2">
            Medida de precisão com que o reservatório de {esnSize} nós mimetiza a dinâmica não-markoviana com acoplamento histórico.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute right-[-10px] top-[-10px] p-4 bg-zinc-950/20 rounded-full">
            <Server size={40} className="opacity-15" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wide">Dimensão do Reservatório Recorrente</span>
            <h3 className="text-3xl font-extrabold text-[#38bdf8] font-display mt-1">
              N_R = {esnSize}
            </h3>
          </div>
          <p className="text-xs text-zinc-300 mt-2">
            Representa {esnSize} graus de liberdade recorrentes artificiais sintonizados pela constante de relaxamento temporal.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute right-[-10px] top-[-10px] p-4 bg-violet-950/20 rounded-full">
            <Cpu size={40} className="opacity-15" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wide">Raio Espectral (&rho;) & Escoamento</span>
            <h3 className="text-3xl font-extrabold text-violet-400 font-display mt-1">
              &rho; = {spectralRadius} | L = {leakage}
            </h3>
          </div>
          <p className="text-xs text-zinc-300 mt-2">
            Condiciona as escalas de atenuação das ondas internas de ativação pós-estímulo no lago neural.
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sliders panel for adjusting ESN neural config */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 mx-0" id="esn-sliders-card">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Cpu className="text-cyan-400" size={17} />
            <h2 className="text-sm font-semibold text-slate-100 font-display">Parâmetros do Reservatório</h2>
          </div>

          <div className="text-xs text-zinc-300 leading-relaxed bg-slate-950 p-3 rounded border border-slate-850">
            <strong>Reservoir Computing:</strong> Redes de estado de eco (ESN) fornecem uma representação de memória analógica distribuída ideal para mimetizar variáveis termodinâmicas ou viscoelásticas acopladas ($\Delta F$).
          </div>

          <div className="flex flex-col gap-3.5 mt-2">
            {/* Slider for esnSize */}
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex justify-between font-mono text-slate-400">
                <span>Neurônios no Reservatório (N_R)</span>
                <span className="text-cyan-400 font-bold">{esnSize}</span>
              </div>
              <input
                type="range"
                id="esn-size-slider"
                min={8}
                max={28}
                step={2}
                value={esnSize}
                onChange={(e) => setEsnSize(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Slider for spectral radius */}
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex justify-between font-mono text-slate-400">
                <span>Raio Espectral Estimado (&rho;)</span>
                <span className="text-cyan-400 font-bold">{spectralRadius}</span>
              </div>
              <input
                type="range"
                id="esn-radius-slider"
                min={0.1}
                max={1.5}
                step={0.05}
                value={spectralRadius}
                onChange={(e) => setSpectralRadius(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Slider for leakage */}
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex justify-between font-mono text-slate-400">
                <span>Taxa de Escoamento / Leakage (L)</span>
                <span className="text-cyan-400 font-bold">{leakage}</span>
              </div>
              <input
                type="range"
                id="esn-leakage-slider"
                min={0.1}
                max={1.0}
                step={0.05}
                value={leakage}
                onChange={(e) => setLeakage(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>

          {/* Time Scrubber */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex flex-col gap-2 mt-2">
            <span className="text-[10px] text-zinc-400 font-mono uppercase font-bold tracking-wider">
              Navegar no tempo (Simulação):
            </span>
            <div className="flex justify-between font-mono text-[10px] text-zinc-400">
              <span>passo: {safeInspectIdx}</span>
              <span>t: {(safeInspectIdx * 0.05).toFixed(2)}s</span>
            </div>
            <input
              type="range"
              id="time-scrubber-slider"
              min={0}
              max={maxInspectIndex}
              value={safeInspectIdx}
              onChange={(e) => setInspectIndex(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-805 rounded accent-cyan-400 cursor-pointer"
            />
            <span className="text-[8px] text-zinc-500 leading-tight">
              *Mova o scrubber para inspecionar as flutuações das cargas neuronais à direita.
            </span>
          </div>

        </div>

        {/* ESN prediction plots and network visual graph */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4" id="esn-charts-panel">
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3 md:col-span-2">
            <span className="text-xs font-semibold text-slate-200 font-display">Previsão Dinâmica por Computação de Reservatório</span>
            <div className="h-[170px] w-full" id="esn-predictions-chart-container">
              {predictionChart}
            </div>
          </div>

          {/* Recurrent activation map */}
          {reservoirNetGraph}

          {/* readout weights bar list */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-200 font-display font-mono block border-b border-slate-800 pb-1 uppercase text-[10px] tracking-wider text-cyan-400">
              Readout Weights Output Layers (W_out)
            </span>
            <div className="h-[200px] overflow-y-auto pr-1 flex flex-col gap-1 text-[10px] font-mono mt-1">
              {readoutWeights.slice(0, 16).map((w, index) => {
                const pct = Math.min(100, Math.floor(Math.abs(w) * 120)) || 2;
                const isPos = w >= 0;
                return (
                  <div key={index} id={`res-weight-${index}`} className="flex items-center gap-2 justify-between border-b border-slate-900/40 py-0.5">
                    <span className="text-slate-500 flex h-full">W_node_{index}</span>
                    <div className="flex-1 max-w-[120px] bg-slate-950 h-2 rounded overflow-hidden flex items-center">
                      <div
                        className={`h-full ${isPos ? 'bg-cyan-500' : 'bg-red-500'}`}
                        style={{ width: `${pct}%`, marginLeft: isPos ? '0' : 'auto' }}
                      />
                    </div>
                    <span className={`font-bold font-mono text-[10px] ${isPos ? 'text-cyan-400' : 'text-red-400'}`}>{w.toFixed(5)}</span>
                  </div>
                );
              })}
              {readoutWeights.length > 16 && (
                <div className="text-[9px] text-zinc-500 font-mono uppercase text-center py-1 font-semibold">
                  + {readoutWeights.length - 16} outros pesos readouts omitidos
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
