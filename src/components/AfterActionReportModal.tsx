import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  RotateCcw, 
  BrainCircuit, 
  TrendingUp, 
  BookOpen, 
  Flame, 
  CheckCircle2, 
  Scale, 
  Zap 
} from 'lucide-react';
import { CyberDecisionReadinessProfile, DecisionRecord } from '../types';

interface AfterActionReportModalProps {
  onClose: () => void;
  report: CyberDecisionReadinessProfile;
  decisions: DecisionRecord[];
  onResimulate: () => void;
}

export const AfterActionReportModal: React.FC<AfterActionReportModalProps> = ({
  onClose,
  report,
  decisions,
  onResimulate,
}) => {
  useEffect(() => {
    // Trigger celebratory cyber victory confetti if score is high
    if (report.overallScore >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#6366f1', '#10b981', '#f59e0b'],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [report.overallScore]);

  const getMetricColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-950/60 border-emerald-700';
    if (score >= 70) return 'text-cyan-400 bg-cyan-950/60 border-cyan-700';
    if (score >= 50) return 'text-yellow-400 bg-yellow-950/60 border-yellow-700';
    return 'text-red-400 bg-red-950/60 border-red-700';
  };

  const getAiDependencyBadge = (riskScore: number) => {
    if (riskScore <= 20) {
      return {
        label: 'SOVEREIGN HUMAN COMMANDER (EXEMPLARY)',
        badge: 'bg-emerald-950 text-emerald-300 border-emerald-600',
        desc: 'You exercised rigorous skepticism and caught AI false-positives before catastrophic business outages.',
      };
    }
    if (riskScore <= 50) {
      return {
        label: 'BALANCED HUMAN-IN-THE-LOOP (GOOD)',
        badge: 'bg-cyan-950 text-cyan-300 border-cyan-600',
        desc: 'Good critical verification of automated recommendations, with occasional minor reliance on AI guidance.',
      };
    }
    return {
      label: 'HIGH AI DEPENDENCY RISK (VULNERABLE)',
      badge: 'bg-red-950 text-red-300 border-red-600 animate-pulse',
      desc: 'Significant tendency to click "Approve" on flawed AI recommendations without inspecting underlying evidence.',
    };
  };

  const aiDep = getAiDependencyBadge(report.aiDependencyRiskScore);

  const radarMetrics = [
    { label: 'Threat Recognition', score: report.threatRecognition },
    { label: 'Investigation Quality', score: report.investigationQuality },
    { label: 'Decision Speed', score: report.decisionSpeed },
    { label: 'False-Positive Resistance', score: report.falsePositiveResistance },
    { label: 'Zero-Trust Thinking', score: report.zeroTrustThinking },
    { label: 'Fraud Awareness', score: report.fraudAwareness },
    { label: 'Regulatory Readiness', score: report.regulatoryReadiness },
    { label: 'AI Challenge Score', score: report.aiChallengeScore },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl max-w-4xl w-full p-6 shadow-2xl space-y-5 text-slate-200 max-h-[92vh] overflow-y-auto font-mono">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#30363d] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-lg shadow-indigo-950">
              <Award className="w-6 h-6 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-[#161b22] text-indigo-300 border border-indigo-500/40 font-bold">
                  AFTER-ACTION INTELLIGENCE
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  BFSI Cyber Decision Laboratory
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100 mt-0.5">
                Cyber Decision Readiness Profile
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-[#161b22] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Summary Banner: Overall Score & Flagship AI Dependency Risk Score */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Overall Readiness Score (4 Cols) */}
          <div className="md:col-span-4 p-4 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between items-center text-center">
            <span className="text-xs text-slate-400 tracking-wider uppercase font-bold">
              CYBER READINESS INDEX
            </span>
            
            <div className="my-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                {report.overallScore}
              </span>
              <span className="text-sm text-slate-500 font-normal"> / 100</span>
            </div>

            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#0d1117] border border-[#30363d] text-slate-300 font-sans">
              {report.overallScore >= 80 ? 'Tier-1 Sovereign Defender' : report.overallScore >= 60 ? 'Competent Defender' : 'Needs Calibration'}
            </span>
          </div>

          {/* AI Dependency Risk Score™ Card (8 Cols) */}
          <div className="md:col-span-8 p-4 rounded-xl bg-[#161b22] border border-indigo-500/40 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
                  AI DEPENDENCY RISK SCORE™
                </span>
              </div>
              <span className="text-xl font-bold font-mono text-slate-100">
                {report.aiDependencyRiskScore}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-[11px] px-2.5 py-1 rounded border font-bold ${aiDep.badge}`}>
                {aiDep.label}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {aiDep.desc}
            </p>
          </div>

        </div>

        {/* 8-Dimensional Readiness Meter Grid */}
        <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              8-Dimensional Cognitive Readiness Breakdown
            </h3>
            <span className="text-[10px] text-slate-400">Target Benchmark: &gt; 80</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {radarMetrics.map((m, idx) => (
              <div key={idx} className="p-2.5 bg-[#0d1117] rounded-lg border border-[#30363d] space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 truncate max-w-[130px]">{m.label}</span>
                  <span className={`px-1.5 py-0.2 rounded border font-bold text-xs ${getMetricColor(m.score)}`}>
                    {m.score}
                  </span>
                </div>
                <div className="w-full bg-[#05070a] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${m.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Insights & Vulnerabilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Critical Insights Box */}
          <div className="p-4 bg-emerald-950/20 border border-emerald-800/50 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>CRITICAL SOVEREIGN INSIGHTS</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
              {report.criticalInsights.map((insight, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vulnerabilities Box */}
          <div className="p-4 bg-amber-950/20 border border-amber-800/50 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>DECISION VULNERABILITIES IDENTIFIED</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
              {report.vulnerabilities.map((vuln, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{vuln}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Recommended Adaptive Micro-Learning */}
        <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#0d1117] border border-cyan-500/40 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-cyan-400">
                  Recommended Micro-Learning Module
                </span>
                <span className="text-[10px] text-slate-400">
                  ({report.recommendedMicroLearning.duration})
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-100 font-mono">
                {report.recommendedMicroLearning.title}
              </h4>
              <p className="text-xs text-slate-400 font-sans">
                {report.recommendedMicroLearning.description}
              </p>
            </div>
          </div>

          <button
            onClick={onResimulate}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-md shadow-cyan-950"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Launch Targeted Re-Simulation</span>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#30363d] text-xs">
          <span className="text-slate-500">
            SIMULATE → DECIDE → MEASURE → EXPLAIN → REMEDIATE → RESIMULATE
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onResimulate}
              className="py-2 px-4 rounded bg-indigo-950 border border-indigo-700 text-indigo-300 hover:bg-indigo-900 font-bold transition-colors cursor-pointer"
            >
              Resimulate Scenario
            </button>
            <button
              onClick={onClose}
              className="py-2 px-4 rounded bg-[#161b22] hover:bg-[#21262d] text-slate-200 font-bold transition-colors border border-[#30363d] cursor-pointer"
            >
              Back to War Room
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
