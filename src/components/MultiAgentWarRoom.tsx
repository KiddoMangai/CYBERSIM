import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  Layers, 
  MessageSquare, 
  CheckCircle2,
  Cpu,
  HelpCircle,
  X
} from 'lucide-react';
import { AgentInfo, AgentRole, TimelineEvent } from '../types';
import { AI_AGENTS } from '../data/agents';

interface MultiAgentWarRoomProps {
  currentEvent: TimelineEvent;
  activeAgentRole: AgentRole | null;
  onSelectAgent: (role: AgentRole) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  agentRole: AgentRole;
  text: string;
  timestamp: string;
  source?: string;
}

export const MultiAgentWarRoom: React.FC<MultiAgentWarRoomProps> = ({
  currentEvent,
  activeAgentRole,
  onSelectAgent,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo>(
    AI_AGENTS.find(a => a.role === activeAgentRole) || AI_AGENTS[1] // Default SOC Agent
  );
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'agent',
      agentRole: 'soc',
      text: 'SOC Agent initialized on sovereign enclave. Telemetry correlated across Finacle CBS, UPI rails, and Active Directory. Awaiting commander inquiry.',
      timestamp: '11:07:00 AM',
      source: 'local-sovereign-agent'
    }
  ]);

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      agentRole: selectedAgent.role,
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setChatHistory(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/agent-consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentRole: selectedAgent.role,
          query: queryText,
          currentEvent,
          bankState: {
            stepIndex: currentEvent.stepIndex,
            timestamp: currentEvent.timestamp,
            title: currentEvent.title,
          }
        }),
      });

      const data = await response.json();

      const agentMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        agentRole: selectedAgent.role,
        text: data.response || 'Telemetry correlated. Standing by.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        source: data.source || 'gemini-3.7-flash',
      };

      setChatHistory(prev => [...prev, agentMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        agentRole: selectedAgent.role,
        text: `[${selectedAgent.name}] Telemetry reviewed. Recommendation: maintain strict dual-custody verification.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        source: 'local-sovereign-agent',
      };
      setChatHistory(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts: Record<AgentRole, string[]> = {
    red: [
      'What is your next attack vector?',
      'Why did you spoof NetFlow source headers?',
      'How did you gain initial access?'
    ],
    soc: [
      'Are there correlated EDR alerts on 10.14.2.88?',
      'Is 10.14.2.5 actually exfiltrating data?',
      'Check Kerberos ticket granting anomalies'
    ],
    threat_intel: [
      'Map this to MITRE ATT&CK techniques',
      'What threat group matches this pattern?',
      'Is this IOC seen in BFSI sector?'
    ],
    fraud: [
      'Verify if the ₹4.7 Cr batch has mule accounts',
      'Can we split the batch and release legitimate salaries?',
      'What is the velocity anomaly score?'
    ],
    compliance: [
      'What are our CERT-In 6-hour reporting obligations?',
      'Does isolating this node violate RBI SLA?',
      'Generate draft incident disclosure'
    ],
    business_impact: [
      'What is the financial cost if UPI shuts down for 1 hour?',
      'How many salary accounts will be impacted?',
      'What is the customer trust fallout?'
    ],
    explainability: [
      'Why is the AI recommending server isolation?',
      'Is there an AI blind spot or trap here?',
      'What evidence contradicts the AI model?'
    ],
    commander: ['Audit all active playbooks']
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 relative overflow-hidden shadow-xl">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 border-b border-[#30363d] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-[#161b22] border border-indigo-500/40 text-indigo-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 font-mono tracking-wider">
              MULTI-AGENT ADVISORY CLUSTER
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              7 Autonomous Agents with Explainable Sovereign Reasoning
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Sovereign Multi-Agent Mesh Active</span>
        </div>
      </div>

      {/* Agents Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-4">
        {AI_AGENTS.map((agent) => {
          const isSelected = selectedAgent.role === agent.role;

          return (
            <button
              key={agent.role}
              onClick={() => {
                setSelectedAgent(agent);
                onSelectAgent(agent.role);
              }}
              className={`p-2.5 rounded-lg border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#161b22] border-cyan-400 ring-1 ring-cyan-400/50 shadow-md shadow-cyan-950/60'
                  : 'bg-[#0d1117] border-[#30363d] hover:bg-[#161b22] hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-lg">{agent.avatar}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#05070a] text-slate-400 border border-[#30363d]">
                  {agent.confidence}%
                </span>
              </div>

              <div>
                <h4 className="text-[11px] font-bold font-mono text-slate-200 line-clamp-1">
                  {agent.name.split(' ')[0]} {agent.name.split(' ')[1]}
                </h4>
                <p className="text-[9px] text-slate-400 line-clamp-1 font-sans">
                  {agent.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Agent Interrogation Console */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-3">
        
        {/* Selected Agent Header */}
        <div className="flex items-center justify-between border-b border-[#30363d] pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{selectedAgent.avatar}</span>
            <div>
              <h3 className="text-xs font-bold font-mono text-slate-100 flex items-center gap-2">
                <span>{selectedAgent.name}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${selectedAgent.badgeColor}`}>
                  {selectedAgent.tagline}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Status: {selectedAgent.currentStatus}
              </p>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
            Gemini 3.7 Flash Reasoning
          </div>
        </div>

        {/* Chat History Box */}
        <div className="h-44 overflow-y-auto space-y-2.5 pr-2 font-mono text-xs scrollbar-thin scrollbar-thumb-[#30363d]">
          {chatHistory.map((msg) => {
            const isUser = msg.sender === 'user';
            const agentMeta = AI_AGENTS.find(a => a.role === msg.agentRole) || selectedAgent;

            return (
              <div
                key={msg.id}
                className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                  isUser
                    ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-200 ml-8'
                    : 'bg-[#0d1117] border border-[#30363d] text-slate-200 mr-8'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span className="font-bold text-slate-400">
                    {isUser ? '👤 HUMAN COMMANDER' : `${agentMeta.avatar} ${agentMeta.name.toUpperCase()}`}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
                <div className="font-sans text-xs text-slate-300 whitespace-pre-wrap">
                  {msg.text}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="p-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-xs font-mono text-cyan-400 flex items-center gap-2 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{selectedAgent.name} evaluating live banking telemetry and sovereign constraints...</span>
            </div>
          )}
        </div>

        {/* Quick Question Prompts */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] text-slate-500 font-mono">Suggested Inquiries:</span>
          {(quickPrompts[selectedAgent.role] || []).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(prompt)}
              className="text-[10px] font-mono px-2 py-1 rounded bg-[#0d1117] hover:bg-[#21262d] border border-[#30363d] hover:border-cyan-500/60 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Query Input Box */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendQuery(inputQuery);
            }}
            placeholder={`Ask ${selectedAgent.name} (e.g. "Explain evidence for anomaly in Priya Sharma's session")...`}
            className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />

          <button
            disabled={loading || !inputQuery.trim()}
            onClick={() => handleSendQuery(inputQuery)}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              inputQuery.trim() && !loading
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer shadow-md shadow-cyan-950'
                : 'bg-[#0d1117] border border-[#30363d] text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </div>

      </div>

    </div>
  );
};
