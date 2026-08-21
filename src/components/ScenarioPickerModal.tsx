import React, { useState } from 'react';
import { 
  Layers, 
  X, 
  Sparkles, 
  ShieldAlert, 
  ChevronRight, 
  Building2, 
  Lock, 
  Cpu, 
  Send 
} from 'lucide-react';
import { ScenarioDefinition } from '../types';
import { ALL_SCENARIOS } from '../data/scenarios';

interface ScenarioPickerModalProps {
  currentScenarioId: string;
  onSelectScenario: (scenario: ScenarioDefinition) => void;
  onClose: () => void;
}

export const ScenarioPickerModal: React.FC<ScenarioPickerModalProps> = ({
  currentScenarioId,
  onSelectScenario,
  onClose,
}) => {
  const [customTheme, setCustomTheme] = useState('');
  const [targetBank, setTargetBank] = useState('Apex Sovereign Bank');
  const [generating, setGenerating] = useState(false);

  const handleGenerateCustom = async () => {
    if (!customTheme.trim()) return;
    setGenerating(true);

    try {
      const res = await fetch('/api/gemini/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: customTheme, targetBank }),
      });
      const data = await res.json();

      if (data.scenario && data.scenario.title) {
        const newScenario: ScenarioDefinition = {
          id: `custom-${Date.now()}`,
          title: data.scenario.title || `Operation ${customTheme}`,
          subtitle: data.scenario.subtitle || 'AI-Generated High-Stakes BFSI Threat Scenario',
          description: data.scenario.description || 'Custom autonomous breach scenario.',
          targetVictim: targetBank,
          initialTime: '10:15:00 AM',
          initialNodes: ALL_SCENARIOS[0].initialNodes,
          initialEntities: ALL_SCENARIOS[0].initialEntities,
          events: ALL_SCENARIOS[0].events, // Use robust base timeline if dynamic parser needs structure
        };
        onSelectScenario(newScenario);
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-slate-200 font-mono">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#30363d] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#161b22] border border-cyan-500/40 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                BFSI War Room Scenario Catalog
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Select a safe sovereign breach simulation or prompt Gemini to generate a custom adversarial scenario.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-[#161b22] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prebuilt Scenarios List */}
        <div className="space-y-2.5">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
            Curated Bank Breach Scenarios:
          </span>

          {ALL_SCENARIOS.map((sc) => {
            const isCurrent = sc.id === currentScenarioId;

            return (
              <div
                key={sc.id}
                onClick={() => {
                  onSelectScenario(sc);
                  onClose();
                }}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-[#161b22] border-cyan-400 shadow-md ring-1 ring-cyan-500/50'
                    : 'bg-[#05070a] border-[#30363d] hover:bg-[#161b22] hover:border-slate-600'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100">
                      {sc.title}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {sc.subtitle}
                  </p>
                  <div className="text-[10px] text-slate-500 flex items-center gap-2">
                    <span>Victim: {sc.targetVictim}</span>
                    <span>•</span>
                    <span>{sc.events.length} Phased Attack Vectors</span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-500 flex-shrink-0" />
              </div>
            );
          })}
        </div>

        {/* Custom AI Scenario Generator */}
        <div className="p-4 bg-[#05070a] border border-[#30363d] rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Generate Custom BFSI Breach Scenario (Gemini 3.7 Flash)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={customTheme}
              onChange={(e) => setCustomTheme(e.target.value)}
              placeholder="e.g. AI Deepfake Wire Transfer Heist"
              className="bg-[#161b22] border border-[#30363d] rounded px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <input
              type="text"
              value={targetBank}
              onChange={(e) => setTargetBank(e.target.value)}
              placeholder="Target Bank Name"
              className="bg-[#161b22] border border-[#30363d] rounded px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            disabled={generating || !customTheme.trim()}
            onClick={handleGenerateCustom}
            className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              customTheme.trim() && !generating
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white cursor-pointer shadow-lg shadow-cyan-950'
                : 'bg-[#161b22] text-slate-600 border border-[#30363d] cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{generating ? 'Generating Scenario via Gemini...' : 'Synthesize New Bank Breach Scenario'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
