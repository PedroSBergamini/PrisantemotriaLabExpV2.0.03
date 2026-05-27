/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Activity, Brain, Server, FolderGit2, BookOpen, Layers, User, Sparkles, Globe, Eye, MessageSquareCode, ShieldCheck } from 'lucide-react';
import { useI18n } from './i18n';
import LabCore from './components/LabCore';
import LabBaselines from './components/LabBaselines';
import LabReservoir from './components/LabReservoir';
import LabCompression from './components/LabCompression';
import LabDocumentation from './components/LabDocumentation';
import ValidationPanel from './components/ValidationPanel';

type LabTab = 'core' | 'baselines' | 'reservoir' | 'compression' | 'validation' | 'docs';

export default function App() {
  const [activeTab, setActiveTab] = useState<LabTab>('core');
  const [explorationMode, setExplorationMode] = useState<'guided' | 'advanced'>('guided');
  
  // Connect to our new cognitive i18n layer
  const { locale, setLocale, depth, setDepth, tone, setTone, dict } = useI18n();

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-400" id="app-shell">
      
      {/* Premium Scientific Top Dashboard Header */}
      <header className="border-b border-slate-850 bg-[#0c0f17] px-6 py-5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 shadow-xl" id="app-header">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-emerald-400 flex items-center justify-center animate-pulse">
            <Activity size={22} className="text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-display tracking-tight text-white leading-none">{dict.common.scientificHeaderTitle}</h1>
              <span className="px-2 py-0.5 text-[8px] font-mono leading-none bg-emerald-950 border border-emerald-800/40 text-emerald-400 font-extrabold uppercase rounded-full">
                v2.0.02
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans mt-1">
              {dict.common.scientificHeaderSubtitle}
            </p>
          </div>
        </div>

        {/* Dynamic Cognitive Control Deck */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-slate-400 bg-slate-950/80 border border-slate-850 p-2 rounded-xl xl:self-center w-full xl:w-auto justify-start xl:justify-end" id="cognitive-deck">
          
          {/* 1. Language Sector Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-[#101524] border border-slate-800 rounded-lg">
            <Globe size={12} className="text-sky-400 ml-1" />
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as any)}
              className="bg-[#101524] text-[11px] text-sky-350 font-bold border-0 outline-none pr-3 cursor-pointer text-slate-200"
            >
              <option value="pt-BR">PT-BR</option>
              <option value="en-US">EN-US</option>
            </select>
          </div>

          {/* 2. Cognitive Depth Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-[#101524] border border-slate-800 rounded-lg">
            <Eye size={12} className="text-violet-400 ml-1" />
            <select
              value={depth}
              onChange={(e) => setDepth(e.target.value as any)}
              className="bg-[#101524] text-[11px] text-violet-300 font-bold border-0 outline-none pr-3 cursor-pointer text-slate-200"
            >
              <option value="simple">Básico (Simple)</option>
              <option value="intuitive">Intuitivo (Intuitive)</option>
              <option value="operational">Prático (Operational)</option>
              <option value="formal">Rigoroso (Formal)</option>
              <option value="metaphorical">Poético (Metaphorical)</option>
            </select>
          </div>

          {/* 3. Narrative Tone Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-[#101524] border border-slate-800 rounded-lg">
            <MessageSquareCode size={12} className="text-amber-400 ml-1" />
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="bg-[#101524] text-[11px] text-amber-300 font-bold border-0 outline-none pr-3 cursor-pointer text-slate-200"
            >
              <option value="scientific">Científico (Academic)</option>
              <option value="human">Normal (Human)</option>
              <option value="mentor">Tutor (Mentor)</option>
              <option value="oracle">Inspiracional (Oracle)</option>
              <option value="minimal">Curto (Minimal)</option>
            </select>
          </div>

          {/* 4. Level Indicator toggle */}
          <div className="flex items-center gap-1 bg-[#101524] border border-slate-800 p-1 rounded-lg">
            <button
              id="toggle-mode-guided"
              onClick={() => setExplorationMode('guided')}
              className={`px-2 py-1 text-[10px] font-bold rounded transition-all cursor-pointer flex items-center gap-1 ${
                explorationMode === 'guided'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-extrabold'
                  : 'bg-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <Sparkles size={10} className={explorationMode === 'guided' ? 'text-emerald-400 animate-pulse' : ''} />
              {dict.common.guidedExploration}
            </button>
            
            <button
              id="toggle-mode-advanced"
              onClick={() => setExplorationMode('advanced')}
              className={`px-2 py-1 text-[10px] font-bold rounded transition-all cursor-pointer flex items-center gap-1 ${
                explorationMode === 'advanced'
                  ? 'bg-violet-950/60 text-violet-400 border border-violet-800/30 font-extrabold'
                  : 'bg-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <Layers size={10} className={explorationMode === 'advanced' ? 'text-violet-400' : ''} />
              {dict.common.advancedMode}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tab deck control */}
      <nav className="bg-[#0b0e14] border-b border-slate-850 px-6 py-3 flex gap-2 overflow-x-auto select-none scrollbar-none" id="app-navigation-tabs">
        <button
          id="tab-btn-core"
          onClick={() => setActiveTab('core')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold rounded-md transition-all duration-150 border ${
            activeTab === 'core'
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
              : 'bg-transparent text-slate-400 border-transparent hover:border-slate-805 hover:bg-slate-900/40'
          }`}
        >
          <Activity size={14} />
          {dict.common.tabs.core}
        </button>

        <button
          id="tab-btn-baselines"
          onClick={() => setActiveTab('baselines')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold rounded-md transition-all duration-150 border ${
            activeTab === 'baselines'
              ? 'bg-red-950/40 text-red-400 border-red-500/30'
              : 'bg-transparent text-slate-400 border-transparent hover:border-slate-805 hover:bg-slate-900/40'
          }`}
        >
          <Brain size={14} />
          {dict.common.tabs.baselines}
        </button>

        <button
          id="tab-btn-reservoir"
          onClick={() => setActiveTab('reservoir')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold rounded-md transition-all duration-150 border ${
            activeTab === 'reservoir'
              ? 'bg-cyan-950/40 text-cyan-400 border-cyan-500/30'
              : 'bg-transparent text-slate-400 border-transparent hover:border-slate-805 hover:bg-slate-900/40'
          }`}
        >
          <Server size={14} />
          {dict.common.tabs.reservoir}
        </button>

        <button
          id="tab-btn-compression"
          onClick={() => setActiveTab('compression')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold rounded-md transition-all duration-150 border ${
            activeTab === 'compression'
              ? 'bg-violet-950/40 text-violet-400 border-violet-500/30'
              : 'bg-transparent text-slate-400 border-transparent hover:border-slate-805 hover:bg-slate-900/40'
          }`}
        >
          <Layers size={14} />
          {dict.common.tabs.compression}
        </button>

        <button
          id="tab-btn-validation"
          onClick={() => setActiveTab('validation')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold rounded-md transition-all duration-150 border ${
            activeTab === 'validation'
              ? 'bg-fuchsia-950/40 text-fuchsia-400 border-fuchsia-500/30'
              : 'bg-transparent text-slate-400 border-transparent hover:border-slate-805 hover:bg-slate-900/40'
          }`}
        >
          <ShieldCheck size={14} />
          {locale === 'en-US' ? 'Validation Suite' : 'Suite de Validação'}
        </button>

        <button
          id="tab-btn-docs"
          onClick={() => setActiveTab('docs')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold rounded-md transition-all duration-150 border ${
            activeTab === 'docs'
              ? 'bg-zinc-800 text-slate-100 border-slate-700'
              : 'bg-transparent text-slate-400 border-transparent hover:border-slate-850 hover:bg-slate-900/40'
          }`}
        >
          <BookOpen size={14} />
          {dict.common.tabs.docs}
        </button>
      </nav>

      {/* Main Scientific Display panel */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto" id="app-main-view">
        {activeTab === 'core' && <LabCore explorationMode={explorationMode} setExplorationMode={setExplorationMode} />}
        {activeTab === 'baselines' && <LabBaselines />}
        {activeTab === 'reservoir' && <LabReservoir />}
        {activeTab === 'compression' && <LabCompression />}
        {activeTab === 'validation' && <ValidationPanel />}
        {activeTab === 'docs' && <LabDocumentation />}
      </main>

      {/* Scientific Footer */}
      <footer className="border-t border-slate-850 bg-[#090c12] py-4 px-6 text-center text-[10px] font-mono text-slate-500 flex flex-col md:flex-row justify-between items-center gap-2 mt-auto" id="app-footer">
        <span>© 2026 PRISANTEMOTRIA v2.0 — Operação Causal Estrita Classificável</span>
        <div className="flex gap-4">
          <span>Euler-Lagrange Integrada via Runge-Kutta 4</span>
          <span>Status: CALIBRADO</span>
          <span className="text-emerald-500 flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
            SERVIDOR SEGURO
          </span>
        </div>
      </footer>

    </div>
  );
}
