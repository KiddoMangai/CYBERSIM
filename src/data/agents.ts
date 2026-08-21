import { AgentInfo } from '../types';

export const AI_AGENTS: AgentInfo[] = [
  {
    role: 'red',
    name: 'Red Agent (Adversary Simulation)',
    avatar: '🔴',
    badgeColor: 'bg-red-500/20 border-red-500/50 text-red-400',
    tagline: 'Synthetic Adversary & Dynamic TTPs',
    currentStatus: 'Executing Operation Blackout (T1539 -> T1558 -> T1657 -> T1486)',
    confidence: 94
  },
  {
    role: 'soc',
    name: 'SOC Agent (SIEM & EDR Sentinel)',
    avatar: '🔵',
    badgeColor: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
    tagline: 'Log Analysis, Identity & Endpoint Correlation',
    currentStatus: 'Monitoring 18,742 TPS and 426 branch telemetry nodes',
    confidence: 88
  },
  {
    role: 'threat_intel',
    name: 'Threat Intel Agent (Global IOCs)',
    avatar: '🟣',
    badgeColor: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
    tagline: 'MITRE ATT&CK & APT Campaign Attribution',
    currentStatus: 'Correlating IP signatures with BFSI Ransomware campaign',
    confidence: 91
  },
  {
    role: 'fraud',
    name: 'Fraud & AML Agent (Velocity Engine)',
    avatar: '🟠',
    badgeColor: 'bg-amber-500/20 border-amber-500/50 text-amber-400',
    tagline: 'Transaction Behavior & Mule Ring Detection',
    currentStatus: 'Inspecting ₹4.7 Crore RTGS/IMPS salary batch hash',
    confidence: 84
  },
  {
    role: 'compliance',
    name: 'Compliance Agent (RBI & CERT-In)',
    avatar: '🟢',
    badgeColor: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400',
    tagline: 'CERT-In 6-Hour Window & RBI Control Mapping',
    currentStatus: 'Auditing reporting deadlines & digital evidence custody',
    confidence: 96
  },
  {
    role: 'business_impact',
    name: 'Business Impact Agent (SLA & Uptime)',
    avatar: '🟡',
    badgeColor: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    tagline: 'Customer Disruption & Financial Loss Calculus',
    currentStatus: 'Calculating real-time UPI transaction throughput impact',
    confidence: 89
  },
  {
    role: 'explainability',
    name: 'Explainability Agent (XAI & Trap Sentinel)',
    avatar: '⚪',
    badgeColor: 'bg-slate-500/20 border-slate-400/50 text-slate-200',
    tagline: 'Transparent Reasoning & AI Blind-Spot Detection',
    currentStatus: 'Unpacking AI confidence scores & false-positive risks',
    confidence: 95
  }
];
