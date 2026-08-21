import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  ShieldAlert, 
  Terminal, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Lightbulb 
} from 'lucide-react';
import { TimelineEvent } from '../types';

interface ExplainEventModalProps {
  event: TimelineEvent | null;
  onClose: () => void;
}

export const ExplainEventModal: React.FC<ExplainEventModalProps> = ({
  event,
  onClose,
}) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [source, setSource] = useState<string>('gemini-3.7-flash');

  useEffect(() => {
    if (!event) return;

    let isMounted = true;
    setLoading(true);

    fetch('/api/gemini/explain-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event }),
    })
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          setExplanation(data.explanation || 'No explanation generated.');
          setSource(data.source || 'gemini-3.7-flash');
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error(err);
          setExplanation(`### Forensic Telemetry Breakdown
- **Indicator:** Anomaly in ${event.title}.
- **MITRE Technique:** ${event.mitreAttack.technique} (${event.mitreAttack.id}).
- **Human Verification:** Always cross-reference network flow with transaction timestamps before executing high-impact containment.`);
          setSource('local-sovereign-agent');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [event]);

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#30363d] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#161b22] border border-cyan-500/40 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#161b22] border border-[#30363d] text-slate-300">
                  {event.timestamp}
                </span>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  Explainability Agent (XAI)
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-100 font-mono mt-0.5">
                Why is this event suspicious?
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-[#161b22] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Event Quick Snapshot */}
        <div className="p-3 bg-[#161b22] rounded-lg border border-[#30363d] space-y-1 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>TARGET PHASE:</span>
            <span className="text-slate-200 font-bold">{event.title}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>MITRE ATT&CK:</span>
            <span className="text-cyan-400">{event.mitreAttack.id} ({event.mitreAttack.technique})</span>
          </div>
        </div>

        {/* AI Flaw Trap Alert (if event has an AI trap) */}
        {event.isAiFlawed && (
          <div className="p-3.5 bg-amber-950/40 border border-amber-500/60 rounded-lg space-y-1.5">
            <div className="flex items-center gap-2 text-amber-300 font-bold font-mono text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>AI MODEL TRAP WARNING / MISDIRECTION ALERT</span>
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed font-sans">
              {event.aiFlawExplanation}
            </p>
          </div>
        )}

        {/* Deep AI Explanation Body */}
        <div className="bg-[#05070a] border border-[#30363d] rounded-lg p-4 space-y-3 font-sans text-xs text-slate-300 leading-relaxed">
          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-3 text-cyan-400 font-mono animate-pulse">
              <Sparkles className="w-6 h-6 animate-spin" />
              <span>Generating forensic explainability reasoning via Gemini...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap font-sans text-xs space-y-2">
              {explanation}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#30363d] text-[11px] font-mono text-slate-400">
          <span>Telemetry Source: {source}</span>
          <button
            onClick={onClose}
            className="py-1.5 px-4 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors cursor-pointer"
          >
            Understood, Return to War Room
          </button>
        </div>

      </div>
    </div>
  );
};
