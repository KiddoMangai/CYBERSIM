import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  AlertTriangle, 
  Zap, 
  Scale, 
  FileCode, 
  Terminal, 
  ArrowRight, 
  MessageSquare,
  Flame,
  Check,
  ShieldCheck,
  Building,
  RotateCcw
} from 'lucide-react';
import { TimelineEvent, DecisionOption, DecisionConsequence } from '../types';

interface IncidentDecisionWarRoomProps {
  currentEvent: TimelineEvent;
  onExecuteDecision: (option: DecisionOption) => void;
  onAskExplainability: () => void;
  onInterrogateAgent: (agentRole: string) => void;
  lastExecutedConsequence?: DecisionConsequence | null;
  onProceedNextEvent: () => void;
  isLastEvent: boolean;
  onOpenAfterActionReport: () => void;
}

export const IncidentDecisionWarRoom: React.FC<IncidentDecisionWarRoomProps> = ({
  currentEvent,
  onExecuteDecision,
  onAskExplainability,
  onInterrogateAgent,
  lastExecutedConsequence,
  onProceedNextEvent,
  isLastEvent,
  onOpenAfterActionReport,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showRawLog, setShowRawLog] = useState<boolean>(false);

  const selectedOption = currentEvent.decisionOptions?.find(o => o.id === selectedOptionId) || null;

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 relative overflow-hidden shadow-2xl">
      
      {/* Glow highlight */}
      <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>

      {/* Incident Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#30363d] pb-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#161b22] border border-cyan-500/40 text-cyan-300 font-bold">
              {currentEvent.timestamp}
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Phase: {currentEvent.phaseTitle}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 font-mono flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span>{currentEvent.title}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={() => setShowRawLog(!showRawLog)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#161b22] border border-[#30363d] text-slate-300 hover:text-white hover:border-slate-500 text-xs transition-colors cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>{showRawLog ? 'Hide Raw SIEM' : 'View Raw SIEM'}</span>
          </button>

          <button
            onClick={onAskExplainability}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#161b22] border border-cyan-500/50 text-cyan-300 hover:bg-cyan-950/80 text-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>XAI Explain</span>
          </button>
        </div>
      </div>

      {/* Optional Raw Syslog Inspector */}
      {showRawLog && (
        <div className="mb-4 p-3 bg-[#05070a] rounded-lg border border-[#30363d] font-mono text-[11px] text-cyan-300 overflow-x-auto">
          <div className="text-slate-500 mb-1 flex items-center justify-between">
            <span>[SIEM REAL-TIME CAPTURE STREAM]</span>
            <span>FORMAT: RFC5424</span>
          </div>
          <pre className="whitespace-pre-wrap">{currentEvent.rawSyslog}</pre>
        </div>
      )}

      {/* Main 2-Column Incident Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        
        {/* Left Column (5 Cols): WHAT HAPPENED & WHY */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Box 1: WHAT HAPPENED? */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-bold border-b border-[#30363d] pb-1.5">
              <span>1. WHAT HAPPENED?</span>
              <span className="text-[10px] text-slate-400 font-normal">SIEM Telemetry</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {currentEvent.summary}
            </p>
          </div>

          {/* Box 2: WHY? (Verified Supporting Evidence) */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-bold border-b border-[#30363d] pb-1.5">
              <span>2. CORRELATED EVIDENCE (WHY?)</span>
              <span className="text-[10px] text-slate-400 font-normal">{currentEvent.detailedEvidence.length} Indicators</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {currentEvent.detailedEvidence.map((ev, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold text-xs mt-0.5">•</span>
                  <span className="leading-snug">{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Box 3: MULTI-AGENT STANCE PREVIEW */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-indigo-300 font-bold border-b border-[#30363d] pb-1.5">
              <span>3. MULTI-AGENT PERSPECTIVES</span>
              <span className="text-[10px] text-slate-400 font-normal">Click to interrogate</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <button 
                onClick={() => onInterrogateAgent('soc')}
                className="p-2 rounded bg-[#0d1117] border border-[#30363d] hover:border-blue-400/80 text-left transition-colors cursor-pointer"
              >
                <span className="text-blue-400 font-bold block">🔵 SOC AGENT:</span>
                <span className="text-slate-400 line-clamp-1">{currentEvent.aiAgentsAnalysis.socAssessment}</span>
              </button>
              <button 
                onClick={() => onInterrogateAgent('fraud')}
                className="p-2 rounded bg-[#0d1117] border border-[#30363d] hover:border-amber-400/80 text-left transition-colors cursor-pointer"
              >
                <span className="text-amber-400 font-bold block">🟠 FRAUD AGENT:</span>
                <span className="text-slate-400 line-clamp-1">{currentEvent.aiAgentsAnalysis.fraudAssessment}</span>
              </button>
              <button 
                onClick={() => onInterrogateAgent('compliance')}
                className="p-2 rounded bg-[#0d1117] border border-[#30363d] hover:border-emerald-400/80 text-left transition-colors cursor-pointer"
              >
                <span className="text-emerald-400 font-bold block">🟢 COMPLIANCE:</span>
                <span className="text-slate-400 line-clamp-1">{currentEvent.aiAgentsAnalysis.complianceAssessment}</span>
              </button>
              <button 
                onClick={() => onInterrogateAgent('business_impact')}
                className="p-2 rounded bg-[#0d1117] border border-[#30363d] hover:border-yellow-400/80 text-left transition-colors cursor-pointer"
              >
                <span className="text-yellow-400 font-bold block">🟡 BUSINESS:</span>
                <span className="text-slate-400 line-clamp-1">{currentEvent.aiAgentsAnalysis.businessAssessment}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column (7 Cols): WHAT DOES AI THINK vs HUMAN COMMAND */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* AI Recommendation Banner */}
          <div className="bg-[#161b22] border border-cyan-500/40 rounded-lg p-4 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-[#0d1117] border border-cyan-500/40 text-cyan-300">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </span>
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  WHAT DOES THE AI RECOMMEND?
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">AI Confidence:</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#0d1117] border border-cyan-500/40 text-cyan-300">
                  {currentEvent.aiAgentsAnalysis.overallConfidence}%
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#0d1117] rounded border border-cyan-500/30 font-mono text-xs text-slate-200 font-semibold leading-relaxed">
              "{currentEvent.aiAgentsAnalysis.recommendedActionText}"
            </div>

            {/* Intellectual Differentiator: Warning on AI Blind Spots */}
            <div className="p-2.5 bg-amber-950/30 border border-amber-800/60 rounded flex items-start gap-2 text-[11px] text-amber-300 font-mono">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>HUMAN SOVEREIGNTY GATE:</strong> The AI may occasionally misinterpret telemetry or propose overzealous containment. Do not click 'Approve' without auditing operational and regulatory blast radiuses.
              </span>
            </div>
          </div>

          {/* Decision Options (if decision required) */}
          {currentEvent.decisionRequired && currentEvent.decisionOptions && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  {currentEvent.decisionPrompt || 'COMMANDER DECISION REQUIRED:'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Select 1 option to execute
                </span>
              </div>

              <div className="space-y-2.5">
                {currentEvent.decisionOptions.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isAiChoice = opt.isAiRecommended;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedOptionId(opt.id)}
                      className={`p-3.5 rounded-lg border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-[#161b22] border-cyan-400 ring-1 ring-cyan-400/60 shadow-lg shadow-cyan-950/60'
                          : 'bg-[#0d1117] border-[#30363d] hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-cyan-400 bg-cyan-500 text-black font-bold' : 'border-slate-600'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <h4 className="text-xs font-bold font-mono text-slate-100">
                            {opt.label}
                          </h4>
                        </div>

                        {isAiChoice && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#161b22] border border-cyan-500/40 text-cyan-300 font-bold uppercase">
                            AI Choice ({opt.aiConfidence}%)
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 mb-2.5 font-sans">
                        {opt.shortDescription}
                      </p>

                      {/* Tradeoff Breakdown */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono pt-2 border-t border-[#30363d] bg-[#05070a]/70 p-2 rounded">
                        <div>
                          <span className="text-slate-500 block">FRAUD EXPOSURE:</span>
                          <span className="text-slate-300 font-semibold">{opt.riskImpactSummary.fraudExposure}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">BUSINESS IMPACT:</span>
                          <span className="text-slate-300 font-semibold">{opt.riskImpactSummary.businessDisruption}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">CUSTOMER S.L.A:</span>
                          <span className="text-slate-300 font-semibold">{opt.riskImpactSummary.customerImpact}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">REGULATORY RISK:</span>
                          <span className="text-slate-300 font-semibold">{opt.riskImpactSummary.regulatoryRisk}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button to Submit Decision */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  disabled={!selectedOption}
                  onClick={() => {
                    if (selectedOption) {
                      onExecuteDecision(selectedOption);
                    }
                  }}
                  className={`py-2.5 px-5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-2 ${
                    selectedOption
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-950 cursor-pointer'
                      : 'bg-[#161b22] text-slate-500 border border-[#30363d] cursor-not-allowed'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>AUTHORISE & EXECUTE COMMAND</span>
                </button>
              </div>
            </div>
          )}

          {/* If No Decision Required (Normal/Informational phase), allow stepping forward */}
          {!currentEvent.decisionRequired && (
            <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-lg flex items-center justify-between">
              <div className="text-xs font-mono text-slate-300">
                <span>Phase telemetry logged. Ready to advance attack timeline.</span>
              </div>
              <button
                onClick={onProceedNextEvent}
                className="py-2 px-4 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Advance to Next Incident</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Consequence Feedback Modal / Banner if just executed */}
      {lastExecutedConsequence && (
        <div className="mt-4 p-4 rounded-lg bg-[#161b22] border border-cyan-500/50 shadow-2xl space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-xs text-slate-100 uppercase tracking-wider">
                CONSEQUENCE REPORT: {lastExecutedConsequence.title}
              </h3>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
              lastExecutedConsequence.regulatoryComplianceRating === 'COMPLIANT'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-red-950 text-red-400 border border-red-800'
            }`}>
              {lastExecutedConsequence.regulatoryComplianceRating}
            </span>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed font-sans">
            {lastExecutedConsequence.customerImpactDescription}
          </div>

          <div className="p-2.5 bg-[#0d1117] rounded border border-[#30363d] text-[11px] text-cyan-300 font-mono">
            <strong>CRITICAL FEEDBACK:</strong> {lastExecutedConsequence.feedback}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-[11px] text-slate-400">
              {lastExecutedConsequence.fraudLossIncurred > 0 ? (
                <span className="text-red-400 font-bold">Fraud Loss: ₹{lastExecutedConsequence.fraudLossIncurred} Cr</span>
              ) : (
                <span className="text-emerald-400 font-bold">₹{lastExecutedConsequence.fraudLossPrevented} Cr Fraud Prevented</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isLastEvent ? (
                <button
                  onClick={onProceedNextEvent}
                  className="py-1.5 px-4 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Proceed to Next Attack Vector</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={onOpenAfterActionReport}
                  className="py-1.5 px-4 rounded bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>View Cyber Decision Readiness Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
