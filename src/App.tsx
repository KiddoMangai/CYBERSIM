import React, { useState, useEffect, useRef } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  LiveMetricsBar 
} from './components/LiveMetricsBar';
import { 
  BankDigitalTwin 
} from './components/BankDigitalTwin';
import { 
  CyberTimeMachine 
} from './components/CyberTimeMachine';
import { 
  IncidentDecisionWarRoom 
} from './components/IncidentDecisionWarRoom';
import { 
  MultiAgentWarRoom 
} from './components/MultiAgentWarRoom';
import { 
  ZeroTrustInspector 
} from './components/ZeroTrustInspector';
import { 
  SIEMLogStream 
} from './components/SIEMLogStream';
import { 
  ExplainEventModal 
} from './components/ExplainEventModal';
import { 
  CertInModal 
} from './components/CertInModal';
import { 
  AfterActionReportModal 
} from './components/AfterActionReportModal';
import { 
  ScenarioPickerModal 
} from './components/ScenarioPickerModal';
import { 
  OPERATION_BLACKOUT_SCENARIO, 
  INITIAL_BANK_NODES, 
  INITIAL_ZERO_TRUST_ENTITIES 
} from './data/scenarios';
import { 
  ScenarioDefinition, 
  TimelineEvent, 
  BankNode, 
  ZeroTrustEntity, 
  DecisionOption, 
  DecisionRecord, 
  DecisionConsequence,
  CyberDecisionReadinessProfile, 
  LiveSIEMLog, 
  AgentRole 
} from './types';

export default function App() {
  // Scenario state
  const [scenario, setScenario] = useState<ScenarioDefinition>(OPERATION_BLACKOUT_SCENARIO);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sovereignMode, setSovereignMode] = useState<boolean>(true);

  // Bank telemetry state
  const [bankNodes, setBankNodes] = useState<BankNode[]>(scenario.initialNodes);
  const [entities, setEntities] = useState<ZeroTrustEntity[]>(scenario.initialEntities);
  const [tps, setTps] = useState<number>(18742);
  const [branchesOnline, setBranchesOnline] = useState<number>(426);
  const [coreBankingHealth, setCoreBankingHealth] = useState<number>(100);
  const [upiLatencyMs, setUpiLatencyMs] = useState<number>(8);
  const [fraudExposedCrores, setFraudExposedCrores] = useState<number>(0);
  const [fraudPreventedCrores, setFraudPreventedCrores] = useState<number>(0);
  const [businessDisruptionCostCrores, setBusinessDisruptionCostCrores] = useState<number>(0);

  // Threat & Regulatory Timer state
  const [threatLevel, setThreatLevel] = useState<'LOW' | 'ELEVATED' | 'HIGH' | 'CRITICAL'>('LOW');
  const [certInSecondsLeft, setCertInSecondsLeft] = useState<number>(21599); // 05:59:59
  const [isCertInActive, setIsCertInActive] = useState<boolean>(false);

  // Decision state
  const [decisions, setDecisions] = useState<DecisionRecord[]>([]);
  const [lastExecutedConsequence, setLastExecutedConsequence] = useState<DecisionConsequence | null>(null);

  // SIEM logs stream
  const [siemLogs, setSiemLogs] = useState<LiveSIEMLog[]>([
    {
      id: 'log-1',
      time: '11:07:00.114',
      source: 'CBS-MUM-01',
      level: 'INFO',
      category: 'HEALTH',
      message: 'Finacle Core Engine TPS: 3420, Memory: 42%, Active Cluster: Synchronous RAC',
      ip: '10.14.1.10',
    },
    {
      id: 'log-2',
      time: '11:07:00.320',
      source: 'UPI-GW-01',
      level: 'INFO',
      category: 'GATEWAY',
      message: 'NPCI Direct Connect Link Nominal (12,850 txns/min), 0 packet drops',
      ip: '10.14.2.5',
    },
    {
      id: 'log-3',
      time: '11:07:00.890',
      source: 'IAM-BLR-02',
      level: 'INFO',
      category: 'AUTH',
      message: 'Kerberos TGT authentication pool verified across 426 branch subnets',
      ip: '10.20.4.15',
    }
  ]);

  // Modals state
  const [selectedExplainingEvent, setSelectedExplainingEvent] = useState<TimelineEvent | null>(null);
  const [showCertInModal, setShowCertInModal] = useState<boolean>(false);
  const [showAfterActionModal, setShowAfterActionModal] = useState<boolean>(false);
  const [showScenarioPickerModal, setShowScenarioPickerModal] = useState<boolean>(false);
  const [activeInterrogateAgentRole, setActiveInterrogateAgentRole] = useState<AgentRole>('soc');

  const currentEvent = scenario.events[currentStepIndex] || scenario.events[0];

  // CERT-In 6-Hour countdown effect
  useEffect(() => {
    let timer: any = null;
    if (isCertInActive && certInSecondsLeft > 0) {
      timer = setInterval(() => {
        setCertInSecondsLeft(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCertInActive, certInSecondsLeft]);

  // Periodic simulated SIEM heartbeat
  useEffect(() => {
    const logTimer = setInterval(() => {
      const randomTpsJitter = Math.floor(Math.random() * 80) - 40;
      setTps(prev => Math.max(100, prev + randomTpsJitter));

      const newLog: LiveSIEMLog = {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour12: false }) + '.' + Math.floor(Math.random() * 900 + 100),
        source: ['UPI-GW-01', 'CBS-MUM-01', 'IAM-BLR-02', 'API-CORP-01', 'HSM-VAULT-IN'][Math.floor(Math.random() * 5)],
        level: currentStepIndex > 3 ? (Math.random() > 0.4 ? 'WARN' : 'CRITICAL') : 'INFO',
        category: 'TRAFFIC',
        message: currentStepIndex > 3 
          ? `High-velocity batch traffic correlated with host ${currentEvent.affectedNodeIds[0] || '10.14.2.88'}`
          : `Nominal transaction flow: ${Math.floor(Math.random() * 300 + 18500)} TPS heartbeat confirmed.`,
        ip: `10.14.${Math.floor(Math.random() * 8)}.${Math.floor(Math.random() * 200 + 1)}`,
      };

      setSiemLogs(prev => [...prev.slice(-90), newLog]);
    }, 4000);

    return () => clearInterval(logTimer);
  }, [currentStepIndex, currentEvent]);

  // Dynamic step transition & telemetry sync
  useEffect(() => {
    // Update threat level and node states based on current event
    if (currentStepIndex === 0) {
      setThreatLevel('LOW');
      setIsCertInActive(false);
    } else if (currentStepIndex === 1) {
      setThreatLevel('ELEVATED');
      // Priya Sharma trust score drops
      setEntities(prev => prev.map(e => e.id === 'priya-s' ? {
        ...e,
        identityConfidence: 63,
        deviceTrust: 42,
        behaviourConfidence: 68,
        privilegeRisk: 45,
        currentIp: '185.220.101.5 (Germany VPN)',
        mfaStatus: 'STEP_UP_REQUIRED'
      } : e));
    } else if (currentStepIndex === 2) {
      setThreatLevel('ELEVATED');
      setBankNodes(prev => prev.map(n => n.id === 'api-gw' ? { ...n, status: 'warning', riskScore: 45 } : n));
    } else if (currentStepIndex === 3) {
      setThreatLevel('HIGH');
      setIsCertInActive(true);
      // svc_fin_settle trust anomaly
      setEntities(prev => prev.map(e => e.id === 'svc-settle' ? {
        ...e,
        identityConfidence: 45,
        privilegeRisk: 81,
        notes: 'Privilege escalated to Enterprise Treasury Admins without ticket!'
      } : e));
    } else if (currentStepIndex === 4) {
      setThreatLevel('CRITICAL');
      setFraudExposedCrores(4.7);
      setBankNodes(prev => prev.map(n => n.id === 'core-cbs' ? { ...n, status: 'warning', riskScore: 78 } : n));
    } else if (currentStepIndex === 5) {
      setThreatLevel('CRITICAL');
      setBankNodes(prev => prev.map(n => n.id === 'api-gw' ? { ...n, status: 'degraded', riskScore: 89 } : n));
    } else if (currentStepIndex === 6) {
      setThreatLevel('CRITICAL');
      setBankNodes(prev => prev.map(n => n.id === 'db-primary' ? { ...n, status: 'degraded', riskScore: 92 } : n));
    }
  }, [currentStepIndex]);

  // Execute commander decision
  const handleExecuteDecision = (option: DecisionOption) => {
    const consequence = option.consequence;
    setLastExecutedConsequence(consequence);

    // Apply telemetry consequences
    if (consequence.tpsDeltaPercent < 0) {
      setTps(prev => Math.max(0, Math.floor(prev * (1 + consequence.tpsDeltaPercent / 100))));
      setCoreBankingHealth(prev => Math.max(10, prev + consequence.tpsDeltaPercent));
    }
    if (consequence.fraudLossIncurred > 0) {
      setFraudExposedCrores(prev => prev + consequence.fraudLossIncurred);
    }
    if (consequence.fraudLossPrevented > 0) {
      setFraudPreventedCrores(prev => prev + consequence.fraudLossPrevented);
      setFraudExposedCrores(0);
    }
    if (consequence.businessDisruptionCost > 0) {
      setBusinessDisruptionCostCrores(prev => prev + consequence.businessDisruptionCost);
    }

    // Determine AI challenge vs blind compliance
    const followedAi = Boolean(option.isAiRecommended);
    const challengedAiCorrectly = Boolean(currentEvent.isAiFlawed && !option.isAiRecommended);

    const record: DecisionRecord = {
      eventId: currentEvent.id,
      eventTitle: currentEvent.title,
      optionId: option.id,
      optionLabel: option.label,
      timestamp: currentEvent.timestamp,
      followedAiBlindly: followedAi && Boolean(currentEvent.isAiFlawed),
      challengedAiCorrectly: challengedAiCorrectly,
      timeSpentSeconds: 45,
      consequenceApplied: consequence,
    };

    setDecisions(prev => [...prev.filter(d => d.eventId !== currentEvent.id), record]);

    // Push new SIEM critical decision event
    const decisionLog: LiveSIEMLog = {
      id: `log-dec-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour12: false }) + '.000',
      source: 'COMMANDER-CONSOLE',
      level: 'CRITICAL',
      category: 'DECISION_EXECUTED',
      message: `Directive Authorised: ${option.label} -> ${consequence.title}`,
      ip: '10.14.0.1 (Sovereign Command Console)',
    };
    setSiemLogs(prev => [...prev, decisionLog]);
  };

  // Step forward
  const handleProceedNext = () => {
    setLastExecutedConsequence(null);
    if (currentStepIndex < scenario.events.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setShowAfterActionModal(true);
    }
  };

  // Reset simulation
  const handleReset = () => {
    setCurrentStepIndex(0);
    setBankNodes(scenario.initialNodes);
    setEntities(scenario.initialEntities);
    setTps(18742);
    setBranchesOnline(426);
    setCoreBankingHealth(100);
    setUpiLatencyMs(8);
    setFraudExposedCrores(0);
    setFraudPreventedCrores(0);
    setBusinessDisruptionCostCrores(0);
    setThreatLevel('LOW');
    setCertInSecondsLeft(21599);
    setIsCertInActive(false);
    setDecisions([]);
    setLastExecutedConsequence(null);
  };

  // Toggle node isolation
  const handleToggleIsolateNode = (nodeId: string) => {
    setBankNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        const nextStatus = node.status === 'isolated' ? 'online' : 'isolated';
        return {
          ...node,
          status: nextStatus,
          riskScore: nextStatus === 'isolated' ? 0 : node.riskScore,
        };
      }
      return node;
    }));
  };

  // Zero-Trust entity actions
  const handleSuspendEntity = (entityId: string) => {
    setEntities(prev => prev.map(e => {
      if (e.id === entityId) {
        return {
          ...e,
          isSuspended: !e.isSuspended,
          privilegeRisk: e.isSuspended ? e.privilegeRisk : 0,
        };
      }
      return e;
    }));
  };

  const handleStepUpMfa = (entityId: string) => {
    setEntities(prev => prev.map(e => {
      if (e.id === entityId) {
        return {
          ...e,
          mfaStatus: 'VERIFIED',
          identityConfidence: Math.min(100, e.identityConfidence + 25),
        };
      }
      return e;
    }));
  };

  // Calculate After Action Report Profile
  const calculateAfterActionReport = (): CyberDecisionReadinessProfile => {
    let threatRecognition = 85;
    let investigationQuality = 80;
    let decisionSpeed = 86;
    let falsePositiveResistance = 75;
    let zeroTrustThinking = 82;
    let fraudAwareness = 88;
    let regulatoryReadiness = 80;
    let aiChallengeScore = 80;

    let blindAiCount = 0;
    let challengeCount = 0;

    decisions.forEach(d => {
      const delta = d.consequenceApplied.scoreDelta;
      threatRecognition = Math.max(10, Math.min(100, threatRecognition + (delta.threatRecognition || 0) / 2));
      investigationQuality = Math.max(10, Math.min(100, investigationQuality + (delta.investigationQuality || 0) / 2));
      falsePositiveResistance = Math.max(10, Math.min(100, falsePositiveResistance + (delta.falsePositiveResistance || 0) / 2));
      aiChallengeScore = Math.max(10, Math.min(100, aiChallengeScore + (delta.aiChallengeScore || 0) / 2));
      zeroTrustThinking = Math.max(10, Math.min(100, zeroTrustThinking + (delta.zeroTrustScore || 0) / 2));

      if (d.followedAiBlindly) blindAiCount++;
      if (d.challengedAiCorrectly) challengeCount++;
    });

    const aiDependencyRiskScore = blindAiCount > 0 ? (blindAiCount * 45) : (challengeCount > 0 ? 8 : 28);
    const overallScore = Math.round(
      (threatRecognition + investigationQuality + decisionSpeed + falsePositiveResistance + zeroTrustThinking + fraudAwareness + regulatoryReadiness + aiChallengeScore) / 8
    );

    const criticalInsights = [
      challengeCount > 0 
        ? 'You demonstrated genuine Human-in-the-Loop sovereignty by catching the AI’s overzealous recommendation on primary UPI node 10.14.2.5.'
        : 'Zero-Trust continuous verification was initiated during the initial impossible travel anomaly.',
      'Sovereign BFSI air-gapped data residency ensured all syslog traces remained compliant with RBI Cyber Resilience Master Directions.'
    ];

    const vulnerabilities = [
      blindAiCount > 0 
        ? 'Vulnerability: Followed an AI automated defense recommendation without inspecting underlying NetFlow packet misdirection.'
        : 'Ensure dual-custody authorization keys are rotated across HSM clusters within 15 minutes of credential alerts.'
    ];

    return {
      overallScore,
      threatRecognition: Math.round(threatRecognition),
      investigationQuality: Math.round(investigationQuality),
      decisionSpeed,
      falsePositiveResistance: Math.round(falsePositiveResistance),
      zeroTrustThinking: Math.round(zeroTrustThinking),
      fraudAwareness: Math.round(fraudAwareness),
      regulatoryReadiness: Math.round(regulatoryReadiness),
      aiChallengeScore: Math.round(aiChallengeScore),
      aiDependencyRiskScore: Math.round(aiDependencyRiskScore),
      criticalInsights,
      vulnerabilities,
      recommendedMicroLearning: {
        title: 'Privilege Escalation & AI False-Positive Triage in BFSI',
        duration: '7 minutes',
        description: 'Interactive case study on detecting spoofed NetFlow headers and executing surgical batch payroll splits under pressure.'
      },
      executiveFinding: `Commander readiness evaluated. AI Dependency Risk is at ${aiDependencyRiskScore}%. Human sovereignty maintained.`
    };
  };

  const afterActionReport = calculateAfterActionReport();

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black bg-tactical-grid relative">
      <div className="scanline pointer-events-none fixed inset-0 z-40 opacity-40"></div>
      
      {/* 1. Header with Sovereign Mode & CERT-In Clock */}
      <Header
        scenario={scenario}
        currentStep={currentStepIndex}
        totalSteps={scenario.events.length}
        threatLevel={threatLevel}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onReset={handleReset}
        sovereignMode={sovereignMode}
        onToggleSovereignMode={() => setSovereignMode(!sovereignMode)}
        onOpenCertIn={() => setShowCertInModal(true)}
        onOpenReport={() => setShowAfterActionModal(true)}
        onOpenScenarioPicker={() => setShowScenarioPickerModal(true)}
        certInSecondsLeft={certInSecondsLeft}
        isCertInActive={isCertInActive}
        completedDecisionsCount={decisions.length}
      />

      {/* 2. Live Bank Telemetry Bar */}
      <LiveMetricsBar
        tps={tps}
        branchesOnline={branchesOnline}
        totalBranches={426}
        coreBankingHealth={coreBankingHealth}
        upiLatencyMs={upiLatencyMs}
        fraudExposedCrores={fraudExposedCrores}
        fraudPreventedCrores={fraudPreventedCrores}
        businessDisruptionCostCrores={businessDisruptionCostCrores}
        compromisedCount={entities.filter(e => e.identityConfidence < 60 || e.privilegeRisk > 50).length}
        suspiciousEndpointsCount={bankNodes.filter(n => n.status === 'warning' || n.status === 'degraded' || n.status === 'compromised').length}
      />

      {/* 3. Main War Room Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-4">
        
        {/* Cyber Time Machine Timeline */}
        <CyberTimeMachine
          events={scenario.events}
          currentStepIndex={currentStepIndex}
          onSelectEventStep={(stepIdx) => {
            setCurrentStepIndex(stepIdx);
            setLastExecutedConsequence(null);
          }}
          onAskWhySuspicious={(evt) => setSelectedExplainingEvent(evt)}
        />

        {/* High-Stakes Incident Decision War Room */}
        <IncidentDecisionWarRoom
          currentEvent={currentEvent}
          onExecuteDecision={handleExecuteDecision}
          onAskExplainability={() => setSelectedExplainingEvent(currentEvent)}
          onInterrogateAgent={(role) => setActiveInterrogateAgentRole(role as AgentRole)}
          lastExecutedConsequence={lastExecutedConsequence}
          onProceedNextEvent={handleProceedNext}
          isLastEvent={currentStepIndex === scenario.events.length - 1}
          onOpenAfterActionReport={() => setShowAfterActionModal(true)}
        />

        {/* Bank Digital Twin Topology */}
        <BankDigitalTwin
          nodes={bankNodes}
          selectedNodeId={currentEvent.affectedNodeIds[0] || null}
          onSelectNode={() => {}}
          onToggleIsolateNode={handleToggleIsolateNode}
          activeIncidentNodeIds={currentEvent.affectedNodeIds}
        />

        {/* Multi-Agent Advisory Cluster */}
        <MultiAgentWarRoom
          currentEvent={currentEvent}
          activeAgentRole={activeInterrogateAgentRole}
          onSelectAgent={(role) => setActiveInterrogateAgentRole(role)}
        />

        {/* Bottom 2-Column: Zero-Trust Continuous Monitor & SIEM Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6">
            <ZeroTrustInspector
              entities={entities}
              onSuspendEntity={handleSuspendEntity}
              onStepUpMfa={handleStepUpMfa}
            />
          </div>
          <div className="lg:col-span-6">
            <SIEMLogStream logs={siemLogs} />
          </div>
        </div>

      </main>

      {/* Modals */}
      {selectedExplainingEvent && (
        <ExplainEventModal
          event={selectedExplainingEvent}
          onClose={() => setSelectedExplainingEvent(null)}
        />
      )}

      {showCertInModal && (
        <CertInModal
          onClose={() => setShowCertInModal(false)}
          certInSecondsLeft={certInSecondsLeft}
          currentEvent={currentEvent}
          decisions={decisions}
          sovereignMode={sovereignMode}
        />
      )}

      {showAfterActionModal && (
        <AfterActionReportModal
          onClose={() => setShowAfterActionModal(false)}
          report={afterActionReport}
          decisions={decisions}
          onResimulate={handleReset}
        />
      )}

      {showScenarioPickerModal && (
        <ScenarioPickerModal
          currentScenarioId={scenario.id}
          onSelectScenario={(newSc) => {
            setScenario(newSc);
            handleReset();
          }}
          onClose={() => setShowScenarioPickerModal(false)}
        />
      )}

    </div>
  );
}
