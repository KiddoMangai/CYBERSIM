import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  FileText, 
  Award, 
  SlidersHorizontal, 
  Info,
  Server,
  Zap,
  Radio,
  Lock
} from 'lucide-react';
import { ScenarioDefinition } from '../types';

interface HeaderProps {
  scenario: ScenarioDefinition;
  currentStep: number;
  totalSteps: number;
  threatLevel: 'LOW' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  sovereignMode: boolean;
  onToggleSovereignMode: () => void;
  onOpenCertIn: () => void;
  onOpenReport: () => void;
  onOpenScenarioPicker: () => void;
  certInSecondsLeft: number;
  isCertInActive: boolean;
  completedDecisionsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  scenario,
  currentStep,
  totalSteps,
  threatLevel,
  isPlaying,
  onTogglePlay,
  onReset,
  sovereignMode,
  onToggleSovereignMode,
  onOpenCertIn,
  onOpenReport,
  onOpenScenarioPicker,
  certInSecondsLeft,
  isCertInActive,
  completedDecisionsCount,
}) => {
  const [showSovereignInfo, setShowSovereignInfo] = useState(false);

  // Format seconds into HH:MM:SS
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getThreatBadge = () => {
    switch (threatLevel) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-500/20 text-red-400 border-red-500/60 animate-pulse',
          dot: 'bg-red-500',
          label: 'DEFCON 1 / CRITICAL',
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-500/20 text-amber-400 border-amber-500/60',
          dot: 'bg-amber-500',
          label: 'DEFCON 2 / HIGH',
        };
      case 'ELEVATED':
        return {
          bg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/60',
          dot: 'bg-yellow-500',
          label: 'DEFCON 3 / ELEVATED',
        };
      default:
        return {
          bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/60',
          dot: 'bg-emerald-500',
          label: 'DEFCON 5 / NORMAL',
        };
    }
  };

  const threatBadge = getThreatBadge();

  return (
    <header className="bg-[#05070a]/95 border-b border-[#30363d] sticky top-0 z-40 px-4 py-2.5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Brand & Scenario Title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-900 via-cyan-900 to-[#0d1117] border border-cyan-500/40 text-white shadow-lg shadow-cyan-950/50">
              <ShieldAlert className="w-5 h-5 text-cyan-300" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-base text-slate-100 font-mono">CYBERSIM <span className="text-cyan-400">X</span></span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#0d1117] border border-cyan-500/40 text-cyan-300">
                  BFSI War Room
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="text-slate-300 font-medium truncate max-w-[200px] sm:max-w-[300px]">
                  {scenario.title}
                </span>
                <button
                  onClick={onOpenScenarioPicker}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 underline ml-1 cursor-pointer font-mono"
                  title="Switch scenario"
                >
                  [Switch]
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Threat Badge */}
          <div className="md:hidden flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-mono font-medium ${threatBadge.bg}`}>
              <span className={`w-2 h-2 rounded-full ${threatBadge.dot}`}></span>
              {threatBadge.label}
            </span>
          </div>
        </div>

        {/* Center: Threat Level & CERT-In Clock */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-center">
          {/* Threat level desktop */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Threat Level:</span>
            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-mono font-semibold ${threatBadge.bg}`}>
              <span className={`w-2 h-2 rounded-full ${threatBadge.dot}`}></span>
              {threatBadge.label}
            </span>
          </div>

          {/* CERT-In Regulatory Clock */}
          <div 
            onClick={onOpenCertIn}
            className={`cursor-pointer transition-all flex items-center gap-2 px-3 py-1 rounded-md border text-xs font-mono ${
              isCertInActive 
                ? 'bg-amber-950/50 border-amber-500/60 text-amber-300 hover:bg-amber-900/50 animate-pulse shadow-sm shadow-amber-950'
                : 'bg-[#0d1117] border-[#30363d] text-slate-400 hover:bg-[#161b22]'
            }`}
            title="Click to view CERT-In Directions 6-Hour Reporting Dossier"
          >
            <Clock className={`w-3.5 h-3.5 ${isCertInActive ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>CERT-In Clock:</span>
            <span className="font-bold tracking-wider text-slate-200">
              {formatTime(certInSecondsLeft)}
            </span>
            <span className="text-[10px] text-amber-400/90 uppercase font-sans">
              (6h Rule)
            </span>
          </div>
        </div>

        {/* Right: Sovereign Mode, Simulation Controls, After-Action Button */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Sovereign BFSI Mode Toggle */}
          <div className="relative">
            <button
              onClick={onToggleSovereignMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono transition-all ${
                sovereignMode
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 shadow-sm shadow-emerald-950'
                  : 'bg-[#0d1117] border-[#30363d] text-slate-400'
              }`}
              title="Toggle India Sovereign BFSI Data Residency & Model Boundary"
            >
              <span className="text-sm">🇮🇳</span>
              <span className="font-semibold">SOVEREIGN MODE</span>
              <span className={`w-1.5 h-1.5 rounded-full ${sovereignMode ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
            </button>

            <button
              onClick={() => setShowSovereignInfo(!showSovereignInfo)}
              className="absolute -top-1 -right-1 text-slate-400 hover:text-slate-200 bg-[#161b22] border border-[#30363d] rounded-full p-0.5"
              title="Sovereign Mode Specs"
            >
              <Info className="w-2.5 h-2.5" />
            </button>

            {showSovereignInfo && (
              <div className="absolute right-0 mt-2 w-72 p-3 bg-[#0d1117] border border-[#30363d] rounded-lg shadow-2xl text-xs z-50 text-slate-300 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-100 border-b border-[#30363d] pb-1">
                  <span>🇮🇳 Sovereign BFSI Boundary</span>
                  <button onClick={() => setShowSovereignInfo(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between"><span className="text-slate-400">Data Residency:</span> <span className="text-emerald-400">Mumbai CtrlS Tier-4</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Model Boundary:</span> <span className="text-cyan-400">Air-Gapped Gemini weights</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Human Approval:</span> <span className="text-emerald-400">Strict Commander Gate</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Audit Compliance:</span> <span className="text-slate-200">RBI Cyber Resilience (2024)</span></div>
                </div>
              </div>
            )}
          </div>

          {/* After Action Review Button */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1 px-3 py-1 rounded bg-[#0d1117] border border-indigo-500/50 text-indigo-300 hover:bg-indigo-950/60 text-xs font-mono transition-colors"
            title="View Cyber Decision Readiness Profile & AI Dependency Score"
          >
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">After-Action</span> Intelligence
          </button>

          {/* Reset button */}
          <button
            onClick={onReset}
            className="p-1.5 rounded bg-[#0d1117] border border-[#30363d] text-slate-400 hover:text-slate-200 hover:bg-[#161b22] transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
