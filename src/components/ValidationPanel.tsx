/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import { 
  CheckCircle, AlertCircle, Play, Download, RefreshCw, BarChart2, ShieldAlert,
  HelpCircle, ChevronRight, Info, Layers, Grid, FileSpreadsheet, Image, Trash2, XCircle
} from 'lucide-react';
import { runValidationTest, runBatch, saveReportToHistory, exportFullReport } from '../validation/ValidationSuite';
import { ghostResidualTest } from '../validation/tests/ghostResidual.test';
import { cloneDivergenceTest } from '../validation/tests/cloneDivergence.test';
import { noiseRobustnessTest } from '../validation/tests/noiseRobustness.test';
import { convertResultToCSV, downloadValidationAsset } from '../validation/export';
import { runParameterSweep, convertSweepToCSV, SweepPoint } from '../validation/SweepRunner';
import { ValidationRunResult } from '../validation/types';
import { VALIDATION_PRESETS, ValidationPresetKey } from '../validation/presets';
import { EXPLORATION_PRESETS, ExplorationPresetKey } from '../exploration/presets';
import { adaptTestWithPreset } from '../validation/guards/autoStabilize';

export default function ValidationPanel() {
  // Test suite running states
  const [isRunning, setIsRunning] = useState(false);
  const [currentTestName, setCurrentTestName] = useState('');
  const [progress, setProgress] = useState(0);
  const [failuresCount, setFailuresCount] = useState(0);
  const [testResults, setTestResults] = useState<ValidationRunResult[]>([]);
  const [allExceptions, setAllExceptions] = useState<{ test: string; rep: number; reason: string; timestamp: string }[]>([]);

  // Batch configuration states (Tarefa 5)
  const [runsPerTest, setRunsPerTest] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('validation:runsPerTest');
      if (stored) {
        const val = Number(stored);
        if ([5, 10, 20, 50, 100].includes(val)) return val;
      }
      const legacyStored = localStorage.getItem('prisantemotria_lab_config');
      if (legacyStored) {
        const parsed = JSON.parse(legacyStored);
        if (typeof parsed.runsPerTest === 'number' && [5, 10, 20, 50, 100].includes(parsed.runsPerTest)) {
          return parsed.runsPerTest;
        }
      }
    } catch (e) {
      console.warn("Failed to load initial runs", e);
    }
    return 20;
  });
  const [selectedPreset, setSelectedPreset] = useState<'STANDARD' | 'ENHANCED' | 'STRESS'>('STANDARD');
  const [selectedTests, setSelectedTests] = useState<{ ghost: boolean; clone: boolean; noise: boolean }>({
    ghost: true,
    clone: true,
    noise: true
  });
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  
  // Progress tracker detail
  const [batchProgress, setBatchProgress] = useState<{
    testId: string;
    testName: string;
    currentRun: number;
    progressPercent: number;
    etaSeconds: number;
  } | null>(null);

  // Consolidated batch report output details
  const [batchReport, setBatchReport] = useState<any | null>(null);

  // Live timer states
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [completedSimulations, setCompletedSimulations] = useState<number>(0);
  const [totalSimulations, setTotalSimulations] = useState<number>(0);
  const timerRef = useRef<any>(null);
  const [warningsOpen, setWarningsOpen] = useState(false);

  // Epistemic Preset State Management
  const [activePresetType, setActivePresetType] = useState<'validation' | 'exploration'>('validation');
  const [activePresetKey, setActivePresetKey] = useState<string>('STANDARD');
  const [valPresetSelect, setValPresetSelect] = useState<string>('STANDARD');
  const [expPresetSelect, setExpPresetSelect] = useState<string>('NONE');

  // Load configuration from local storage on mount (Tarefa 13)
  useEffect(() => {
    try {
      const storedRuns = localStorage.getItem('validation:runsPerTest');
      if (storedRuns) {
        const val = Number(storedRuns);
        if ([5, 10, 20, 50, 100].includes(val)) {
          setRunsPerTest(val);
        }
      }

      const stored = localStorage.getItem('prisantemotria_lab_config');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!storedRuns && typeof parsed.runsPerTest === 'number' && [5, 10, 20, 50, 100].includes(parsed.runsPerTest)) {
          setRunsPerTest(parsed.runsPerTest);
        }
        if (parsed.selectedPreset && ['STANDARD', 'ENHANCED', 'STRESS'].includes(parsed.selectedPreset)) {
          setSelectedPreset(parsed.selectedPreset as 'STANDARD' | 'ENHANCED' | 'STRESS');
          setValPresetSelect(parsed.selectedPreset);
          setActivePresetKey(parsed.selectedPreset);
          setActivePresetType('validation');
          setExpPresetSelect('NONE');
        }
        if (parsed.selectedTests && typeof parsed.selectedTests === 'object') {
          setSelectedTests({
            ghost: parsed.selectedTests.ghost !== false,
            clone: parsed.selectedTests.clone !== false,
            noise: parsed.selectedTests.noise !== false,
          });
        }
      }
    } catch (e) {
      console.warn("Failed to load local config", e);
    }
  }, []);

  // Save configuration automatically when states change (Tarefa 13)
  useEffect(() => {
    try {
      const configObj = {
        runsPerTest,
        selectedPreset,
        selectedTests
      };
      localStorage.setItem('prisantemotria_lab_config', JSON.stringify(configObj));
      localStorage.setItem('validation:runsPerTest', String(runsPerTest));
    } catch (e) {
      console.warn("Failed to save local config", e);
    }
  }, [runsPerTest, selectedPreset, selectedTests]);

  const activePreset = useMemo(() => {
    if (activePresetType === 'validation') {
      return VALIDATION_PRESETS[activePresetKey as ValidationPresetKey] || VALIDATION_PRESETS.STANDARD;
    } else {
      return EXPLORATION_PRESETS[activePresetKey as ExplorationPresetKey] || EXPLORATION_PRESETS.EXTREME;
    }
  }, [activePresetType, activePresetKey]);

  const handleSelectValPreset = (val: string) => {
    if (val === 'NONE') {
      setValPresetSelect('NONE');
      if (expPresetSelect === 'NONE') {
        setValPresetSelect('STANDARD');
        setActivePresetType('validation');
        setActivePresetKey('STANDARD');
        setSelectedPreset('STANDARD');
      }
    } else {
      setValPresetSelect(val);
      setExpPresetSelect('NONE');
      setActivePresetType('validation');
      setActivePresetKey(val);
      if (val === 'STANDARD' || val === 'ENHANCED' || val === 'STRESS') {
        setSelectedPreset(val as 'STANDARD' | 'ENHANCED' | 'STRESS');
      }
    }
  };

  const handleSelectExpPreset = (val: string) => {
    if (val === 'NONE') {
      setExpPresetSelect('NONE');
      if (valPresetSelect === 'NONE') {
        setValPresetSelect('STANDARD');
        setActivePresetType('validation');
        setActivePresetKey('STANDARD');
        setSelectedPreset('STANDARD');
      }
    } else {
      setExpPresetSelect(val);
      setValPresetSelect('NONE');
      setActivePresetType('exploration');
      setActivePresetKey(val);
    }
  };

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

    const totalSims = testsList.length * runsPerTest;
    setTotalSimulations(totalSims);
    setCompletedSimulations(0);

    for (let idx = 0; idx < testsList.length; idx++) {
      const test = testsList[idx];
      setCurrentTestName(test.name);
      setProgress(Math.floor((idx / testsList.length) * 100));

      const { adaptedTest, warnings } = adaptTestWithPreset(test, activePreset);
      adaptedTest.repetitions = runsPerTest;
      const baseCompleted = idx * runsPerTest;
      const res = await runValidationTest(
        adaptedTest, 
        activePreset, 
        warnings,
        undefined,
        (repCount) => {
          setCompletedSimulations(baseCompleted + repCount);
        }
      );
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

  // Run full batch validation with config (Tarefa 5 & 6)
  const handleRunBatchValidation = async () => {
    setIsRunning(true);
    setBatchReport(null);
    setFailuresCount(0);
    setAllExceptions([]);
    setProgress(0);
    setElapsedSeconds(0);

    const controller = new AbortController();
    setAbortController(controller);

    // Filter tests selected
    const chosenTests: ('ghost' | 'clone' | 'noise')[] = [];
    if (selectedTests.ghost) chosenTests.push('ghost');
    if (selectedTests.clone) chosenTests.push('clone');
    if (selectedTests.noise) chosenTests.push('noise');

    if (chosenTests.length === 0) {
      alert("Por favor, selecione pelo menos um teste para rodar.");
      setIsRunning(false);
      return;
    }

    const totalSims = chosenTests.length * runsPerTest;
    setTotalSimulations(totalSims);
    setCompletedSimulations(0);

    // Live accumulated runtime timer (Tarefa 5 & 12)
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => parseFloat((prev + 0.1).toFixed(1)));
    }, 100);

    try {
      // If an exploratory preset is active, we run the batch with 'exploration' mode
      const activeEpistemicMode: 'validation' | 'exploration' = activePresetType === 'exploration' ? 'exploration' : 'validation';

      const config = {
        tests: chosenTests,
        runs: runsPerTest,
        preset: (activePresetType === 'exploration' ? 'STANDARD' : selectedPreset) as 'STANDARD' | 'ENHANCED' | 'STRESS',
        epistemic_mode: activeEpistemicMode
      };

      const report = await runBatch(
        config,
        controller.signal,
        (testId, testName, currentRun, progressPercent, etaSeconds) => {
          const testIdx = chosenTests.indexOf(testId as any);
          const completedSims = (testIdx !== -1 ? testIdx : 0) * runsPerTest + currentRun;
          setCompletedSimulations(completedSims);
          setBatchProgress({
            testId,
            testName,
            currentRun,
            progressPercent,
            etaSeconds
          });
          setProgress(progressPercent);
        }
      );

      // Save to report state
      setBatchReport(report);

      // Integrate into existing testResults format so other visualizers don't break
      const resultsArray: ValidationRunResult[] = [];
      if (report.results.ghost) resultsArray.push(report.results.ghost);
      if (report.results.clone) resultsArray.push(report.results.clone);
      if (report.results.noise) resultsArray.push(report.results.noise);
      setTestResults(resultsArray);

      // Save to history (Task 4)
      saveReportToHistory(report);

    } catch (err: any) {
      if (err.message === 'Simulation aborted' || controller.signal?.aborted) {
        console.log('Batch validation aborted by operator.');
      } else {
        console.error('Batch running exception:', err);
        alert(`Erro de execução: ${err.message}`);
      }
    } finally {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsRunning(false);
      setBatchProgress(null);
      setAbortController(null);
    }
  };

  const handleCancelBatch = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  const handleExportBatch = (format: 'json' | 'csv' | 'pdf') => {
    if (!batchReport) return;
    const content = exportFullReport(batchReport, format);
    const timestamp = batchReport.metadata.timestamp.replace(/[:.]/g, '-');
    
    let mimeType = 'text/plain';
    let ext = 'txt';
    if (format === 'json') {
      mimeType = 'application/json';
      ext = 'json';
    } else if (format === 'csv') {
      mimeType = 'text/csv';
      ext = 'csv';
    } else if (format === 'pdf') {
      mimeType = 'text/plain'; // downloaded as pdf text representing the document
      ext = 'pdf';
    }

    downloadValidationAsset(content, `validation_full_${timestamp}.${ext}`, mimeType);
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
  };  return (
    <div className="flex flex-col gap-6" id="validation-tab">
      
      {/* Introduction Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-100 font-display flex items-center gap-2">
            🧪 Painel de Validação Científica v2.2.1-Freeze
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Estrutura unificada de testes falsificáveis de dinâmica não-linear e memória profunda. 
            Permite medir, documentar e exportar de forma reprodutível relatórios estatísticos comparando o modelo acoplado a controles Markovianos vazios.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 h-9">
            <span className="text-[10px] sm:text-xs font-mono text-zinc-400 font-semibold whitespace-nowrap">
              Runs por teste:
            </span>
            <select
              value={runsPerTest}
              onChange={(e) => setRunsPerTest(Number(e.target.value))}
              disabled={isRunning}
              className="bg-transparent border-none text-slate-200 text-xs sm:text-xs font-mono outline-none cursor-pointer focus:ring-0"
              id="basic-suite-runs-picker"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-[10px] font-mono text-zinc-650 border-l border-slate-800 pl-2">
              ({3 * runsPerTest} simulações)
            </span>
          </div>

          <button
            onClick={handleExecuteValidation}
            disabled={isRunning || isSweeping}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wide flex items-center justify-center gap-1.5 transition h-9 min-w-[150px] ${
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

      {/* Epistemic Presets Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-200 font-display uppercase tracking-wide flex items-center gap-1.5">
              <Layers size={13} className="text-violet-400" /> Presets de Simulação e Controle
            </span>
            <p className="text-[11px] text-zinc-400 font-mono">
              Selecione presets científicos conservadores ou regimes experimentais exploratórios.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <div className="flex flex-col gap-1 w-full sm:w-48">
              <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase">Validação (Científico)</label>
              <select
                value={valPresetSelect}
                onChange={(e) => handleSelectValPreset(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded p-1.5 font-mono outline-none focus:border-violet-600 transition"
                id="validation-preset-select"
              >
                <option value="STANDARD">Standard Validation</option>
                <option value="ENHANCED">Enhanced Persistence</option>
                <option value="STRESS">STRESS (High-Memory)</option>
                <option value="NONE">Desativado</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 w-full sm:w-48">
              <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase">Exploração (Ilustrativo)</label>
              <select
                value={expPresetSelect}
                onChange={(e) => handleSelectExpPreset(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded p-1.5 font-mono outline-none focus:border-violet-600 transition"
                id="exploration-preset-select"
              >
                <option value="NONE">Desativado</option>
                <option value="EXTREME">Extreme Persistence</option>
                <option value="TRAUMA">Trauma Saturation</option>
                <option value="NOISE">Noise Robustness</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Alerts */}
        {activePresetType === 'validation' && activePresetKey === 'STRESS' && (
          <div className="bg-amber-950/20 border border-amber-900/50 text-amber-300 p-3 rounded-lg text-xs leading-relaxed font-mono flex items-center justify-between gap-3 animate-fade-in" id="stress-preset-warning-badge">
            <div className="flex items-center gap-2">
              <ShieldAlert size={14} className="text-amber-500 shrink-0" />
              <span><strong>⚠️ HIGH-MEMORY REGIME:</strong> regime de persistência estendida instável. Fora das margens do modelo físico padrão.</span>
            </div>
            <span className="bg-amber-900/40 text-amber-400 border border-amber-800/40 rounded px-2 py-0.5 text-[8px] font-bold uppercase shrink-0">⚠️ HIGH-MEMORY REGIME</span>
          </div>
        )}

        {activePresetType === 'exploration' && (
          <div className="bg-red-950/20 border border-red-900/50 text-red-200 p-3 rounded-lg text-xs leading-relaxed font-mono flex items-start gap-2 animate-fade-in" id="exploration-mode-banner">
            <ShieldAlert size={14} className="text-red-500 mt-0.5 shrink-0" />
            <div>
              <strong className="text-red-400 block uppercase tracking-wide">EXPLORATORY MODE — Not for scientific claims</strong>
              Simulação de limites não-lineares extremos ({activePreset.name}). Não deve ser usado como evidência científica de persistência de memória.
            </div>
          </div>
        )}
      </div>

      {/* Validation Execution Config Block - Tarefa 1, 2, 3 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 animate-fade-in" id="validation-execution-config">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-slate-100 font-display flex items-center gap-1.5">
            🧪 Validation Execution
          </h3>
          {selectedPreset === 'STRESS' && (
            <span 
              className="bg-amber-950/80 text-amber-400 border border-amber-805 rounded px-2 py-0.5 text-[10px] font-bold uppercase cursor-help animate-pulse"
              title="Extended persistence regime for stress-testing memory dynamics. Not representative of baseline validation conditions."
              id="stress-badge-tooltip"
            >
              ⚠️ HIGH-MEMORY REGIME
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
          
          {/* Dropdown Validation Preset & Badge (Tarefa 3) */}
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label className="text-zinc-400 font-mono text-xs font-semibold flex items-center gap-1">
              Validation Preset
            </label>
            <select
              value={selectedPreset}
              onChange={(e) => {
                const val = e.target.value as 'STANDARD' | 'ENHANCED' | 'STRESS';
                setSelectedPreset(val);
                // Sync main state
                setActivePresetKey(val);
                setActivePresetType('validation');
                setValPresetSelect(val);
                setExpPresetSelect('NONE');
              }}
              disabled={isRunning}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded p-2.5 font-mono outline-none focus:border-violet-600 transition w-full disabled:opacity-50"
              id="validation-preset-select-batch"
            >
              <option value="STANDARD">STANDARD</option>
              <option value="ENHANCED">ENHANCED</option>
              <option value="STRESS">STRESS</option>
            </select>
          </div>

          {/* Runs per test (Tarefa 1) */}
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label className="text-zinc-400 font-mono text-xs font-semibold flex items-center gap-1">
              Runs per test
            </label>
            <select
              value={runsPerTest}
              onChange={(e) => setRunsPerTest(Number(e.target.value))}
              disabled={isRunning}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded p-2.5 font-mono outline-none focus:border-violet-600 transition w-full disabled:opacity-50"
              id="batch-runs-select"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          {/* Validation Modules Chcekboxes (Tarefa 2) */}
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <span className="text-zinc-400 font-mono text-xs font-semibold">
              Validation Modules
            </span>
            <div className="flex flex-col gap-2 py-0.5">
              <label className="flex items-center gap-2 text-xs font-mono text-slate-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedTests.ghost}
                  disabled={isRunning}
                  onChange={(e) => setSelectedTests(prev => ({ ...prev, ghost: e.target.checked }))}
                  className="rounded border-slate-800 bg-slate-950 text-violet-600 focus:ring-violet-600 focus:ring-offset-slate-900 h-4 w-4 disabled:opacity-50"
                  id="checkbox-ghost"
                />
                Ghost Residual Persistence
              </label>

              <label className="flex items-center gap-2 text-xs font-mono text-slate-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedTests.clone}
                  disabled={isRunning}
                  onChange={(e) => setSelectedTests(prev => ({ ...prev, clone: e.target.checked }))}
                  className="rounded border-slate-800 bg-slate-950 text-violet-600 focus:ring-violet-600 focus:ring-offset-slate-900 h-4 w-4 disabled:opacity-50"
                  id="checkbox-clone"
                />
                Clone Divergence
              </label>

              <label className="flex items-center gap-2 text-xs font-mono text-slate-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedTests.noise}
                  disabled={isRunning}
                  onChange={(e) => setSelectedTests(prev => ({ ...prev, noise: e.target.checked }))}
                  className="rounded border-slate-800 bg-slate-950 text-violet-600 focus:ring-violet-600 focus:ring-offset-slate-900 h-4 w-4 disabled:opacity-50"
                  id="checkbox-noise"
                />
                Noise Robustness
              </label>
            </div>
          </div>

          {/* Double Trigger (Tarefa 4 & 6) */}
          <div className="md:col-span-3">
            {!isRunning ? (
              <button
                onClick={handleRunBatchValidation}
                disabled={isSweeping}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-mono font-bold text-xs uppercase p-2.5 rounded-lg border border-violet-500 shadow-md transition active:scale-95 disabled:opacity-50"
                id="run-full-suite-btn"
              >
                🧪 RUN FULL VALIDATION SUITE
              </button>
            ) : (
              <button
                onClick={handleCancelBatch}
                className="w-full bg-red-650 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase p-2.5 rounded-lg border border-red-500 shadow-md transition active:scale-95 flex items-center justify-center gap-1.5 animate-pulse"
                id="cancel-batch-btn"
              >
                <XCircle size={14} />
                Cancel Validation
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Dynamic Progress tracker display (Tarefa 5) */}
      {isRunning && batchProgress && (
        <div className="bg-slate-900 border border-violet-900/40 p-5 rounded-xl flex flex-col gap-4 animate-pulse animate-fade-in" id="batch-progress-display">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-violet-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-ping" />
              Running {completedSimulations} / {totalSimulations} simulations ({batchProgress.testName} {batchProgress.currentRun}/{runsPerTest})
            </span>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
              <span>Overall Progress: <strong className="text-violet-400">{batchProgress.progressPercent}%</strong></span>
              <span>ETA: <strong className="text-emerald-400">~{batchProgress.etaSeconds}s</strong></span>
              <span>Runtime Acumulado: <strong className="text-amber-400">{elapsedSeconds.toFixed(1)}s</strong></span>
            </div>
          </div>
          
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-violet-650 to-indigo-500 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${batchProgress.progressPercent}%` }} 
            />
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
            <span>Completed Simulations: <strong className="text-white">{completedSimulations} / {totalSimulations}</strong></span>
            <span className="text-[10px] text-zinc-650">RK4 Double Well Solver Logic Execution</span>
          </div>
        </div>
      )}

      {/* Dynamic sequential trial progress display */}
      {isRunning && !batchProgress && (
        <div className="bg-slate-900 border border-violet-900/40 p-5 rounded-xl flex flex-col gap-4 animate-pulse animate-fade-in" id="basic-progress-display">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-violet-400 flex items-center gap-2 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-ping" />
              Running Basic Suite: {completedSimulations} / {totalSimulations} simulations ({currentTestName || "Starting..."})
            </span>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
              <span>Overall Progress: <strong className="text-violet-400">{progress}%</strong></span>
            </div>
          </div>
          
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-violet-650 to-indigo-500 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }} 
            />
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
            <span>Completed Simulations: <strong className="text-white">{completedSimulations} / {totalSimulations}</strong></span>
            <span className="text-[10px] text-zinc-650">Sequential RK4 Trial Solver Executing</span>
          </div>
        </div>
      )}

      {/* Consolidated Batch Report Results metrics table (Tarefa 5, 6, 7, 8 & 11) */}
      {batchReport && (
        <div className="bg-slate-905 border border-violet-800/45 rounded-xl p-5 flex flex-col gap-4 animate-fade-in font-display" id="consolidated-batch-report-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-violet-400 uppercase tracking-widest block mb-0.5">
                CONSOLIDATED RESEARCH FEEDBACK
              </span>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-display">
                🗃️ Validation Summary
              </h3>
            </div>
            
            {/* Export triggers */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleExportBatch('json')}
                className="bg-slate-950 border border-slate-800 text-zinc-300 font-mono hover:bg-slate-800 text-[10px] rounded px-2.5 py-1.5 flex items-center gap-1 transition"
                id="export-batch-json-btn"
              >
                <Download size={11} /> Export JSON
              </button>
              <button
                onClick={() => handleExportBatch('csv')}
                className="bg-slate-950 border border-slate-800 text-zinc-300 font-mono hover:bg-slate-800 text-[10px] rounded px-2.5 py-1.5 flex items-center gap-1 transition"
                id="export-batch-csv-btn"
              >
                <Download size={11} /> Export CSV
              </button>
              <button
                onClick={() => handleExportBatch('pdf')}
                className="bg-slate-950 border border-slate-800 text-zinc-300 font-mono hover:bg-slate-800 text-[10px] rounded px-2.5 py-1.5 flex items-center gap-1 transition"
                id="export-batch-pdf-btn"
              >
                <Download size={11} /> Export PDF
              </button>
            </div>
          </div>

          {/* Banner Red "EXPLORATORY MODE" (Tarefa 11) */}
          {batchReport.metadata.epistemic_mode === 'exploration' && (
            <div className="bg-red-950/25 border border-red-900/50 text-red-200 p-3 rounded-lg text-xs leading-relaxed font-mono flex items-start gap-2 animate-fade-in" id="exploration-mode-banner-summary">
              <ShieldAlert size={14} className="text-red-500 mt-0.5 shrink-0" />
              <div>
                <strong className="text-red-400 block uppercase tracking-wide">EXPLORATORY MODE — Not for scientific claims</strong>
                Simulação de limites não-lineares extremos. Não deve ser usado como evidência científica de persistência de memória.
              </div>
            </div>
          )}

          {batchReport.aborted && (
            <div className="bg-amber-950/20 border border-amber-900/40 text-amber-300 p-3 rounded-lg text-xs leading-relaxed font-mono flex items-start gap-2 animate-fade-in" id="aborted-batch-banner">
              <XCircle size={14} className="text-amber-500 mt-0.5 shrink-0 animate-pulse" />
              <div>
                <strong className="text-amber-400 block uppercase tracking-wide">BATCH RUN INTERRUPTED BY OPERATOR</strong>
                A execução do lote foi cancelada antes do término. Os resultados abaixo representam apenas as etapas que foram devidamente persistidas e concluídas.
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            
            {/* overall_pass status (Tarefa 7 & 11) */}
            <div className={`border rounded-lg p-3 text-center flex flex-col justify-center ${
              batchReport.metadata.epistemic_mode === 'exploration'
                ? 'bg-red-950/20 border-red-900/40 text-red-400'
                : batchReport.summary.overall_pass 
                  ? 'bg-emerald-950/40 border-emerald-900/30 text-emerald-400' 
                  : 'bg-red-950/45 border-red-900/40 text-red-400'
            }`}>
              <span className="text-[9px] font-mono text-zinc-500 uppercase font-semibold">Overall Pass</span>
              <div className="mt-1 font-mono font-bold text-xs flex justify-center items-center">
                {batchReport.metadata.epistemic_mode === 'exploration' ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    EXPLORATORY RESULT
                  </span>
                ) : batchReport.summary.overall_pass ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    PRELIMINARY_PASS
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    FAIL
                  </span>
                )}
              </div>
            </div>

            {/* average_delta_pct (Tarefa 7) */}
            <div className="bg-slate-950/60 border border-slate-850 rounded-lg p-3 text-center flex flex-col justify-center">
              <span className="text-[9px] font-mono text-zinc-500 uppercase font-semibold">Average Δ%</span>
              <span className="mt-1 font-mono font-bold text-lg text-slate-100">
                {batchReport.summary.average_delta_pct > 0 ? '+' : ''}{batchReport.summary.average_delta_pct}%
              </span>
            </div>

            {/* median_delta_pct (Tarefa 7) */}
            <div className="bg-slate-950/60 border border-slate-850 rounded-lg p-3 text-center flex flex-col justify-center">
              <span className="text-[9px] font-mono text-zinc-500 uppercase font-semibold">Median Δ%</span>
              <span className="mt-1 font-mono font-bold text-lg text-slate-200">
                {batchReport.summary.median_delta_pct > 0 ? '+' : ''}{batchReport.summary.median_delta_pct}%
              </span>
            </div>

            {/* pass_rate (Tarefa 7) */}
            <div className="bg-slate-950/60 border border-slate-850 rounded-lg p-3 text-center flex flex-col justify-center">
              <span className="text-[9px] font-mono text-zinc-500 uppercase font-semibold">Pass Rate</span>
              <span className="mt-1 font-mono font-bold text-lg text-violet-300">
                {(batchReport.summary.pass_rate * 100).toFixed(0)}%
              </span>
            </div>

            {/* runtime_s (Tarefa 7) */}
            <div className="bg-slate-950/60 border border-slate-850 rounded-lg p-3 text-center flex flex-col justify-center">
              <span className="text-[9px] font-mono text-zinc-500 uppercase font-semibold">Runtime</span>
              <span className="mt-1 font-mono font-bold text-lg text-emerald-350">
                {batchReport.metadata.runtime_s}s
              </span>
            </div>

          </div>

          <div className="flex flex-col gap-2">
            {batchReport.metadata.epistemic_mode === 'exploration' ? (
              <div className="bg-red-950/20 border border-red-900/50 text-red-400 px-3 py-1.5 rounded text-[10px] font-mono uppercase font-bold text-center tracking-wide">
                EXPLORATORY MODE — Not for scientific claims
              </div>
            ) : (
              <div className="bg-emerald-950/15 border border-emerald-900/30 text-emerald-400 px-3 py-1.5 rounded text-[10px] font-mono uppercase font-bold text-center tracking-wide">
                SCIENTIFIC CALIBRATION REGIME — Verified Deterministic Ensemble
              </div>
            )}

            {batchReport.metadata.preset === 'STRESS' && (
              <div className="bg-amber-950/20 border border-amber-900/50 text-amber-400 px-3 py-1.5 rounded text-[10px] font-mono uppercase font-bold text-center tracking-wide flex justify-center items-center gap-1.5">
                <span>⚠️ HIGH-MEMORY REGIME</span>
              </div>
            )}
          </div>

          {/* Validation Warnings Panel (Tarefa 10) */}
          {batchReport.warnings && batchReport.warnings.length > 0 && (
            <div className="border border-amber-900/40 bg-amber-950/5 rounded-lg overflow-hidden mt-1">
              <button
                onClick={() => setWarningsOpen(!warningsOpen)}
                className="w-full px-4 py-2 bg-amber-950/10 font-mono text-amber-300 text-xs font-semibold flex justify-between items-center hover:bg-amber-950/20 active:bg-amber-950/30 transition outline-none"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldAlert size={14} className="text-amber-500 animate-pulse" />
                  Validation Warnings ({batchReport.warnings.length} Active Warnings)
                </span>
                <span>{warningsOpen ? '▲ Hide' : '▼ Show'}</span>
              </button>
              
              {warningsOpen && (
                <div className="p-3 bg-slate-950 border-t border-amber-900/30 font-mono text-[11px] text-zinc-300 flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                  {batchReport.warnings.map((w: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-amber-400">
                      <span className="shrink-0">⚠️</span>
                      <p>{w}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tabela Consolidada (Tarefa 8) */}
          <div className="flex flex-col gap-1.5 mt-2">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wide">Tabela Consolidada de Execução</span>
            <div className="overflow-x-auto border border-slate-900 rounded-lg bg-slate-950/60">
              <table className="w-full text-left text-xs font-mono text-zinc-350">
                <thead className="bg-slate-950/80 text-[10px] text-zinc-400 uppercase tracking-wider border-b border-slate-900">
                  <tr>
                    <th className="p-3">Test</th>
                    <th className="p-3">Metric</th>
                    <th className="p-3 text-right">Control Mean</th>
                    <th className="p-3 text-right">Experimental Mean</th>
                    <th className="p-3 text-right">Δ%</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {Object.entries(batchReport.results).map(([testId, testResult]: [string, any]) => {
                    return testResult.metrics.map((m: any) => {
                      const isRefExploratory = batchReport.metadata.epistemic_mode === 'exploration';
                      return (
                        <tr key={`${testId}-${m.metric}`} className="hover:bg-slate-900/40">
                          <td className="p-3 font-semibold text-slate-200 capitalize">{testId}</td>
                          <td className="p-3 text-zinc-400">{m.metric.replace(/_/g, ' ')}</td>
                          <td className="p-3 text-right text-zinc-450 font-mono">
                            {m.control_mean} <span className="text-[10px] text-zinc-650">±{m.control_std}</span>
                          </td>
                          <td className="p-3 text-right text-violet-300 font-mono">
                            {m.experimental_mean} <span className="text-[10px] text-zinc-605">±{m.experimental_std}</span>
                          </td>
                          <td className={`p-3 text-right font-bold font-mono ${m.delta_percent > 0 ? 'text-emerald-500' : 'text-zinc-500'}`}>
                            {m.delta_percent > 0 ? '+' : ''}{m.delta_percent}%
                          </td>
                          <td className="p-3 text-center">
                            {isRefExploratory ? (
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-950/20 text-amber-400 border border-amber-900/30">
                                EXPLORATORY
                              </span>
                            ) : (
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                m.passed ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-red-950/40 text-red-500 border border-red-900/35'
                              }`}>
                                {m.passed ? 'PRELIMINARY_PASS' : 'FAIL'}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    });
                  })}
                </tbody>
              </table>
            </div>
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
                    {res.metadata.warnings && res.metadata.warnings.length > 0 && (
                      <div className="mt-2 bg-amber-950/10 border border-amber-900/35 rounded p-2 text-[9px] font-mono text-amber-300">
                        <strong className="text-amber-500 block text-[8px] uppercase tracking-wide mb-0.5">⚠️ Segurança Ativa (Estabilização):</strong>
                        <ul className="list-disc list-inside space-y-0.5">
                          {res.metadata.warnings.map((w, index) => <li key={index}>{w}</li>)}
                        </ul>
                      </div>
                    )}
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
                              {m.passed ? 'PRELIMINARY_PASS' : 'FAIL'}
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
