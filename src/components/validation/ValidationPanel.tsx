/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import { 
  CheckCircle, AlertCircle, Play, Download, RefreshCw, BarChart2, ShieldAlert,
  HelpCircle, ChevronRight, Info, Layers, Grid, FileSpreadsheet, Image
} from 'lucide-react';
import { runValidationTest } from '../../validation/ValidationSuite';
import { ghostResidualTest } from '../../validation/tests/ghostResidual.test';
import { cloneDivergenceTest } from '../../validation/tests/cloneDivergence.test';
import { noiseRobustnessTest } from '../../validation/tests/noiseRobustness.test';
import { convertResultToCSV, downloadValidationAsset } from '../../validation/export';
import { runParameterSweep, convertSweepToCSV, SweepPoint } from '../../validation/SweepRunner';
import { ValidationRunResult } from '../../validation/types';

export default function ValidationPanel() {
  // Test suite running states
  const [isRunning, setIsRunning] = useState(false);
  const [currentTestName, setCurrentTestName] = useState('');
  const [progress, setProgress] = useState(0);
  const [failuresCount, setFailuresCount] = useState(0);
  const [testResults, setTestResults] = useState<ValidationRunResult[]>([]);
  const [allExceptions, setAllExceptions] = useState<{ test: string; rep: number; reason: string; timestamp: string }[]>([]);

  // Parameter sweep state
  const [isSweeping, setIsSweeping] = useState(false);
  const [sweepPoints, setSweepPoints] = useState<SweepPoint[]>([]);
  const [hoveredSweepPoint, setHoveredSweepPoint] = useState<SweepPoint | null>(null);

  const heatmapCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const testsList = useMemo(() => [
    ghostResidualTest,
    cloneDivergenceTest,
    noiseRobustnessTest
  ], []);

  // Run all tests sequentially
  const handleExecuteValidation = async () => {
    setIsRunning(true);
    setProgress(0);
    setFailuresCount(0);
    const results: ValidationRunResult[] = [];
    const exceptions: typeof allExceptions = [];

    for (let idx = 0; idx < testsList.length; idx++) {
      const test = testsList[idx];
      setCurrentTestName(test.name);
      setProgress(Math.floor((idx / testsList.length) * 100));

      const res = await runValidationTest(test);
      results.push(res);

      if (res.failures.length > 0) {
        setFailuresCount(prev => prev + res.failures.length);
        res.failures.forEach(f => {
          exceptions.push({
            test: test.name,
            rep: f.repetition,
            reason: f.reason,
            timestamp: f.timestamp
          });
        });
      }
      setProgress(Math.floor(((idx + 1) / testsList.length) * 100));
    }

    setTestResults(results);
    setAllExceptions(exceptions);
    setIsRunning(false);
    setCurrentTestName('');
  };

  // Run Parameter Sweep
  const handleExecuteSweep = () => {
    setIsSweeping(true);
    // Base parameters used for the sweep
    const baseParams = {
      m: 1.0,
      gamma: 0.15, // standard default
      potential: 'double_well' as const,
      alpha: 1.2,
      eta: 0.4,
      V_height: 0.7
    };

    // run sweep (computationally optimized and deterministic)
    setTimeout(() => {
      const points = runParameterSweep(baseParams);
      setSweepPoints(points);
      setIsSweeping(false);
    }, 100);
  };

  // Download Sweep CSV
  const handleDownloadSweepCSV = () => {
    if (sweepPoints.length === 0) return;
    const csvContent = convertSweepToCSV(sweepPoints);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    downloadValidationAsset(csvContent, `sweep_stability_${timestamp}.csv`, 'text/csv');
  };

  // Render heatmap on canvas when sweepPoints update
  useEffect(() => {
    if (sweepPoints.length === 0 || !heatmapCanvasRef.current) return;
    const canvas = heatmapCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Grid sizes: Betas in [0, 5] (11 steps), TauHs in [1, 20] (20 steps)
    const betas = [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
    const tauHs = Array.from({ length: 20 }, (_, i) => i + 1);

    const cellW = width / betas.length;
    const cellH = height / tauHs.length;

    // Find max value for color normalization
    const maxVal = Math.max(...sweepPoints.map(p => p.residualEnergy)) || 1;

    sweepPoints.forEach(p => {
      const bIdx = betas.indexOf(p.beta);
      // tauH is 1-indexed (1 to 20)
      const tIdx = tauHs.indexOf(p.tauH);

      if (bIdx !== -1 && tIdx !== -1) {
        const u = p.residualEnergy / maxVal; // Normalized [0, 1]
        
        // Custom hot/cold plasma color scale
        const r = Math.floor(15 + u * 150);
        const g = Math.floor(23 + u * 40);
        const b = Math.floor(42 + u * 210);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.4 + u * 0.6})`;
        ctx.fillRect(bIdx * cellW, (tauHs.length - 1 - tIdx) * cellH, cellW - 1, cellH - 1);
      }
    });
  }, [sweepPoints]);

  // Export Heatmap Image as PNG
  const handleDownloadSweepPNG = () => {
    if (!heatmapCanvasRef.current || sweepPoints.length === 0) return;
    const canvas = heatmapCanvasRef.current;
    
    // Create high-res download
    const link = document.createElement('a');
    link.download = `stability_sweep_heatmap_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleDownloadTestJSON = (result: ValidationRunResult) => {
    const jsonStr = JSON.stringify(result, null, 2);
    const timestamp = result.metadata.timestamp.replace(/[:.]/g, '-');
    downloadValidationAsset(jsonStr, `validation_${result.id}_${timestamp}.json`, 'application/json');
  };

  const handleDownloadTestCSV = (result: ValidationRunResult) => {
    const csvStr = convertResultToCSV(result);
    const timestamp = result.metadata.timestamp.replace(/[:.]/g, '-');
    downloadValidationAsset(csvStr, `validation_${result.id}_${timestamp}.csv`, 'text/csv');
  };

  return (
    <div className="flex flex-col gap-6" id="validation-tab">
      
      {/* Introduction Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-100 font-display flex items-center gap-2">
            🧪 Painel de Validação Científica v2.1
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Estrutura unificada de testes falsificáveis de dinâmica não-linear e memória profunda. 
            Permite medir, documentar e exportar de forma reprodutível relatórios estatísticos comparando o modelo acoplado a controles Markovianos vazios.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExecuteValidation}
            disabled={isRunning || isSweeping}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wide flex items-center gap-1.5 transition ${
              isRunning 
                ? 'bg-slate-800 text-zinc-500 cursor-not-allowed'
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-950/20 active:scale-95'
            }`}
            id="run-validation-btn"
          >
            <RefreshCw size={14} className={isRunning ? 'animate-spin' : ''} />
            {isRunning ? 'Validando...' : 'Rodar Suite Básica'}
          </button>
        </div>
      </div>

      {/* Progress status bar */}
      {isRunning && (
        <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5 text-violet-400">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
              Executando: <strong>{currentTestName}</strong>
            </span>
            <span>{progress}% Concluído</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div className="bg-violet-500 h-1.5 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Core Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Validation Results Segment (8 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex justify-between items-center bg-slate-950/40 px-3 py-1 rounded border border-slate-900">
            <span className="text-xs font-bold text-slate-300 font-display">Resultados Recentes de Falsificação</span>
            {failuresCount > 0 && (
              <span className="text-[10px] font-mono text-amber-500 bg-amber-950/20 px-1.5 py-0.5 rounded border border-amber-900 flex items-center gap-1">
                <ShieldAlert size={10} /> {failuresCount} Anomalias Registradas
              </span>
            )}
          </div>

          {testResults.length === 0 ? (
            <div className="bg-slate-900/20 border border-dashed border-slate-850 rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-full text-zinc-500">
                <Layers size={32} />
              </div>
              <p className="text-xs text-zinc-400 max-w-md">
                Nenhuma execução realizada. Clique em <strong>“Rodar Suite Básica”</strong> no topo para iniciar os testes automatizados com perturbação estocástica controlada.
              </p>
            </div>
          ) : (
            testResults.map((res) => (
              <div key={res.id} className="bg-slate-900 border border-slate-850 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-display">
                      {res.metrics.every(m => m.passed) ? (
                        <CheckCircle size={15} className="text-emerald-500" />
                      ) : (
                        <AlertCircle size={15} className="text-red-500" />
                      )}
                      {res.name}
                    </h3>
                    <div className="flex gap-2 items-center mt-1 text-[9px] font-mono text-zinc-500">
                      <span>Ref: <strong>{res.id}</strong></span>
                      <span>•</span>
                      <span>Semente: <strong>{res.metadata.seed_base}</strong></span>
                      <span>•</span>
                      <span>Passes: <strong>{res.metadata.repetitions - res.failures.length}/{res.metadata.repetitions}</strong></span>
                    </div>
                  </div>

                  {/* Export Trigger items */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDownloadTestJSON(res)}
                      className="p-1.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-zinc-400 rounded text-[10px] font-mono flex items-center gap-1 transition"
                      title="Exportar Relatório Completo (JSON)"
                    >
                      <Download size={10} /> JSON
                    </button>
                    <button
                      onClick={() => handleDownloadTestCSV(res)}
                      className="p-1.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-zinc-400 rounded text-[10px] font-mono flex items-center gap-1 transition"
                      title="Salvar Planilha de Resultados (CSV)"
                    >
                      <Download size={10} /> CSV
                    </button>
                  </div>
                </div>

                {/* Metrics detail table */}
                <div className="overflow-x-auto border border-slate-900 rounded bg-slate-950/60 m-0.5">
                  <table className="w-full text-left text-[10px] font-mono text-zinc-300">
                    <thead className="bg-slate-950/80 text-[9px] text-zinc-400 uppercase tracking-wide border-b border-slate-900">
                      <tr>
                        <th className="p-2">Variável Métrica</th>
                        <th className="p-2 text-right">Controle (μ ± σ)</th>
                        <th className="p-2 text-right">Experimental (μ ± σ)</th>
                        <th className="p-2 text-right">Delta %</th>
                        <th className="p-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {res.metrics.map((m) => (
                        <tr key={m.metric} className="hover:bg-slate-900/30">
                          <td className="p-2 font-bold text-slate-300 uppercase">{m.metric.replace('_', ' ')}</td>
                          <td className="p-2 text-right text-zinc-400">{m.control_mean} <span className="text-[8px] text-zinc-650">± {m.control_std}</span></td>
                          <td className="p-2 text-right text-violet-300">{m.experimental_mean} <span className="text-[8px] text-zinc-650">± {m.experimental_std}</span></td>
                          <td className={`p-2 text-right font-bold ${m.delta_percent > 0 ? 'text-emerald-500' : 'text-zinc-500'}`}>
                            {m.delta_percent > 0 ? '+' : ''}{m.delta_percent}%
                          </td>
                          <td className="p-2 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                              m.passed ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-red-950/40 text-red-400 border border-red-900/30'
                            }`}>
                              {m.passed ? 'APROVADO' : 'REJEITADO'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}

          {/* Exceptions Segment (inside list of failures) */}
          {allExceptions.length > 0 && (
            <div className="bg-slate-950 border border-amber-900/30 p-4 rounded-xl flex flex-col gap-2">
              <span className="text-[10px] text-amber-500 font-mono font-bold uppercase flex items-center gap-1">
                ⚠️ LOG DE INSTABILIDADES E FALHAS
              </span>
              <div className="divide-y divide-slate-900 max-h-48 overflow-y-auto">
                {allExceptions.map((ex, i) => (
                  <div key={i} className="py-2 text-[10px] font-mono text-zinc-400 flex flex-col gap-0.5">
                    <div className="flex justify-between text-[9px] text-zinc-500">
                      <span>Teste: <strong className="text-zinc-400">{ex.test}</strong> (Rep #{ex.rep})</span>
                      <span>{ex.timestamp}</span>
                    </div>
                    <span className="text-amber-400">{ex.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2D Parameter Sweep (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex justify-between items-center bg-slate-950/40 px-3 py-1 rounded border border-slate-900">
            <span className="text-xs font-bold text-slate-300 font-display">Mapa de Estabilidade de Parâmetros (β, τ)</span>
          </div>

          <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col gap-4" id="sweep-card">
            <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">
              Executa uma varredura bidimensional de acoplamento <strong className="text-violet-400">β ∈ [0, 5]</strong> e relaxamento <strong className="text-violet-400">τ ∈ [1, 20]</strong>, integrando 220 simulações com RK4 para mapear as regiões de atrator biestável com memória fásica persistente.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleExecuteSweep}
                disabled={isSweeping || isRunning}
                className={`flex-1 py-1.5 rounded text-xs font-mono font-bold uppercase transition flex items-center justify-center gap-1.5 ${
                  isSweeping 
                    ? 'bg-slate-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg active:scale-95'
                }`}
                id="run-sweep-btn"
              >
                <Grid size={13} />
                {isSweeping ? 'Varrendo Espaço...' : 'Calcular Varredura 2D'}
              </button>
            </div>

            {sweepPoints.length > 0 && (
              <div className="flex flex-col gap-3 items-center">
                
                {/* Custom glowing canvas container */}
                <div className="relative border border-slate-800 rounded bg-slate-950 p-2">
                  <canvas 
                    ref={heatmapCanvasRef} 
                    width={220} 
                    height={160} 
                    className="w-full h-auto aspect-[11/8] bg-slate-950 cursor-crosshair"
                    id="stability-heatmap-canvas"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;

                      // Map click back to point
                      const betas = [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
                      const tauHs = Array.from({ length: 20 }, (_, i) => i + 1);

                      const bIdx = Math.floor((x / rect.width) * betas.length);
                      const tIdx = Math.floor(((rect.height - y) / rect.height) * tauHs.length);

                      const selBeta = betas[Math.max(0, Math.min(betas.length - 1, bIdx))];
                      const selTauH = tauHs[Math.max(0, Math.min(tauHs.length - 1, tIdx))];

                      const match = sweepPoints.find(p => p.beta === selBeta && p.tauH === selTauH);
                      if (match) setHoveredSweepPoint(match);
                    }}
                    onMouseLeave={() => setHoveredSweepPoint(null)}
                  />

                  {/* Horizontal and Vertical Labels */}
                  <div className="flex justify-between text-[8px] font-mono text-zinc-500 mt-1 px-1">
                    <span>β = 0.0 (Markov)</span>
                    <span>β = 5.0 (Histórico)</span>
                  </div>
                </div>

                {/* Hover overlay data */}
                <div className="w-full bg-slate-950/60 p-2 border border-slate-850 rounded text-[10px] font-mono min-h-[48px] flex flex-col justify-center">
                  {hoveredSweepPoint ? (
                    <div className="grid grid-cols-3 text-center text-zinc-300">
                      <div>β = <strong className="text-violet-400">{hoveredSweepPoint.beta}</strong></div>
                      <div>τ_H = <strong className="text-violet-400">{hoveredSweepPoint.tauH}s</strong></div>
                      <div className="text-right">E_res = <strong className="text-emerald-400">{hoveredSweepPoint.residualEnergy}</strong></div>
                    </div>
                  ) : (
                    <span className="text-zinc-500 text-center block">Passe o cursor sobre o mapa 2D acima para inspecionar</span>
                  )}
                </div>

                {/* Export control items */}
                <div className="flex gap-2 w-full">
                  <button
                    onClick={handleDownloadSweepCSV}
                    className="flex-1 py-1 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-zinc-400 rounded text-[10px] font-mono flex items-center justify-center gap-1 transition"
                  >
                    <FileSpreadsheet size={11} /> Salvar CSV
                  </button>
                  <button
                    onClick={handleDownloadSweepPNG}
                    className="flex-1 py-1 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-zinc-400 rounded text-[10px] font-mono flex items-center justify-center gap-1 transition"
                  >
                    <Image size={11} /> Salvar PNG
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
