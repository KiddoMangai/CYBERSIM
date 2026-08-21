import React from 'react';
import { 
  Clock, 
  HelpCircle, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  Sparkles, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { TimelineEvent } from '../types';

interface CyberTimeMachineProps {
  events: TimelineEvent[];
  currentStepIndex: number;
  onSelectEventStep: (stepIndex: number) => void;
  onAskWhySuspicious: (event: TimelineEvent) => void;
}

export const CyberTimeMachine: React.FC<CyberTimeMachineProps> = ({
  events,
  currentStepIndex,
  onSelectEventStep,
  onAskWhySuspicious,
}) => {
  const getSeverityBadge = (severity: TimelineEvent['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-950/60 text-red-400 border-red-700/60';
      case 'high':
        return 'bg-amber-950/60 text-amber-400 border-amber-700/60';
      case 'medium':
        return 'bg-yellow-950/60 text-yellow-400 border-yellow-700/60';
      default:
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-700/60';
    }
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 relative overflow-hidden shadow-xl">
      
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 border-b border-[#30363d] pb-2.5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-[#161b22] border border-cyan-500/40 text-cyan-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 font-mono tracking-wider">
              CYBER TIME MACHINE
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              Temporal Attack Sequence & Evidence Scrubbing
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 bg-[#161b22] border border-[#30363d] px-2 py-0.5 rounded">
          <span>Step <strong className="text-cyan-400">{currentStepIndex + 1}</strong> of {events.length}</span>
        </div>
      </div>

      {/* Horizontal Scroller / Event Nodes */}
      <div className="flex gap-3 overflow-x-auto pb-2 relative z-10 scrollbar-thin scrollbar-thumb-[#30363d] scrollbar-track-transparent">
        {events.map((evt, idx) => {
          const isActive = idx === currentStepIndex;
          const isPast = idx < currentStepIndex;
          const isFuture = idx > currentStepIndex;
          const severityClass = getSeverityBadge(evt.severity);

          return (
            <div
              key={evt.id}
              onClick={() => onSelectEventStep(idx)}
              className={`flex-shrink-0 w-64 sm:w-72 p-3 rounded-lg border transition-all cursor-pointer relative ${
                isActive
                  ? 'bg-[#161b22] border-cyan-400 shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-400/50'
                  : isPast
                  ? 'bg-[#0d1117]/90 border-[#30363d] opacity-90 hover:opacity-100 hover:border-slate-500'
                  : 'bg-[#05070a]/70 border-[#21262d] opacity-60 hover:opacity-80'
              }`}
            >
              {/* Event Step Status Indicator */}
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400 animate-ping' : isPast ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                  <span className="font-bold text-slate-200">{evt.timestamp}</span>
                </div>

                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold ${severityClass}`}>
                  {evt.severity}
                </span>
              </div>

              {/* Event Title */}
              <h3 className={`text-xs font-semibold line-clamp-1 mb-1 font-mono ${isActive ? 'text-cyan-300' : 'text-slate-200'}`}>
                {evt.title}
              </h3>

              {/* Event Summary */}
              <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed font-sans">
                {evt.summary}
              </p>

              {/* MITRE ATT&CK Tag */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-[#30363d]">
                <span className="text-cyan-400/90 truncate max-w-[140px]">
                  {evt.mitreAttack.id}: {evt.mitreAttack.technique}
                </span>

                {/* "Why is this suspicious?" Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAskWhySuspicious(evt);
                  }}
                  className="inline-flex items-center gap-1 text-[10px] text-cyan-300 hover:text-cyan-100 bg-[#161b22] hover:bg-cyan-950 border border-cyan-500/40 hover:border-cyan-400 px-2 py-0.5 rounded font-mono transition-colors"
                  title="Ask Gemini XAI: Why is this suspicious?"
                >
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                  <span>Why Suspicious?</span>
                </button>
              </div>

              {/* Active Arrow Indicator */}
              {isActive && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-cyan-400"></div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
