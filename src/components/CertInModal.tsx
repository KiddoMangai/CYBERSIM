import React, { useState } from 'react';
import { 
  FileText, 
  X, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Download, 
  AlertCircle, 
  Building 
} from 'lucide-react';
import { TimelineEvent, DecisionRecord } from '../types';

interface CertInModalProps {
  onClose: () => void;
  certInSecondsLeft: number;
  currentEvent: TimelineEvent;
  decisions: DecisionRecord[];
  sovereignMode: boolean;
}

export const CertInModal: React.FC<CertInModalProps> = ({
  onClose,
  certInSecondsLeft,
  currentEvent,
  decisions,
  sovereignMode,
}) => {
  const [copied, setCopied] = useState(false);

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const incidentDraftReport = `========================================================================
INDIAN COMPUTER EMERGENCY RESPONSE TEAM (CERT-In) — INCIDENT REPORT FORM
Under Directions issued under sub-section (6) of section 70B of IT Act, 2000
========================================================================

1. REPORTING ENTITY DETAILS:
   - Organization: Bharat Sovereign Commercial Bank Ltd. (BSCB)
   - Category: Scheduled Commercial Bank / Critical BFSI Infrastructure
   - Regulatory Authority: Reserve Bank of India (RBI)
   - Data Center Enclave: CtrlS Tier-4 Datacenter (Mumbai/Bengaluru)
   - Sovereign Mode Status: ${sovereignMode ? 'ACTIVE (Zero cross-border data leakage)' : 'STANDARD'}

2. INCIDENT CLASSIFICATION:
   - Incident Type: Targeted Adversary Cyber Attack / Identity Compromise / Ransomware Staging
   - Attack Stage: ${currentEvent.title} (Phase ${currentEvent.stepIndex + 1})
   - MITRE ATT&CK Mapping: ${currentEvent.mitreAttack.id} (${currentEvent.mitreAttack.technique})
   - Initial Detection Time: 11:08:17 AM IST
   - Statutory 6-Hour Countdown Remaining: ${formatTime(certInSecondsLeft)}

3. TELEMETRY & FORENSIC INDICATORS:
   - Suspicious Identity: priya.s@bscb.in (Session Token Theft / Impossible Travel Velocity)
   - Targeted Systems: Finacle CBS-MUM-01, NPCI UPI Gateway (10.14.2.5), Treasury Switch API
   - Financial Tampering Identified: ₹4.7 Crore Corporate Batch Anomaly (BATCH-20260821)
   - Ransomware Variant: LockBit-BFSI Canary Triggered on Auxiliary Subnets

4. CONTAINMENT & SOVEREIGN REMEDIATION ACTIONS:
   ${decisions.length > 0 
     ? decisions.map((d, i) => `[Action ${i+1}] At ${d.timestamp}: ${d.optionLabel}\n   Outcome: ${d.consequenceApplied.title}`).join('\n   ')
     : '- Proactive Zero-Trust token revocation and dynamic microsegmentation initiated.'}

5. RBI CYBER RESILIENCE CONTROL MAPPINGS:
   - Access Control (RBI Annexure B): MFA Step-Up & Kerberos TGT Invalidation verified.
   - Payment System Security (RBI 2021 Master Directions): Batch routing inspected.
   - Incident Reporting: CERT-In Annexure 1 filed within 6 hours statutory window.

Report prepared by: AI CyberSim X Sovereign Incident Commander
========================================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(incidentDraftReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl max-w-3xl w-full p-6 shadow-2xl space-y-4 text-slate-200 max-h-[90vh] overflow-y-auto font-mono">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#30363d] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#161b22] border border-amber-500/50 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                  CERT-In 6-Hour Mandatory Window
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  Section 70B IT Act Compliance
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-100 mt-0.5">
                Statutory Incident Disclosure Dossier
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

        {/* Clock & RBI Mapping Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-amber-950/30 border border-amber-700/60 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] text-amber-400 block">REPORTING DEADLINE TIMER</span>
              <span className="text-xl font-bold text-slate-100 tracking-wider">
                {formatTime(certInSecondsLeft)}
              </span>
            </div>
            <span className="text-[10px] text-amber-300 px-2 py-1 rounded bg-amber-900/60 border border-amber-700 font-bold">
              6-HOUR STATUTORY LIMIT
            </span>
          </div>

          <div className="p-3 bg-emerald-950/30 border border-emerald-700/60 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] text-emerald-400 block">RBI CONTROL ALIGNMENT</span>
              <span className="text-xs font-bold text-slate-200">
                Cyber Resilience & Payment Security
              </span>
            </div>
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* Draft Report Textarea */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>PRE-FILLED INCIDENT NOTIFICATION FORM (ANNEXURE 1)</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Dossier'}</span>
            </button>
          </div>

          <textarea
            readOnly
            value={incidentDraftReport}
            rows={12}
            className="w-full bg-[#05070a] border border-[#30363d] rounded-lg p-3 text-[11px] font-mono text-slate-300 focus:outline-none select-all"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#30363d] text-xs">
          <span className="text-slate-500">Compliance Audit Ready</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="py-1.5 px-4 rounded bg-amber-950 border border-amber-700 text-amber-300 hover:bg-amber-900 text-xs font-bold transition-colors cursor-pointer"
            >
              {copied ? 'Copied' : 'Copy for CERT-In Portal'}
            </button>
            <button
              onClick={onClose}
              className="py-1.5 px-4 rounded bg-[#161b22] hover:bg-[#21262d] text-slate-200 text-xs transition-colors border border-[#30363d] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
