export type AgentRole =
  | 'red'
  | 'soc'
  | 'threat_intel'
  | 'fraud'
  | 'compliance'
  | 'business_impact'
  | 'explainability'
  | 'commander';

export interface AgentInfo {
  role: AgentRole;
  name: string;
  avatar: string;
  badgeColor: string;
  tagline: string;
  currentStatus: string;
  confidence: number;
}

export type NodeStatus = 'online' | 'warning' | 'degraded' | 'compromised' | 'isolated' | 'offline';

export interface BankNode {
  id: string;
  name: string;
  code: string;
  type: 'core' | 'payment_switch' | 'iam' | 'vault' | 'api_gateway' | 'branch' | 'database';
  status: NodeStatus;
  location: string;
  tps: number;
  latencyMs: number;
  riskScore: number; // 0 to 100
  connections: string[]; // target node ids
  ip: string;
  isIsolated?: boolean;
}

export interface ZeroTrustEntity {
  id: string;
  name: string;
  role: string;
  department: string;
  employeeCode: string;
  identityConfidence: number; // 0 - 100
  deviceTrust: number; // 0 - 100
  behaviourConfidence: number; // 0 - 100
  privilegeRisk: number; // 0 - 100
  lastLocation: string;
  currentIp: string;
  mfaStatus: 'VERIFIED' | 'FAILED' | 'BYPASSED' | 'STEP_UP_REQUIRED';
  tokenAgeMins: number;
  isSuspended: boolean;
  notes: string;
}

export interface DecisionConsequence {
  title: string;
  tpsDeltaPercent: number;
  fraudLossIncurred: number; // in INR Crores
  fraudLossPrevented: number;
  businessDisruptionCost: number; // in INR Crores
  customerImpactDescription: string;
  regulatoryComplianceRating: 'COMPLIANT' | 'PENALTY_RISK' | 'NON_COMPLIANT';
  scoreDelta: {
    threatRecognition: number;
    investigationQuality: number;
    falsePositiveResistance: number;
    aiChallengeScore: number;
    zeroTrustScore: number;
  };
  feedback: string;
  isAiTrapAvoided?: boolean;
  wasAiOverruledIncorrectly?: boolean;
}

export interface DecisionOption {
  id: string;
  label: string;
  shortDescription: string;
  isAiRecommended?: boolean;
  aiAgentSource?: string;
  aiConfidence?: number;
  riskImpactSummary: {
    fraudExposure: string;
    businessDisruption: string;
    customerImpact: string;
    regulatoryRisk: string;
  };
  consequence: DecisionConsequence;
}

export interface TimelineEvent {
  id: string;
  timestamp: string; // e.g. "11:07:00 AM"
  stepIndex: number;
  phaseTitle: string;
  category: 'auth' | 'api' | 'privilege' | 'payment' | 'exfiltration' | 'ransomware' | 'normal' | 'crisis';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  summary: string;
  detailedEvidence: string[];
  rawSyslog: string;
  affectedNodeIds: string[];
  mitreAttack: {
    tactic: string;
    technique: string;
    id: string;
  };
  aiAgentsAnalysis: {
    socAssessment: string;
    fraudAssessment: string;
    complianceAssessment: string;
    businessAssessment: string;
    overallConfidence: number;
    recommendedActionText: string;
  };
  isAiFlawed?: boolean;
  aiFlawExplanation?: string;
  decisionRequired: boolean;
  decisionPrompt?: string;
  decisionOptions?: DecisionOption[];
  isCompleted?: boolean;
  selectedOptionId?: string;
}

export interface DecisionRecord {
  eventId: string;
  eventTitle: string;
  optionId: string;
  optionLabel: string;
  timestamp: string;
  followedAiBlindly: boolean;
  challengedAiCorrectly: boolean;
  timeSpentSeconds: number;
  consequenceApplied: DecisionConsequence;
}

export interface CyberDecisionReadinessProfile {
  overallScore: number;
  threatRecognition: number;
  investigationQuality: number;
  decisionSpeed: number;
  falsePositiveResistance: number;
  zeroTrustThinking: number;
  fraudAwareness: number;
  regulatoryReadiness: number;
  aiChallengeScore: number;
  aiDependencyRiskScore: number; // 0 (great human oversight) to 100 (dangerous blind AI compliance)
  criticalInsights: string[];
  vulnerabilities: string[];
  recommendedMicroLearning: {
    title: string;
    duration: string;
    description: string;
  };
  executiveFinding: string;
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  targetVictim: string;
  initialTime: string;
  events: TimelineEvent[];
  initialNodes: BankNode[];
  initialEntities: ZeroTrustEntity[];
}

export interface LiveSIEMLog {
  id: string;
  time: string;
  source: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  category: string;
  message: string;
  ip: string;
  user?: string;
}
