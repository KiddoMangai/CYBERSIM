import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  ShieldCheck, 
  Key, 
  Cpu, 
  Globe, 
  Building2, 
  Wifi, 
  AlertTriangle, 
  Lock, 
  CheckCircle2, 
  Radio, 
  Layers, 
  X,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { BankNode, NodeStatus } from '../types';

interface BankDigitalTwinProps {
  nodes: BankNode[];
  selectedNodeId: string | null;
  onSelectNode: (node: BankNode | null) => void;
  onToggleIsolateNode: (nodeId: string) => void;
  activeIncidentNodeIds: string[];
}

export const BankDigitalTwin: React.FC<BankDigitalTwinProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  onToggleIsolateNode,
  activeIncidentNodeIds,
}) => {
  const [inspectedNode, setInspectedNode] = useState<BankNode | null>(null);

  const getNodeIcon = (type: BankNode['type']) => {
    switch (type) {
      case 'core':
        return <Layers className="w-5 h-5" />;
      case 'payment_switch':
        return <Cpu className="w-5 h-5" />;
      case 'database':
        return <Database className="w-5 h-5" />;
      case 'iam':
        return <ShieldCheck className="w-5 h-5" />;
      case 'vault':
        return <Key className="w-5 h-5" />;
      case 'api_gateway':
        return <Globe className="w-5 h-5" />;
      case 'branch':
        return <Building2 className="w-5 h-5" />;
      default:
        return <Server className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: NodeStatus, isUnderAttack: boolean) => {
    if (isUnderAttack) {
      return {
        border: 'border-red-500 shadow-lg shadow-red-500/20 animate-pulse bg-[#161b22]',
        badge: 'bg-red-950 text-red-400 border-red-700 font-bold',
        text: 'text-red-400',
        label: 'ATTACK PROPAGATION',
      };
    }
    switch (status) {
      case 'compromised':
        return {
          border: 'border-red-500 bg-red-950/40 text-red-400',
          badge: 'bg-red-950 text-red-400 border-red-700',
          text: 'text-red-400',
          label: 'COMPROMISED',
        };
      case 'degraded':
        return {
          border: 'border-amber-500/80 bg-amber-950/30 text-amber-400',
          badge: 'bg-amber-950 text-amber-400 border-amber-700',
          text: 'text-amber-400',
          label: 'DEGRADED',
        };
      case 'isolated':
        return {
          border: 'border-indigo-500/60 bg-indigo-950/40 text-indigo-300',
          badge: 'bg-indigo-950 text-indigo-300 border-indigo-700',
          text: 'text-indigo-400',
          label: 'ISOLATED (SAFE)',
        };
      case 'warning':
        return {
          border: 'border-yellow-500/80 bg-yellow-950/30 text-yellow-400',
          badge: 'bg-yellow-950 text-yellow-400 border-yellow-700',
          text: 'text-yellow-400',
          label: 'SUSPICIOUS',
        };
      default:
        return {
          border: 'border-[#30363d] hover:border-cyan-500/60 bg-[#0d1117] text-slate-300',
          badge: 'bg-emerald-950/80 text-emerald-400 border-emerald-700',
          text: 'text-emerald-400',
          label: 'ONLINE / SECURE',
        };
    }
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 relative overflow-hidden shadow-xl">
      
      {/* Background Matrix/Grid Aesthetic */}
      <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 relative z-10 border-b border-[#30363d] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
          <h2 className="text-sm font-bold tracking-wider text-slate-100 uppercase font-mono">
            Bank Digital Twin — Live Topology
          </h2>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#161b22] border border-cyan-500/40 text-cyan-300 font-mono">
            Sovereign Enclave
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Nominal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Suspicious
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Attack Vector
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Isolated
          </span>
        </div>
      </div>

      {/* Grid of Bank Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
        {nodes.map((node) => {
          const isUnderAttack = activeIncidentNodeIds.includes(node.id);
          const style = getStatusColor(node.status, isUnderAttack);
          const isSelected = selectedNodeId === node.id || inspectedNode?.id === node.id;

          return (
            <div
              key={node.id}
              onClick={() => {
                setInspectedNode(node);
                onSelectNode(node);
              }}
              className={`cursor-pointer rounded-lg p-3.5 border transition-all duration-300 relative group ${style.border} ${
                isSelected ? 'ring-2 ring-cyan-400 bg-[#161b22]' : 'hover:bg-[#161b22]'
              }`}
            >
              {/* Active Threat Pulsing Indicator */}
              {isUnderAttack && (
                <div className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 text-[9px] text-white font-bold items-center justify-center">!</span>
                </div>
              )}

              {/* Node Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded bg-[#161b22] border border-[#30363d] text-cyan-400 group-hover:text-cyan-300 transition-colors`}>
                    {getNodeIcon(node.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-slate-100 group-hover:text-cyan-300 transition-colors leading-tight">
                      {node.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      {node.code}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${style.badge}`}>
                  {style.label}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {node.ip}
                </span>
              </div>

              {/* Node Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-2 border-t border-[#30363d]">
                <div>
                  <span className="text-slate-500">THROUGHPUT:</span>
                  <span className="block text-slate-300 font-bold">{node.tps.toLocaleString()} TPS</span>
                </div>
                <div>
                  <span className="text-slate-500">LATENCY / RISK:</span>
                  <span className={`block font-bold ${node.riskScore > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {node.latencyMs}ms ({node.riskScore}%)
                  </span>
                </div>
              </div>

              {/* Location Tag */}
              <div className="mt-2 text-[9px] text-slate-500 truncate flex items-center gap-1 font-mono">
                <Wifi className="w-2.5 h-2.5 text-slate-600" />
                <span>{node.location}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Node Diagnostic Inspector Modal */}
      {inspectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0d1117] border border-cyan-500/50 rounded-xl max-w-lg w-full p-5 shadow-2xl space-y-4 text-slate-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#30363d] pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-[#161b22] border border-cyan-500/40 text-cyan-400">
                  {getNodeIcon(inspectedNode.type)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-100 font-mono">
                    {inspectedNode.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Code: {inspectedNode.code} | IP: {inspectedNode.ip}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setInspectedNode(null)} 
                className="text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-[#161b22] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Diagnostic Details */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-[#161b22] rounded-lg border border-[#30363d]">
                <span className="text-slate-500 block">ENCLAVE LOCATION</span>
                <span className="text-slate-200 font-semibold">{inspectedNode.location}</span>
              </div>
              <div className="p-2.5 bg-[#161b22] rounded-lg border border-[#30363d]">
                <span className="text-slate-500 block">CURRENT HEALTH & STATUS</span>
                <span className="text-cyan-400 font-semibold uppercase">{inspectedNode.status}</span>
              </div>
              <div className="p-2.5 bg-[#161b22] rounded-lg border border-[#30363d]">
                <span className="text-slate-500 block">TRANSACTION LOAD</span>
                <span className="text-emerald-400 font-bold">{inspectedNode.tps.toLocaleString()} TPS</span>
              </div>
              <div className="p-2.5 bg-[#161b22] rounded-lg border border-[#30363d]">
                <span className="text-slate-500 block">ANOMALY RISK INDEX</span>
                <span className={`font-bold ${inspectedNode.riskScore > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {inspectedNode.riskScore} / 100
                </span>
              </div>
            </div>

            {/* Forensic Inspection Notice */}
            <div className="p-3 bg-[#05070a] border border-[#30363d] rounded-lg text-xs font-mono space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-Trust Microsegmentation Check</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                {inspectedNode.id === 'upi-switch'
                  ? '⚠️ NPCI UPI primary settlement bridge. Severing this node will cause instantaneous nationwide payment rail failure (₹120 Cr/hr).'
                  : inspectedNode.id === 'api-gw'
                  ? 'Open Banking external edge proxy. Can be isolated or ratelimited without touching core settlement rails.'
                  : 'Node is operating within sovereign data center parameters with hardware security module attestation.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  onToggleIsolateNode(inspectedNode.id);
                  setInspectedNode(null);
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  inspectedNode.status === 'isolated'
                    ? 'bg-emerald-950 border border-emerald-600 text-emerald-300 hover:bg-emerald-900'
                    : 'bg-red-950 border border-red-600 text-red-300 hover:bg-red-900'
                }`}
              >
                {inspectedNode.status === 'isolated' ? 'RESTORE NODE TO CLUSTER' : 'ISOLATE NODE (MICROSEGMENT)'}
              </button>
              
              <button
                onClick={() => setInspectedNode(null)}
                className="py-2 px-4 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-slate-300 text-xs font-mono border border-[#30363d] cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
