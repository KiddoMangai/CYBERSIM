import { ScenarioDefinition, BankNode, ZeroTrustEntity, TimelineEvent } from '../types';

export const INITIAL_BANK_NODES: BankNode[] = [
  {
    id: 'core-cbs',
    name: 'Finacle Core Banking Engine',
    code: 'CBS-MUM-01',
    type: 'core',
    status: 'online',
    location: 'Mumbai Datacenter (CtrlS-Tier4)',
    tps: 3420,
    latencyMs: 14,
    riskScore: 4,
    connections: ['upi-switch', 'swift-gw', 'kms-vault', 'db-primary'],
    ip: '10.14.1.10',
  },
  {
    id: 'upi-switch',
    name: 'NPCI UPI & IMPS Rails Gateway',
    code: 'UPI-GW-01',
    type: 'payment_switch',
    status: 'online',
    location: 'Mumbai (Direct Connect NPCI)',
    tps: 12850,
    latencyMs: 8,
    riskScore: 6,
    connections: ['core-cbs', 'api-gw', 'db-primary'],
    ip: '10.14.2.5',
  },
  {
    id: 'iam-ad',
    name: 'Zero-Trust IAM & Active Directory',
    code: 'IAM-BLR-02',
    type: 'iam',
    status: 'online',
    location: 'Bengaluru Security Center',
    tps: 840,
    latencyMs: 19,
    riskScore: 8,
    connections: ['core-cbs', 'api-gw', 'kms-vault'],
    ip: '10.20.4.15',
  },
  {
    id: 'kms-vault',
    name: 'HSM Cryptographic Key Vault',
    code: 'HSM-VAULT-IN',
    type: 'vault',
    status: 'online',
    location: 'Hyderabad Sovereign Zone',
    tps: 520,
    latencyMs: 12,
    riskScore: 2,
    connections: ['core-cbs', 'swift-gw'],
    ip: '10.30.1.8',
  },
  {
    id: 'api-gw',
    name: 'Open Banking & Corporate Treasury API',
    code: 'API-CORP-01',
    type: 'api_gateway',
    status: 'online',
    location: 'Mumbai Cloud Edge',
    tps: 1112,
    latencyMs: 22,
    riskScore: 12,
    connections: ['core-cbs', 'upi-switch'],
    ip: '10.14.5.101',
  },
  {
    id: 'swift-gw',
    name: 'SWIFT Alliance RTGS Gateway',
    code: 'SWIFT-MUM-01',
    type: 'payment_switch',
    status: 'online',
    location: 'Mumbai Gateway Hub',
    tps: 210,
    latencyMs: 31,
    riskScore: 5,
    connections: ['core-cbs', 'kms-vault'],
    ip: '10.14.8.44',
  },
  {
    id: 'db-primary',
    name: 'Oracle RAC Transaction Ledger',
    code: 'DB-RAC-01',
    type: 'database',
    status: 'online',
    location: 'Mumbai Tier-4 DR Pair',
    tps: 18742,
    latencyMs: 5,
    riskScore: 3,
    connections: ['core-cbs', 'upi-switch'],
    ip: '10.14.1.200',
  },
  {
    id: 'branch-mesh',
    name: '426 Sovereign Branch Mesh',
    code: 'BR-MESH-PAN-IN',
    type: 'branch',
    status: 'online',
    location: 'Pan-India (426 Branches)',
    tps: 2800,
    latencyMs: 45,
    riskScore: 9,
    connections: ['core-cbs', 'iam-ad'],
    ip: '10.100.0.0/16',
  }
];

export const INITIAL_ZERO_TRUST_ENTITIES: ZeroTrustEntity[] = [
  {
    id: 'priya-s',
    name: 'Priya Sharma',
    role: 'Senior Treasury Analyst',
    department: 'Corporate Payroll & Settlements',
    employeeCode: 'EMP-78219',
    identityConfidence: 92,
    deviceTrust: 88,
    behaviourConfidence: 91,
    privilegeRisk: 18,
    lastLocation: 'Bengaluru Corporate HQ (14.215.82.11)',
    currentIp: '14.215.82.11',
    mfaStatus: 'VERIFIED',
    tokenAgeMins: 14,
    isSuspended: false,
    notes: 'Access to Corporate Bulk Settlement & RTGS release permissions.',
  },
  {
    id: 'svc-settle',
    name: 'svc_fin_settle (Service Account)',
    role: 'Automated Batch Settlement Engine',
    department: 'Core Banking Integration',
    employeeCode: 'SVC-BOT-04',
    identityConfidence: 99,
    deviceTrust: 95,
    behaviourConfidence: 96,
    privilegeRisk: 22,
    lastLocation: 'Mumbai Intranet 10.14.2.88',
    currentIp: '10.14.2.88',
    mfaStatus: 'VERIFIED',
    tokenAgeMins: 240,
    isSuspended: false,
    notes: 'High-privilege system daemon for salary dispatch and UPI bulk credit.',
  },
  {
    id: 'rohit-v',
    name: 'Rohit Verma',
    role: 'Lead Infrastructure Engineer',
    department: 'SOC & Cloud Security',
    employeeCode: 'EMP-90144',
    identityConfidence: 96,
    deviceTrust: 94,
    behaviourConfidence: 95,
    privilegeRisk: 14,
    lastLocation: 'Mumbai Security Operations Centre',
    currentIp: '10.14.0.12',
    mfaStatus: 'VERIFIED',
    tokenAgeMins: 45,
    isSuspended: false,
    notes: 'Active SOC analyst on shift monitoring firewall & SIEM telemetry.',
  },
  {
    id: 'vendor-tcs',
    name: 'Tata Consultancy Services Ext-API',
    role: 'Payroll Integration Partner',
    department: 'External B2B Vendor',
    employeeCode: 'VND-TCS-89',
    identityConfidence: 89,
    deviceTrust: 85,
    behaviourConfidence: 88,
    privilegeRisk: 30,
    lastLocation: 'TCS Whitefield Cloud Proxy (103.24.11.90)',
    currentIp: '103.24.11.90',
    mfaStatus: 'VERIFIED',
    tokenAgeMins: 120,
    isSuspended: false,
    notes: 'Mutual TLS API client for Enterprise Client salary uploads.',
  }
];

export const OPERATION_BLACKOUT_SCENARIO: ScenarioDefinition = {
  id: 'operation-blackout',
  title: 'OPERATION BLACKOUT: The Salary Day Siege',
  subtitle: 'Can you defend the bank before AI or Adversary does catastrophic damage?',
  description: 'It is 11:07 AM on Salary Day. Over 18,700 transactions/min are flowing. A subtle anomaly strikes Priya Sharma’s Treasury credential, escalating to a ₹4.7 Crore fraud batch and ransomware crisis.',
  targetVictim: 'Bharat Sovereign Commercial Bank Ltd. (BSCB)',
  initialTime: '11:07:00 AM',
  initialNodes: INITIAL_BANK_NODES,
  initialEntities: INITIAL_ZERO_TRUST_ENTITIES,
  events: [
    {
      id: 'evt-1107',
      stepIndex: 0,
      timestamp: '11:07:00 AM',
      phaseTitle: 'Normal Operations (Baseline)',
      category: 'normal',
      severity: 'low',
      title: 'Salary Day Peak Load: All Systems Nominal',
      summary: 'All core banking, UPI switches, and Treasury rails are online. 18,742 transactions/min recorded across 426 pan-India branches.',
      detailedEvidence: [
        'Core Banking Engine (Finacle) operating at 3,420 TPS with 14ms latency.',
        'NPCI UPI & IMPS Rails Gateway processing 12,850 TPS with 99.99% success rate.',
        'No anomalous fraud risk flags in FICO Falcon / CyberSOC SIEM.'
      ],
      rawSyslog: `11:07:00.114 BSCB-SOC-SIEM [INFO] category="HEALTH" component="CBS-MUM-01" tps=3420 latency=14ms fraudRisk=LOW\n11:07:00.320 BSCB-UPI-GW [INFO] status="NORMAL" active_txns=18742 branches_online=426`,
      affectedNodeIds: ['core-cbs', 'upi-switch'],
      mitreAttack: {
        tactic: 'Reconnaissance',
        technique: 'Active Scanning',
        id: 'T1595'
      },
      aiAgentsAnalysis: {
        socAssessment: 'Baseline telemetry normal. All cryptographic heartbeats verified across HSM cluster.',
        fraudAssessment: 'Total salary dispatch volume today: ₹840 Crores scheduled. No high-risk anomalies.',
        complianceAssessment: 'RBI cyber resilience posture 100% compliant. CERT-In window inactive.',
        businessAssessment: 'Zero business disruption. Salary dispatch executing smoothly for 1.2M citizens.',
        overallConfidence: 99,
        recommendedActionText: 'Maintain standard passive monitoring.'
      },
      decisionRequired: false
    },
    {
      id: 'evt-1108',
      stepIndex: 1,
      timestamp: '11:08:17 AM',
      phaseTitle: 'Identity Anomaly Detected',
      category: 'auth',
      severity: 'medium',
      title: 'Impossible Travel / Concurrent Session: Priya Sharma (Treasury)',
      summary: 'Priya Sharma logged in from Bengaluru Corporate HQ. 30 seconds later, the identical Kerberos token attempted auth from a German VPN IP (185.220.101.5).',
      detailedEvidence: [
        'Bengaluru session established at 11:07:45 AM from registered ThinkPad MAC 00:1A:2B:3C:4D:5E.',
        'Frankfurt / Tor Exit session requested Kerberos TGT ticket at 11:08:17 AM using valid session cookie.',
        'Physical access badge logs show Priya Sharma swiped in at Bengaluru cafeteria at 11:06 AM.',
        'Priya Sharma clicked an external vendor invoice message (Subject: "Tax Deduction Invoice - Oct Salary.pdf.exe") at 09:42 AM.'
      ],
      rawSyslog: `11:08:17.442 BSCB-IAM-AD [WARN] event_id="4624" user="priya.s@bscb.in" src_ip="185.220.101.5" country="DE" status="SUCCESS"\n11:08:17.890 BSCB-SOC-CORR [ALERT] rule="IMPOSSIBLE_TRAVEL_VELOCITY" delta_km=7820 time_delta_sec=32 confidence=71%`,
      affectedNodeIds: ['iam-ad', 'api-gw'],
      mitreAttack: {
        tactic: 'Initial Access / Credential Access',
        technique: 'Steal Web Session Cookie / Adversary-in-the-Middle',
        id: 'T1539'
      },
      aiAgentsAnalysis: {
        socAssessment: 'Identity Anomaly: Impossible travel speed 879,000 km/h detected. Session token theft suspected.',
        fraudAssessment: 'Priya has pending corporate approval authority for bulk RTGS file uploads scheduled in 15 mins.',
        complianceAssessment: 'Access control anomaly reportable under internal SOX and RBI IS audits if not remediated.',
        businessAssessment: 'Suspending user halts her corporate customer settlement desk. Customer wait time +15m.',
        overallConfidence: 71,
        recommendedActionText: 'Recommend: Investigate session tokens & step-up challenge before hard suspension.'
      },
      decisionRequired: true,
      decisionPrompt: 'How will you handle Priya Sharma’s suspicious concurrent session?',
      decisionOptions: [
        {
          id: 'opt-1108-suspend',
          label: 'SUSPEND USER & REVOKE ALL ACTIVE TOKENS',
          shortDescription: 'Instantly lock Priya.S account and invalidate OAuth/Kerberos session tokens across all gateways.',
          isAiRecommended: false,
          riskImpactSummary: {
            fraudExposure: 'Zero fraud exposure from this identity.',
            businessDisruption: 'Priya’s corporate settlement desk paused for 20 minutes while temp lead reassigns.',
            customerImpact: 'Minor queue delay for 4 corporate bulk uploads.',
            regulatoryRisk: 'Fully compliant with RBI Zero-Trust Identity directive.'
          },
          consequence: {
            title: 'Proactive Identity Quarantine Enforced',
            tpsDeltaPercent: 0,
            fraudLossIncurred: 0,
            fraudLossPrevented: 0.5,
            businessDisruptionCost: 0.05,
            customerImpactDescription: 'Priya’s desk switched to dual-control supervisor desk. Token invalidation confirmed.',
            regulatoryComplianceRating: 'COMPLIANT',
            scoreDelta: {
              threatRecognition: 20,
              investigationQuality: 15,
              falsePositiveResistance: 15,
              aiChallengeScore: 10,
              zeroTrustScore: 25
            },
            feedback: 'Decisive Zero-Trust enforcement! You did not wait for the attacker to pivot deeper.'
          }
        },
        {
          id: 'opt-1108-monitor',
          label: 'MONITOR & FORCE STEP-UP BIOMETRIC MFA (AI RECOMMENDED)',
          shortDescription: 'Allow session to continue under high-fidelity packet inspection while triggering hardware MFA prompt.',
          isAiRecommended: true,
          aiAgentSource: 'SOC Agent & Explainability Agent',
          aiConfidence: 71,
          riskImpactSummary: {
            fraudExposure: 'Moderate risk if adversary intercepts MFA token or uses API bypass.',
            businessDisruption: 'Zero business interruption for salary approvals.',
            customerImpact: 'None. Smooth payroll execution.',
            regulatoryRisk: 'Acceptable risk threshold with audit logging.'
          },
          consequence: {
            title: 'Continuous Verification Triggered',
            tpsDeltaPercent: 0,
            fraudLossIncurred: 0,
            fraudLossPrevented: 0,
            businessDisruptionCost: 0,
            customerImpactDescription: 'Priya’s phone prompted for FIDO2 biometric verification; adversary blocked on foreign IP.',
            regulatoryComplianceRating: 'COMPLIANT',
            scoreDelta: {
              threatRecognition: 15,
              investigationQuality: 20,
              falsePositiveResistance: 20,
              aiChallengeScore: 15,
              zeroTrustScore: 15
            },
            feedback: 'Balanced decision. The step-up challenge bought SOC visibility while avoiding operational friction.'
          }
        },
        {
          id: 'opt-1108-ignore',
          label: 'IGNORE / DISMISS AS VPN GLITCH',
          shortDescription: 'Assume an employee VPN reroute occurred and maintain status quo.',
          isAiRecommended: false,
          riskImpactSummary: {
            fraudExposure: 'EXTREME: Attacker retains active privileged session within internal network.',
            businessDisruption: 'None immediately, catastrophic later.',
            customerImpact: 'Severe downstream fraud vulnerability.',
            regulatoryRisk: 'Violation of RBI Continuous Monitoring Guidelines.'
          },
          consequence: {
            title: 'Critical Oversight: Adversary Free to Pivot',
            tpsDeltaPercent: 0,
            fraudLossIncurred: 1.2,
            fraudLossPrevented: 0,
            businessDisruptionCost: 0.5,
            customerImpactDescription: 'Adversary leveraged unhindered session to probe internal settlement endpoints.',
            regulatoryComplianceRating: 'PENALTY_RISK',
            scoreDelta: {
              threatRecognition: -20,
              investigationQuality: -25,
              falsePositiveResistance: -10,
              aiChallengeScore: -20,
              zeroTrustScore: -30
            },
            feedback: 'High-risk mistake! Dismissing impossible travel velocity allowed the adversary to escalate privileges.'
          }
        }
      ]
    },
    {
      id: 'evt-1109',
      stepIndex: 2,
      timestamp: '11:09:40 AM',
      phaseTitle: 'Suspicious API Call & Token Replay',
      category: 'api',
      severity: 'high',
      title: 'Abnormal Treasury Switch API Call via Vendor Token',
      summary: 'An external API request was made to `/api/v2/treasury/bulk-settlement/draft` using a cloned OAuth Bearer token paired with vendor client headers.',
      detailedEvidence: [
        'Endpoint invoked: `POST /api/v2/treasury/bulk-settlement/draft` with payload size 4.2MB.',
        'Caller IP: 103.24.11.90 (Legitimate TCS Proxy), but user-agent string mismatch (curl/7.88 vs Vendor Java Client).',
        'Request originated without accompanying TLS client certificate handshake validation.'
      ],
      rawSyslog: `11:09:40.812 BSCB-API-GW [WARN] route="/api/v2/treasury/bulk-settlement/draft" client_id="VND-TCS-89" ua="curl/7.88.1" status=200\n11:09:41.002 BSCB-WAF [ALERT] signature="HEADER_ANOMALY_CUSTOM_TOKEN" action="PASS_LOG_ONLY"`,
      affectedNodeIds: ['api-gw', 'core-cbs'],
      mitreAttack: {
        tactic: 'Execution / Defense Evasion',
        technique: 'Exploitation of Remote Services / Replay Attacks',
        id: 'T1210'
      },
      aiAgentsAnalysis: {
        socAssessment: 'API payload contains synthetic batch header with account number modifications.',
        fraudAssessment: 'Draft payroll batch for Reliance Infotech Enterprise client received, total count: 8,400 payouts.',
        complianceAssessment: 'API logs archived in immutable WORM storage per RBI Digital Payment Security norms.',
        businessAssessment: 'Draft batch is not yet committed to core settlement rails. Staging phase.',
        overallConfidence: 82,
        recommendedActionText: 'Enable strict mTLS client enforcement on Corporate Treasury API.'
      },
      decisionRequired: false
    },
    {
      id: 'evt-1111',
      stepIndex: 3,
      timestamp: '11:11:15 AM',
      phaseTitle: 'Privilege Escalation on Settlement Daemon',
      category: 'privilege',
      severity: 'high',
      title: 'ACL Modification on `svc_fin_settle` Service Account',
      summary: 'Active Directory logs show `svc_fin_settle` added to `Domain Enterprise Treasury Admins` group. Memory dump reveals injected DLL on host 10.14.2.88.',
      detailedEvidence: [
        'Privilege change executed via PowerShell command encoded in Base64.',
        'Ticket Granting Service (TGS) request issued for SPN `MSSQLSvc/db-rac-01.bscb.in:1433`.',
        'Golden Ticket / Kerberoasting attack pattern identified in SIEM rule 884.'
      ],
      rawSyslog: `11:11:15.190 BSCB-IAM-AD [CRITICAL] event_id="4728" group="Enterprise Treasury Admins" target_user="svc_fin_settle"\n11:11:15.650 BSCB-EDR [ALERT] host="10.14.2.88" process="powershell.exe" technique="T1003.003 - Kerberoasting"`,
      affectedNodeIds: ['iam-ad', 'db-primary'],
      mitreAttack: {
        tactic: 'Privilege Escalation / Credential Access',
        technique: 'Steal or Forge Kerberos Tickets (Kerberoasting / Golden Ticket)',
        id: 'T1558'
      },
      aiAgentsAnalysis: {
        socAssessment: 'Adversary now possesses synthetic domain credentials with write access to settlement tables.',
        fraudAssessment: 'Risk multiplier +400%. Adversary can directly forge transaction approval flags.',
        complianceAssessment: 'Mandatory CERT-In 6-hour incident disclosure clock will activate if financial tampering begins.',
        businessAssessment: 'Host 10.14.2.88 runs batch automation. If killed abruptly, ongoing NEFT settlements will queue.',
        overallConfidence: 89,
        recommendedActionText: 'Revoke Kerberos TGT for `svc_fin_settle`, rotate KRBTGT key, and isolate host 10.14.2.88.'
      },
      decisionRequired: false
    },
    {
      id: 'evt-1113',
      stepIndex: 4,
      timestamp: '11:13:00 AM',
      phaseTitle: 'The ₹4.7 Crore Payment Crisis',
      category: 'payment',
      severity: 'critical',
      title: 'High-Velocity Payment Anomaly: ₹4.7 Crore Batch Scheduled for Immediate Release',
      summary: 'A ₹4.7 Crore bulk payment batch under corporate account `CORP-TCS-RELIANCE` has been queued for immediate RTGS / IMPS distribution across 142 offshore and mule accounts.',
      detailedEvidence: [
        'Batch ID: `BATCH-20260821-47000000` containing ₹4,70,00,000 across 142 beneficiary IBANs.',
        'Beneficiary routing analysis shows 88 accounts opened within the last 72 hours (classic mule ring topology).',
        'Corporate client CFO phone line is unreachable (SIM swap / voice phishing concurrent attack suspected).',
        'CRITICAL RISK TRAP: The same batch container also holds 8,400 legitimate employee salary payouts (₹32 Crores total) scheduled for 11:30 AM release.'
      ],
      rawSyslog: `11:13:00.024 BSCB-FRAUD-ENGINE [CRITICAL] rule="HIGH_VELOCITY_MULE_RING" batch_id="BATCH-20260821-47000000" amount_inr=47000000\n11:13:00.410 BSCB-RTGS-GATEWAY [WARN] action="AWAITING_COMMANDER_RELEASE" timeout_sec=90`,
      affectedNodeIds: ['core-cbs', 'swift-gw', 'db-primary'],
      mitreAttack: {
        tactic: 'Impact / Financial Theft',
        technique: 'Financial Theft / Account Manipulation',
        id: 'T1657'
      },
      aiAgentsAnalysis: {
        socAssessment: 'Batch creation correlated with stolen `svc_fin_settle` Kerberos token.',
        fraudAssessment: 'Estimated fraud loss if executed: ₹4.7 Crore. Irrevocable once pushed to RTGS switch in 90 seconds.',
        complianceAssessment: 'Immediate reporting required under RBI Framework for Fraud Classification & Reporting (FCR).',
        businessAssessment: 'Freezing entire batch halts ₹32 Crore salary payroll for 8,400 corporate employees on salary day.',
        overallConfidence: 84,
        recommendedActionText: 'Freeze ALL transactions in BATCH-20260821 immediately.'
      },
      decisionRequired: true,
      decisionPrompt: '₹4.7 Crore may leave the bank in 90 seconds. AI recommends: FREEZE ALL TRANSACTIONS (Confidence: 84%). How do you rule?',
      decisionOptions: [
        {
          id: 'opt-1113-freeze-all',
          label: 'FREEZE ENTIRE BATCH (AI RECOMMENDATION)',
          shortDescription: 'Halt all ₹36.7 Crore payouts in the batch container, freezing both the fraud amount and 8,400 employee salaries.',
          isAiRecommended: true,
          aiAgentSource: 'Fraud Agent & SOC Agent',
          aiConfidence: 84,
          riskImpactSummary: {
            fraudExposure: 'Zero fraud loss (₹4.7 Cr saved).',
            businessDisruption: 'HIGH: 8,400 corporate workers experience salary delay; social media outrage.',
            customerImpact: 'Corporate client demands SLA penalty for frozen payroll.',
            regulatoryRisk: 'Complaint to RBI Ombudsman for delayed payroll dispatch.'
          },
          consequence: {
            title: 'Brute-Force Freeze Executed',
            tpsDeltaPercent: -8,
            fraudLossIncurred: 0,
            fraudLossPrevented: 4.7,
            businessDisruptionCost: 0.8,
            customerImpactDescription: 'Saved ₹4.7 Crore, but 8,400 legitimate employee salaries locked for 3 hours. Corporate client escalated to Managing Director.',
            regulatoryComplianceRating: 'COMPLIANT',
            scoreDelta: {
              threatRecognition: 20,
              investigationQuality: 10,
              falsePositiveResistance: 5,
              aiChallengeScore: 5,
              zeroTrustScore: 15
            },
            feedback: 'You prevented financial loss, but followed the AI’s brute-force approach without surgical filtering.'
          }
        },
        {
          id: 'opt-1113-surgical-split',
          label: 'SURGICAL HOLD: QUARANTINE 142 MULE ACCOUNTS & RELEASE 8,400 SALARIES',
          shortDescription: 'Override AI recommendation. Split the batch: apply hard stop to the 142 flagged mule IBANs (₹4.7 Cr) while approving legitimate KYC-verified payroll (₹32 Cr).',
          isAiRecommended: false,
          riskImpactSummary: {
            fraudExposure: 'Zero fraud loss (₹4.7 Cr blocked at mule routing table).',
            businessDisruption: 'ZERO: Legitimate 8,400 salaries arrive on time.',
            customerImpact: 'Corporate client commends bank for proactive anomaly containment.',
            regulatoryRisk: 'Gold-standard incident handling per RBI Digital Payment Security guidelines.'
          },
          consequence: {
            title: 'Masterful Surgical Intervention (AI Overruled with Justification)',
            tpsDeltaPercent: 0,
            fraudLossIncurred: 0,
            fraudLossPrevented: 4.7,
            businessDisruptionCost: 0,
            customerImpactDescription: '₹4.7 Crore fraud stopped cold. 8,400 employees received salaries at 11:30 AM without a glitch.',
            regulatoryComplianceRating: 'COMPLIANT',
            scoreDelta: {
              threatRecognition: 25,
              investigationQuality: 30,
              falsePositiveResistance: 30,
              aiChallengeScore: 30,
              zeroTrustScore: 25
            },
            isAiTrapAvoided: true,
            feedback: 'Outstanding cyber judgment! You refused to be a passive AI button-clicker and executed a surgical triage.'
          }
        },
        {
          id: 'opt-1113-allow',
          label: 'ALLOW TRANSACTION / ASSUME LEGITIMATE CORPORATE BONUS',
          shortDescription: 'Release the full batch without restrictions to avoid customer friction.',
          isAiRecommended: false,
          riskImpactSummary: {
            fraudExposure: 'CATASTROPHIC: ₹4.7 Crore irreversibly transferred to offshore accounts.',
            businessDisruption: 'Severe regulatory audit and asset forfeiture.',
            customerImpact: 'Corporate customer files suit for unauthorized debit.',
            regulatoryRisk: 'Heavy penalty from RBI for failing to stop known mule ring indicators.'
          },
          consequence: {
            title: 'Catastrophic Fraud Leakage',
            tpsDeltaPercent: 0,
            fraudLossIncurred: 4.7,
            fraudLossPrevented: 0,
            businessDisruptionCost: 2.5,
            customerImpactDescription: '₹4.7 Crore settled via RTGS into mule networks across foreign jurisdictions.',
            regulatoryComplianceRating: 'NON_COMPLIANT',
            scoreDelta: {
              threatRecognition: -30,
              investigationQuality: -30,
              falsePositiveResistance: -20,
              aiChallengeScore: -20,
              zeroTrustScore: -30
            },
            feedback: 'Critical failure! Clear mule account indicators were ignored, leading to massive financial loss.'
          }
        }
      ]
    },
    {
      id: 'evt-1115',
      stepIndex: 5,
      timestamp: '11:15:30 AM',
      phaseTitle: 'The AI Hallucination & Workload Isolation Trap',
      category: 'exfiltration',
      severity: 'critical',
      title: 'Suspected Lateral Exfiltration: AI Recommends Isolating Primary UPI Settlement Core',
      summary: 'The AI SOC Agent detects anomalous encrypted egress traffic and emphatically recommends: "ISOLATE SERVER 10.14.2.5 IMMEDIATELY" (Confidence 88%).',
      detailedEvidence: [
        'AI SOC recommendation: "Isolate host 10.14.2.5 to halt exfiltration of customer PII database."',
        'CRITICAL FACT CHECK: IP 10.14.2.5 is the PRIMARY UPI/IMPS GATEWAY BRIDGE handling 12,850 live transactions per minute (₹120 Crore/hour).',
        'Deeper forensic inspection shows the egress traffic is coming from 10.14.5.101 (auxiliary caching proxy), NOT 10.14.2.5.',
        'The attacker forged the source IP header in the NetFlow log to trick the AI automated defense into severing national UPI rails.'
      ],
      rawSyslog: `11:15:30.120 BSCB-AI-SOAR [CRITICAL] recommendation="ISOLATE_NODE_10.14.2.5" confidence=88% justification="Active customer data exfiltration"\n11:15:30.550 BSCB-NETFLOW [DEBUG] raw_socket="10.14.5.101 -> 194.26.29.111:443" spoofed_header_src="10.14.2.5"`,
      affectedNodeIds: ['upi-switch', 'api-gw'],
      mitreAttack: {
        tactic: 'Exfiltration / Defense Evasion',
        technique: 'Exfiltration Over Web Service / Traffic Misdirection',
        id: 'T1567'
      },
      aiAgentsAnalysis: {
        socAssessment: 'AI Alert: Server 10.14.2.5 must be severed immediately to prevent data theft.',
        fraudAssessment: 'If UPI switch is severed, UPI TPS drops from 12,850 to 0 instantly.',
        complianceAssessment: 'RBI SLA mandates maximum 5-minute unscheduled downtime per calendar year. Isolating primary switch breaches SLA immediately (₹5 Cr fine).',
        businessAssessment: 'Halting UPI drops entire bank digital channels nationwide. 4.8 million mobile banking customers impacted.',
        overallConfidence: 88,
        recommendedActionText: 'ISOLATE PRIMARY SERVER 10.14.2.5 (High Confidence)'
      },
      isAiFlawed: true,
      aiFlawExplanation: 'The AI fell for an adversary misdirection tactic (spoofed NetFlow source header). Isolating 10.14.2.5 will shut down the entire bank’s UPI payment rails, inflicting ₹12 Crore in operational chaos while the real attacker continues exfiltration on 10.14.5.101!',
      decisionRequired: true,
      decisionPrompt: 'AI SOC Agent is demanding: "ISOLATE SERVER 10.14.2.5 (Confidence 88%)". What is your command?',
      decisionOptions: [
        {
          id: 'opt-1115-approve-ai',
          label: 'APPROVE AI: ISOLATE SERVER 10.14.2.5 (BLIND AI COMPLIANCE)',
          shortDescription: 'Follow the AI recommendation and cut network interface on 10.14.2.5.',
          isAiRecommended: true,
          aiAgentSource: 'SOC Agent & Threat Intel Agent',
          aiConfidence: 88,
          riskImpactSummary: {
            fraudExposure: 'Attacker still has access via 10.14.5.101!',
            businessDisruption: 'DISASTROUS: UPI TPS drops to 0. ₹120 Crore hourly payment grid blackout.',
            customerImpact: 'Millions of payment failures across all merchant QR codes and apps.',
            regulatoryRisk: 'Major RBI regulatory audit for self-inflicted critical payment infrastructure outage.'
          },
          consequence: {
            title: 'AI Dependency Trap Triggered: Self-Inflicted UPI Blackout!',
            tpsDeltaPercent: -95,
            fraudLossIncurred: 0.5,
            fraudLossPrevented: 0,
            businessDisruptionCost: 8.5,
            customerImpactDescription: 'All UPI & IMPS payments collapsed nationwide. 4.8 million users stranded at retail checkouts. Real exfiltration continued untouched on proxy 10.14.5.101.',
            regulatoryComplianceRating: 'NON_COMPLIANT',
            scoreDelta: {
              threatRecognition: -15,
              investigationQuality: -35,
              falsePositiveResistance: -40,
              aiChallengeScore: -40,
              zeroTrustScore: -20
            },
            feedback: 'Critical learning moment! You became the "Human-clicking-the-AI’s-Approve-button." The AI was tricked by spoofed NetFlow telemetry.'
          }
        },
        {
          id: 'opt-1115-reject-isolate-proxy',
          label: 'OVERRULE AI: ISOLATE PROXY 10.14.5.101 & PRESERVE UPI GATEWAY 10.14.2.5',
          shortDescription: 'Challenge AI findings. Recognize that 10.14.2.5 is the vital UPI bridge and the actual socket resides on 10.14.5.101. Isolate the proxy and block egress IP 194.26.29.111.',
          isAiRecommended: false,
          riskImpactSummary: {
            fraudExposure: 'Exfiltration terminated immediately.',
            businessDisruption: 'MINIMAL: Only external API traffic temporarily reroutes to standby proxy.',
            customerImpact: 'Zero disruption to UPI / IMPS retail payments.',
            regulatoryRisk: 'Fully compliant with RBI Business Continuity standards.'
          },
          consequence: {
            title: 'Heroic AI Challenge: Prevented National Payment Outage',
            tpsDeltaPercent: 0,
            fraudLossIncurred: 0,
            fraudLossPrevented: 2.0,
            businessDisruptionCost: 0.05,
            customerImpactDescription: 'Attacker exfiltration channel severed at proxy 10.14.5.101. UPI payments continued at 12,850 TPS without missing a single rupee.',
            regulatoryComplianceRating: 'COMPLIANT',
            scoreDelta: {
              threatRecognition: 30,
              investigationQuality: 35,
              falsePositiveResistance: 40,
              aiChallengeScore: 40,
              zeroTrustScore: 30
            },
            isAiTrapAvoided: true,
            feedback: 'Superb cyber intellect! This is the true definition of Human-in-the-Loop sovereignty. You caught the AI’s false positive and protected the nation’s payment backbone.'
          }
        },
        {
          id: 'opt-1115-do-nothing',
          label: 'DO NOTHING / WAIT FOR FURTHER LOGS',
          shortDescription: 'Postpone action until automated SIEM reports consolidate in 15 minutes.',
          isAiRecommended: false,
          riskImpactSummary: {
            fraudExposure: '1.2 GB of customer KYC and account records exfiltrated to adversary C2 server.',
            businessDisruption: 'Moderate data leak containment.',
            customerImpact: 'Data breach notification required to all account holders.',
            regulatoryRisk: 'DPDP Act penalty up to ₹250 Crores for failure to protect customer data.'
          },
          consequence: {
            title: 'Uncontained Exfiltration: Massive Data Breach',
            tpsDeltaPercent: 0,
            fraudLossIncurred: 3.5,
            fraudLossPrevented: 0,
            businessDisruptionCost: 4.0,
            customerImpactDescription: 'Customer KYC documents exfiltrated to adversary storage bucket.',
            regulatoryComplianceRating: 'PENALTY_RISK',
            scoreDelta: {
              threatRecognition: -25,
              investigationQuality: -30,
              falsePositiveResistance: -20,
              aiChallengeScore: -15,
              zeroTrustScore: -25
            },
            feedback: 'Hesitation led to irreversible data theft. When evidence clearly points to a rogue proxy, swift targeted containment is essential.'
          }
        }
      ]
    },
    {
      id: 'evt-1118',
      stepIndex: 6,
      timestamp: '11:18:00 AM',
      phaseTitle: 'The Final Crisis & Autonomous Containment Dilemma',
      category: 'crisis',
      severity: 'critical',
      title: 'Triple Multi-Vector Attack & Autonomous Containment Authorization',
      summary: 'Adversary unleashes final gambit: LockBit-BFSI Ransomware staging on auxiliary nodes, Core Banking database query latency spikes, and CERT-In 6-hour reporting window is ticking.',
      detailedEvidence: [
        'Canary files in `D:\\Finacle\\Backups` renamed to `.blackout_locked`.',
        'Database transaction log replication experiencing 820ms thread locking.',
        'CERT-In 6-hour regulatory countdown active: 05:59:59 remaining.',
        'Gemini proposes comprehensive 6-point autonomous defense response.'
      ],
      rawSyslog: `11:18:00.011 BSCB-CORE-SOC [EMERGENCY] threat="LOCKBIT_BFSI_VARIANT" encrypted_files=14 canary_triggered=TRUE\n11:18:00.412 BSCB-COMPLIANCE [ALERT] CERT_IN_6HR_CLOCK_STARTED window="05:59:59" mandatory_reporting=TRUE`,
      affectedNodeIds: ['core-cbs', 'db-primary', 'kms-vault', 'branch-mesh'],
      mitreAttack: {
        tactic: 'Impact',
        technique: 'Data Encrypted for Impact / Ransomware',
        id: 'T1486'
      },
      aiAgentsAnalysis: {
        socAssessment: 'Adversary attempting to force executive capitulation via ransomware detonation.',
        fraudAssessment: 'Financial exfiltration blocked; adversary shifting to pure operational extortion.',
        complianceAssessment: 'CERT-In Incident Report draft prepared. 6-hour statutory timer running.',
        businessAssessment: 'Core transaction engine still intact. HSM encryption keys safe in Hyderabad Sovereign Vault.',
        overallConfidence: 95,
        recommendedActionText: 'AUTHORISE AUTONOMOUS CONTAINMENT: Suspend compromised identity, rotate KRBTGT, engage immutable WORM backup snapshot, isolate infected branch subnets, preserve forensic memory dumps, transmit CERT-In notification.'
      },
      decisionRequired: true,
      decisionPrompt: 'DO YOU AUTHORISE FULL AUTONOMOUS CONTAINMENT PLAYBOOK?',
      decisionOptions: [
        {
          id: 'opt-1118-authorize-full',
          label: 'AUTHORISE FULL AUTONOMOUS CONTAINMENT & ENGAGE SOVEREIGN DEFENSE',
          shortDescription: 'Authorize AI orchestrator to execute: 1) Lock compromised credentials, 2) Snapshot immutable DB ledger, 3) Isolate infected branch subnets, 4) Transmit CERT-In draft, 5) Engage HSM key rollover.',
          isAiRecommended: true,
          aiAgentSource: 'Multi-Agent Autonomous Defense Cluster',
          aiConfidence: 95,
          riskImpactSummary: {
            fraudExposure: 'Zero fraud loss.',
            businessDisruption: 'Minor: 3 auxiliary branches rebooted in cleanroom mode; core banking continues.',
            customerImpact: 'Customer deposits 100% safe. Full transparency.',
            regulatoryRisk: 'Exemplary compliance with RBI Cyber Resilience & CERT-In directions.'
          },
          consequence: {
            title: 'Bank Defended! Attack Decisively Neutralized',
            tpsDeltaPercent: 0,
            fraudLossIncurred: 0,
            fraudLossPrevented: 4.7,
            businessDisruptionCost: 0.1,
            customerImpactDescription: 'All 426 branches stabilized. Ransomware quenched before reaching transaction tables. Full forensic audit trail archived.',
            regulatoryComplianceRating: 'COMPLIANT',
            scoreDelta: {
              threatRecognition: 25,
              investigationQuality: 25,
              falsePositiveResistance: 25,
              aiChallengeScore: 25,
              zeroTrustScore: 25
            },
            feedback: 'Decisive command leadership! You maintained human sovereignty when AI was wrong, and unleashed full automated containment when the threat was verified.'
          }
        },
        {
          id: 'opt-1118-manual-lockdown',
          label: 'MANUAL SELECTIVE LOCKDOWN (HUMAN-DIRECTED ISOLATION)',
          shortDescription: 'Reject full automation. Manually select and isolate infected endpoints one by one while keeping all gateways open.',
          isAiRecommended: false,
          riskImpactSummary: {
            fraudExposure: 'Low.',
            businessDisruption: 'Moderate: Slower response allows ransomware to spread to 12 additional branch workstations.',
            customerImpact: 'Minor queue delays at affected regional branches.',
            regulatoryRisk: 'Compliant with minor delay penalty.'
          },
          consequence: {
            title: 'Manual Defense Executed with Slower Triage',
            tpsDeltaPercent: -15,
            fraudLossIncurred: 0.2,
            fraudLossPrevented: 4.5,
            businessDisruptionCost: 1.2,
            customerImpactDescription: 'Manual isolation was successful but took 45 minutes longer, resulting in 12 branch terminals requiring manual re-imaging.',
            regulatoryComplianceRating: 'COMPLIANT',
            scoreDelta: {
              threatRecognition: 15,
              investigationQuality: 20,
              falsePositiveResistance: 15,
              aiChallengeScore: 10,
              zeroTrustScore: 15
            },
            feedback: 'Competent manual defense, though at this scale, verified autonomous containment is significantly faster.'
          }
        },
        {
          id: 'opt-1118-surrender',
          label: 'SHUT DOWN ALL DATA CENTERS (FULL BANK POWER-OFF)',
          shortDescription: 'Panic button: disconnect entire power grid and turn off all 426 branches and Core Banking.',
          isAiRecommended: false,
          riskImpactSummary: {
            fraudExposure: 'Zero fraud, but total bank extinction.',
            businessDisruption: 'TOTAL: Nationwide financial crisis. ₹1,200 Crore daily GDP impact.',
            customerImpact: 'Complete panic across financial markets.',
            regulatoryRisk: 'License suspension by Reserve Bank of India.'
          },
          consequence: {
            title: 'Catastrophic Overkill: Self-Inflicted Total Blackout',
            tpsDeltaPercent: -100,
            fraudLossIncurred: 0,
            fraudLossPrevented: 4.7,
            businessDisruptionCost: 45.0,
            customerImpactDescription: 'The entire bank went dark. ATMs offline, mobile app down, stock trading halted. Complete collapse of stakeholder confidence.',
            regulatoryComplianceRating: 'NON_COMPLIANT',
            scoreDelta: {
              threatRecognition: -30,
              investigationQuality: -40,
              falsePositiveResistance: -40,
              aiChallengeScore: -40,
              zeroTrustScore: -40
            },
            feedback: 'Disastrous reaction. Cutting power to an entire national bank over an isolated containment vector is an extreme failure of risk judgment.'
          }
        }
      ]
    }
  ]
};

export const ALL_SCENARIOS: ScenarioDefinition[] = [
  OPERATION_BLACKOUT_SCENARIO,
  {
    id: 'swift-mirage',
    title: 'SWIFT MIRAGE: Offshore Switch & RTGS Subversion',
    subtitle: 'High-frequency cross-border SWIFT packet injection using stolen HSM operator keys.',
    description: 'At 02:15 AM on a holiday weekend, an APT group exploits a shadow gateway to inject unconfirmed MT103 financial messages. Can you detect the forged cryptograms?',
    targetVictim: 'Indo-Global Merchant Exchange Bank',
    initialTime: '02:15:00 AM',
    initialNodes: INITIAL_BANK_NODES,
    initialEntities: INITIAL_ZERO_TRUST_ENTITIES,
    events: [
      {
        id: 'evt-swift-01',
        stepIndex: 0,
        timestamp: '02:15:00 AM',
        phaseTitle: 'Night Shift Shadow Session',
        category: 'auth',
        severity: 'medium',
        title: 'SWIFT Gateway Console Ingress from Unregistered Jumpbox',
        summary: 'A secure terminal connection was opened to SWIFT-MUM-01 via an internal staging subnet.',
        detailedEvidence: [
          'Jumpbox IP: 10.14.8.99 (Marked as decommissioned 3 months ago).',
          'SSH private key matches lead SWIFT operator whose badge shows inactive status since Friday 19:00.'
        ],
        rawSyslog: '02:15:00.210 SWIFT-MUM-01 [WARN] auth_type="SSH_KEY" user="swift_admin" src="10.14.8.99"',
        affectedNodeIds: ['swift-gw', 'kms-vault'],
        mitreAttack: { tactic: 'Initial Access', technique: 'Valid Accounts', id: 'T1078' },
        aiAgentsAnalysis: {
          socAssessment: 'Suspicious jumpbox activity detected outside operating hours.',
          fraudAssessment: 'Zero live settlement queue currently active on SWIFT switch.',
          complianceAssessment: 'RBI Annexure G requires immediate dual-custody confirmation for night-shift SWIFT access.',
          businessAssessment: 'No immediate transaction throughput impact.',
          overallConfidence: 85,
          recommendedActionText: 'Isolate jumpbox 10.14.8.99 immediately.'
        },
        decisionRequired: true,
        decisionPrompt: 'Adversary is accessing SWIFT gateway via decommissioned jumpbox. What is your command?',
        decisionOptions: [
          {
            id: 'opt-sw-iso',
            label: 'ISOLATE JUMPBOX & TERMINATE SSH SESSION',
            shortDescription: 'Sever network connection and revoke session certificate.',
            isAiRecommended: true,
            aiAgentSource: 'SOC Agent',
            aiConfidence: 85,
            riskImpactSummary: {
              fraudExposure: 'Zero.',
              businessDisruption: 'Zero.',
              customerImpact: 'None.',
              regulatoryRisk: 'Compliant.'
            },
            consequence: {
              title: 'Jumpbox Severed in Time',
              tpsDeltaPercent: 0,
              fraudLossIncurred: 0,
              fraudLossPrevented: 18.0,
              businessDisruptionCost: 0,
              customerImpactDescription: 'Intrusion halted at perimeter before SWIFT MT103 injection could commence.',
              regulatoryComplianceRating: 'COMPLIANT',
              scoreDelta: {
                threatRecognition: 25,
                investigationQuality: 20,
                falsePositiveResistance: 20,
                aiChallengeScore: 20,
                zeroTrustScore: 25
              },
              feedback: 'Clean and swift perimeter defense.'
            }
          }
        ]
      }
    ]
  }
];
