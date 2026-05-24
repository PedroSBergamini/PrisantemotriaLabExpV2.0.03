/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LocaleType, ExplanationDepth, NarrativeTone, Dictionary } from './types';
import { ptBR } from './pt-BR';
import { enUS } from './en-US';

export interface I18nContextProps {
  locale: LocaleType;
  setLocale: (l: LocaleType) => void;
  depth: ExplanationDepth;
  setDepth: (d: ExplanationDepth) => void;
  tone: NarrativeTone;
  setTone: (t: NarrativeTone) => void;
  dict: Dictionary;
  explain: (key: keyof Dictionary['tooltips']) => string;
  explainMetric: (
    metricName: 'phi' | 'clone_divergence' | 'k_star' | 'hysteresis' | 'noise_robustness', 
    status: 'NEUTRAL' | 'MODERATE' | 'OPTIMAL' | 'CRITICAL'
  ) => string;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Autodetect browser language or fallback to pt-BR
  const getInitialLocale = (): LocaleType => {
    const saved = localStorage.getItem('prisantemotria_locale') as LocaleType;
    if (saved === 'pt-BR' || saved === 'en-US') return saved;
    const navLanguage = navigator.language || '';
    if (navLanguage.toLowerCase().startsWith('en')) {
      return 'en-US';
    }
    return 'pt-BR';
  };

  const [locale, setLocaleState] = useState<LocaleType>(getInitialLocale);
  const [depth, setDepthState] = useState<ExplanationDepth>(() => {
    const saved = localStorage.getItem('prisantemotria_depth') as ExplanationDepth;
    return saved || 'intuitive';
  });
  const [tone, setToneState] = useState<NarrativeTone>(() => {
    const saved = localStorage.getItem('prisantemotria_tone') as NarrativeTone;
    return saved || 'human';
  });

  const setLocale = (l: LocaleType) => {
    setLocaleState(l);
    localStorage.setItem('prisantemotria_locale', l);
  };

  const setDepth = (d: ExplanationDepth) => {
    setDepthState(d);
    localStorage.setItem('prisantemotria_depth', d);
  };

  const setTone = (t: NarrativeTone) => {
    setToneState(t);
    localStorage.setItem('prisantemotria_tone', t);
  };

  // Switch dictionaries reactively based on locale state
  const dict = locale === 'en-US' ? enUS : ptBR;

  // Multi-level explainer resolver helper
  const explain = (key: keyof Dictionary['tooltips']): string => {
    const translation = dict.tooltips[key];
    if (!translation) return '';
    const text = translation.explanations[depth] || translation.explanations.simple || '';
    return text;
  };

  // Real-time metric diagnostic tone-based resolver
  const explainMetric = (
    metricName: 'phi' | 'clone_divergence' | 'k_star' | 'hysteresis' | 'noise_robustness', 
    status: 'NEUTRAL' | 'MODERATE' | 'OPTIMAL' | 'CRITICAL'
  ): string => {
    const mapping = {
      phi: dict.diagnostics.metrics.phi,
      clone_divergence: dict.diagnostics.metrics.clone_div,
      k_star: dict.diagnostics.metrics.k_star,
      hysteresis: dict.diagnostics.metrics.hysteresis,
      noise_robustness: dict.diagnostics.metrics.noise_robustness
    };
    const metricEntry = mapping[metricName];
    if (!metricEntry) return '';
    const statusMap = metricEntry.status as any;
    // Handle semantic fallbacks for critical vs optimal
    const matchedStatus = statusMap[status] || statusMap['OPTIMAL'] || statusMap['NEUTRAL'] || {};
    return matchedStatus[tone] || matchedStatus['human'] || matchedStatus['scientific'] || '';
  };

  return (
    <I18nContext.Provider value={{
      locale,
      setLocale,
      depth,
      setDepth,
      tone,
      setTone,
      dict,
      explain,
      explainMetric
    }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18nInternal = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
