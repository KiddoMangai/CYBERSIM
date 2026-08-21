import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Search, 
  Filter, 
  Pause, 
  Play, 
  Trash2, 
  ArrowDown, 
  Copy, 
  CheckCircle2 
} from 'lucide-react';
import { LiveSIEMLog } from '../types';

interface SIEMLogStreamProps {
  logs: LiveSIEMLog[];
}

export const SIEMLogStream: React.FC<SIEMLogStreamProps> = ({ logs }) => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter(log => {
    if (filterLevel !== 'ALL' && log.level !== filterLevel) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.message.toLowerCase().includes(q) ||
        log.source.toLowerCase().includes(q) ||
        log.ip.toLowerCase().includes(q) ||
        (log.user && log.user.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getLevelBadge = (level: LiveSIEMLog['level']) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-red-400 bg-red-950/80 border-red-800';
      case 'ERROR':
        return 'text-amber-400 bg-amber-950/80 border-amber-800';
      case 'WARN':
        return 'text-yellow-400 bg-yellow-950/80 border-yellow-800';
      default:
        return 'text-cyan-400 bg-cyan-950/80 border-cyan-800';
    }
  };

  const handleCopyLog = (log: LiveSIEMLog) => {
    navigator.clipboard.writeText(`[${log.time}] ${log.source} [${log.level}] ${log.message} (IP: ${log.ip})`);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-4 relative overflow-hidden shadow-xl">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 border-b border-[#30363d] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-[#161b22] border border-[#30363d] text-cyan-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 font-mono tracking-wider">
              SOVEREIGN SIEM & TELEMETRY STREAM
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">
              Live Unified Log Ingestion Pipeline ({filteredLogs.length} events)
            </span>
          </div>
        </div>

        {/* Filter Pills & Auto-scroll Toggle */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="flex items-center bg-[#161b22] border border-[#30363d] rounded-lg p-0.5 text-[11px]">
            {['ALL', 'CRITICAL', 'ERROR', 'WARN', 'INFO'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  filterLevel === lvl
                    ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] border transition-colors cursor-pointer ${
              autoScroll
                ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                : 'bg-[#161b22] border-[#30363d] text-slate-400'
            }`}
            title="Toggle Autoscroll"
          >
            <ArrowDown className={`w-3 h-3 ${autoScroll ? 'animate-bounce' : ''}`} />
            <span>{autoScroll ? 'Auto-Scroll' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="mb-3 relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search raw logs by user, IP, rule signature, or transaction hash..."
          className="w-full bg-[#161b22] border border-[#30363d] rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Log Feed Terminal Window */}
      <div 
        ref={scrollRef}
        className="h-56 bg-[#05070a] border border-[#30363d] rounded-lg p-2.5 font-mono text-[11px] overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-[#30363d]"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-slate-500 text-center py-10">
            No SIEM log events matching current filter.
          </div>
        ) : (
          filteredLogs.map(log => (
            <div
              key={log.id}
              className="flex items-start justify-between gap-2 p-1.5 rounded hover:bg-[#161b22] transition-colors group"
            >
              <div className="flex items-baseline gap-2 flex-1">
                <span className="text-slate-500 text-[10px] select-none flex-shrink-0">
                  {log.time}
                </span>

                <span className={`px-1 py-0.2 rounded border text-[9px] font-bold flex-shrink-0 ${getLevelBadge(log.level)}`}>
                  {log.level}
                </span>

                <span className="text-cyan-400 font-semibold flex-shrink-0">
                  [{log.source}]
                </span>

                <span className="text-slate-300 font-sans text-[11px] leading-snug">
                  {log.message}
                </span>

                {log.ip && (
                  <span className="text-slate-500 text-[10px] font-mono hidden md:inline flex-shrink-0">
                    src={log.ip}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleCopyLog(log)}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-cyan-400 p-1 rounded transition-opacity cursor-pointer"
                title="Copy log entry"
              >
                {copiedId === log.id ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
