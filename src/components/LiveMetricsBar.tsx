import React from 'react';
import { 
  Activity, 
  Layers, 
  Building2, 
  Zap, 
  ShieldAlert, 
  TrendingDown, 
  Users, 
  ServerCrash,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface LiveMetricsBarProps {
  tps: number;
  branchesOnline: number;
  totalBranches: number;
  coreBankingHealth: number; // 0 to 100
  upiLatencyMs: number;
  fraudExposedCrores: number;
  fraudPreventedCrores: number;
  businessDisruptionCostCrores: number;
  compromisedCount: number;
  suspiciousEndpointsCount: number;
}

export const LiveMetricsBar: React.FC<LiveMetricsBarProps> = ({
  tps,
  branchesOnline,
  totalBranches,
  coreBankingHealth,
  upiLatencyMs,
  fraudExposedCrores,
  fraudPreventedCrores,
  businessDisruptionCostCrores,
  compromisedCount,
  suspiciousEndpointsCount,
}) => {
  return (
    <div className="bg-[#05070a]/90 border-b border-[#30363d] px-4 py-2.5 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        
        {/* Metric 1: Transaction Throughput */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-2.5 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>TXN VELOCITY</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-base sm:text-lg font-mono font-bold text-slate-100">
              {tps.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">txns/min</span>
          </div>
          <div className="w-full bg-[#161b22] border border-[#30363d] h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className="bg-cyan-400 h-full transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]" 
              style={{ width: `${Math.min(100, (tps / 20000) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 2: Branch Network Mesh */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-2.5 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>BRANCH NETWORK</span>
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-base sm:text-lg font-mono font-bold text-slate-100">
              {branchesOnline} <span className="text-xs text-slate-500 font-normal">/ {totalBranches}</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">ONLINE</span>
          </div>
          <div className="w-full bg-[#161b22] border border-[#30363d] h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className="bg-emerald-400 h-full transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" 
              style={{ width: `${(branchesOnline / totalBranches) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 3: Core Banking Health */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-2.5 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>CORE BANKING (CBS)</span>
            <Layers className={`w-3.5 h-3.5 ${coreBankingHealth > 80 ? 'text-emerald-400' : 'text-amber-400'}`} />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-base sm:text-lg font-mono font-bold text-slate-100">
              {coreBankingHealth}%
            </span>
            <span className={`text-[10px] font-mono font-bold ${coreBankingHealth > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {coreBankingHealth > 80 ? 'NORMAL' : 'DEGRADED'}
            </span>
          </div>
          <div className="w-full bg-[#161b22] border border-[#30363d] h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${coreBankingHealth > 80 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]'}`} 
              style={{ width: `${coreBankingHealth}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 4: UPI Gateway Rails */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-2.5 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>UPI / IMPS RAILS</span>
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-base sm:text-lg font-mono font-bold text-slate-100">
              {upiLatencyMs}ms
            </span>
            <span className={`text-[10px] font-mono font-bold ${upiLatencyMs < 20 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {upiLatencyMs < 20 ? 'LOW LATENCY' : 'HIGH LATENCY'}
            </span>
          </div>
          <div className="w-full bg-[#161b22] border border-[#30363d] h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className="bg-cyan-400 h-full transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]" 
              style={{ width: `${Math.max(10, 100 - (upiLatencyMs * 2))}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 5: Fraud Loss / Prevented */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-2.5 flex flex-col justify-between hover:border-red-500/40 transition-colors">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>FRAUD EXPOSURE</span>
            <ShieldAlert className={`w-3.5 h-3.5 ${fraudExposedCrores > 0 ? 'text-red-400' : 'text-emerald-400'}`} />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-base sm:text-lg font-mono font-bold text-slate-100">
              {fraudExposedCrores > 0 ? `₹${fraudExposedCrores} Cr` : '₹0.00'}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">
              {fraudPreventedCrores > 0 ? `+₹${fraudPreventedCrores}Cr SAVED` : 'SAFE'}
            </span>
          </div>
          <div className="w-full bg-[#161b22] border border-[#30363d] h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${fraudExposedCrores > 0 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]'}`} 
              style={{ width: `${fraudExposedCrores > 0 ? 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 6: Threat Entities Active */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-2.5 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>SUSPICIOUS ENTITIES</span>
            <Users className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-base sm:text-lg font-mono font-bold text-slate-100">
              {compromisedCount} Identity <span className="text-xs text-slate-400">/ {suspiciousEndpointsCount} Nodes</span>
            </span>
            <span className="text-[10px] text-amber-400 font-mono font-bold">ALERT</span>
          </div>
          <div className="w-full bg-[#161b22] border border-[#30363d] h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className="bg-amber-400 h-full transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]" 
              style={{ width: `${Math.min(100, (compromisedCount + suspiciousEndpointsCount) * 25)}%` }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
};
