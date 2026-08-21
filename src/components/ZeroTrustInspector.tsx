import React from 'react';
import { 
  UserCheck, 
  ShieldAlert, 
  Key, 
  Smartphone, 
  Activity, 
  Lock, 
  Unlock, 
  RefreshCw, 
  AlertTriangle,
  UserX,
  Fingerprint
} from 'lucide-react';
import { ZeroTrustEntity } from '../types';

interface ZeroTrustInspectorProps {
  entities: ZeroTrustEntity[];
  onSuspendEntity: (entityId: string) => void;
  onStepUpMfa: (entityId: string) => void;
}

export const ZeroTrustInspector: React.FC<ZeroTrustInspectorProps> = ({
  entities,
  onSuspendEntity,
  onStepUpMfa,
}) => {
  const getScoreColor = (score: number, isRisk: boolean = false) => {
    if (isRisk) {
      if (score > 60) return 'text-red-400 bg-red-950/60 border-red-800';
      if (score > 30) return 'text-amber-400 bg-amber-950/60 border-amber-800';
      return 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
    }
    if (score < 40) return 'text-red-400 bg-red-950/60 border-red-800';
    if (score < 70) return 'text-amber-400 bg-amber-950/60 border-amber-800';
    return 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 relative overflow-hidden shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 border-b border-[#30363d] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-[#161b22] border border-indigo-500/40 text-indigo-400">
            <Fingerprint className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 font-mono tracking-wider">
              ZERO-TRUST CONTINUOUS IDENTITY MONITOR
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              "Never trust permanently. Continuously verify."
            </span>
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-[#161b22] border border-[#30363d]">
          Continuous Risk Attestation Active
        </div>
      </div>

      {/* Grid of Monitored Entities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {entities.map((entity) => {
          const isPriya = entity.id === 'priya-s';
          const isHighRisk = entity.privilegeRisk > 50 || entity.identityConfidence < 50;

          return (
            <div
              key={entity.id}
              className={`rounded-lg p-3.5 border transition-all ${
                entity.isSuspended
                  ? 'bg-red-950/20 border-red-800/80 opacity-75'
                  : isHighRisk
                  ? 'bg-[#161b22] border-red-500/70 shadow-md shadow-red-950/40'
                  : 'bg-[#161b22] border-[#30363d]'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-bold text-xs text-slate-100 font-mono flex items-center gap-1.5">
                    <span>{entity.name}</span>
                    {entity.isSuspended && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-red-950 border border-red-700 text-red-300 font-bold uppercase">
                        SUSPENDED
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {entity.role} ({entity.department})
                  </p>
                </div>
              </div>

              {/* Dynamic Zero-Trust Trust Scores */}
              <div className="space-y-1.5 mb-3 text-[11px] font-mono pt-1">
                
                {/* Identity Confidence */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-cyan-400" /> Identity:
                  </span>
                  <span className={`px-1.5 py-0.2 rounded border font-bold ${getScoreColor(entity.identityConfidence)}`}>
                    {entity.identityConfidence}%
                  </span>
                </div>

                {/* Device Trust */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-blue-400" /> Device Trust:
                  </span>
                  <span className={`px-1.5 py-0.2 rounded border font-bold ${getScoreColor(entity.deviceTrust)}`}>
                    {entity.deviceTrust}%
                  </span>
                </div>

                {/* Behaviour Confidence */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-400" /> Behaviour:
                  </span>
                  <span className={`px-1.5 py-0.2 rounded border font-bold ${getScoreColor(entity.behaviourConfidence)}`}>
                    {entity.behaviourConfidence}%
                  </span>
                </div>

                {/* Privilege Risk */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-amber-400" /> Privilege Risk:
                  </span>
                  <span className={`px-1.5 py-0.2 rounded border font-bold ${getScoreColor(entity.privilegeRisk, true)}`}>
                    {entity.privilegeRisk}%
                  </span>
                </div>

              </div>

              {/* Location & MFA status */}
              <div className="p-2 bg-[#05070a] rounded border border-[#30363d] text-[10px] font-mono text-slate-400 space-y-1 mb-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">LAST IP:</span>
                  <span className="text-slate-300 truncate max-w-[120px]">{entity.currentIp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">MFA STATE:</span>
                  <span className={`font-bold ${entity.mfaStatus === 'VERIFIED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {entity.mfaStatus}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                <button
                  onClick={() => onStepUpMfa(entity.id)}
                  disabled={entity.isSuspended}
                  className="p-1.5 rounded bg-[#0d1117] hover:bg-[#21262d] text-cyan-300 border border-[#30363d] hover:border-cyan-500/60 transition-colors disabled:opacity-40 cursor-pointer"
                  title="Challenge with Biometric Step-Up FIDO2 MFA"
                >
                  Step-Up MFA
                </button>

                <button
                  onClick={() => onSuspendEntity(entity.id)}
                  className={`p-1.5 rounded border transition-colors font-bold cursor-pointer ${
                    entity.isSuspended
                      ? 'bg-emerald-950 border-emerald-700 text-emerald-300 hover:bg-emerald-900'
                      : 'bg-red-950 border-red-700 text-red-300 hover:bg-red-900'
                  }`}
                >
                  {entity.isSuspended ? 'Restore' : 'Suspend'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
