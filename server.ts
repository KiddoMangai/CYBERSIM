import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CyberSim X Bank Breach War Room Engine',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 2. Interrogate Specialized AI Agent
app.post('/api/gemini/agent-consult', async (req, res) => {
  try {
    const { agentRole, query, currentEvent, bankState } = req.body;

    const agentPersonas: Record<string, string> = {
      red: 'You are the RED AGENT (Adversary Simulator) in CyberSim X. You safely simulate adversary tactics (MITRE ATT&CK T1539, T1558, T1657, T1486) against a digital twin bank. You explain how an APT attacker thinks, weaponizes credentials, and exploits automated defenses.',
      soc: 'You are the SOC AGENT in CyberSim X. You analyze SIEM logs, authentication telemetry, EDR alerts, and network connections. You balance security containment with transaction continuity.',
      threat_intel: 'You are the THREAT INTELLIGENCE AGENT in CyberSim X. You correlate IOCs, known ransomware playbooks, and threat actor behavior.',
      fraud: 'You are the FRAUD & AML AGENT in CyberSim X. You evaluate payment velocity, corporate payroll batch integrity, mule account rings, and direct financial loss risks.',
      compliance: 'You are the COMPLIANCE AGENT in CyberSim X. You strictly enforce CERT-In 6-hour mandatory reporting timelines, RBI Cyber Resilience Framework, and Digital Payment Security controls.',
      business_impact: 'You are the BUSINESS IMPACT AGENT in CyberSim X. You calculate customer disruption, UPI throughput SLA penalties, and business continuity fallout.',
      explainability: 'You are the EXPLAINABILITY AGENT (XAI) in CyberSim X. Your job is to dissect AI reasoning, show supporting evidence, and WARN the human commander when AI recommendations may be overzealous, biased, or tricked by adversary misdirection.',
    };

    const systemPrompt = `${agentPersonas[agentRole] || 'You are an AI Cyber Security War Room Agent.'}
Respond professionally, concisely, and with high tactical banking security insight. Always emphasize evidence and human sovereign command. Keep response under 150 words.`;

    const ai = getGeminiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `Context: The bank is experiencing the following incident state:
Current Incident: ${JSON.stringify(currentEvent || {})}
Bank Telemetry: ${JSON.stringify(bankState || {})}
Human Commander's Question: "${query}"

Provide your expert agent analysis:`,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      return res.json({
        agentRole,
        response: response.text || 'Agent telemetry processed. Standby for commander directive.',
        source: 'gemini-3.7-flash',
      });
    } else {
      // Fallback high-fidelity dynamic response if API key is not yet set
      const fallbackResponses: Record<string, string> = {
        red: `[Red Agent Insight] We leveraged the stolen session token from the phishing attachment. If you isolate the primary switch naively, our misdirection succeeds and takes down your UPI rails.`,
        soc: `[SOC Telemetry] SIEM rule #884 flagged anomalous Kerberos ticket forging. Ensure dual-custody verification before executing server severance.`,
        fraud: `[Fraud Engine] ₹4.7 Crore in the batch is tied to newly created mule accounts, while ₹32 Crore belongs to legitimate KYC-verified employee payroll. A surgical split preserves payroll.`,
        compliance: `[Compliance Sentinel] CERT-In 6-hour regulatory clock is running. Ensure digital custody of syslog buffers before executing remediation.`,
        business_impact: `[Business Impact] Severing host 10.14.2.5 directly violates the RBI 5-minute maximum unscheduled downtime SLA. Keep primary rails open.`,
        explainability: `[XAI Analysis] The AI model assigned 88% confidence to isolation based solely on spoofed NetFlow headers. Verify socket binding on 10.14.5.101 before approving!`,
      };

      return res.json({
        agentRole,
        response: fallbackResponses[agentRole] || `Agent telemetry reviewed. Correlating evidence across all banking telemetry streams.`,
        source: 'local-sovereign-agent',
      });
    }
  } catch (error: any) {
    console.error('Error in agent-consult:', error);
    res.status(500).json({ error: error.message || 'Agent query failed' });
  }
});

// 3. Deep Explainability for Timeline Events ("Why is this suspicious?")
app.post('/api/gemini/explain-event', async (req, res) => {
  try {
    const { event } = req.body;
    const ai = getGeminiClient();

    if (ai && event) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `Analyze this cyber incident event in a high-stakes banking war room:
Title: ${event.title}
Timestamp: ${event.timestamp}
Category: ${event.category}
Detailed Evidence: ${JSON.stringify(event.detailedEvidence)}
Raw Syslog: ${event.rawSyslog}
MITRE ATT&CK: ${JSON.stringify(event.mitreAttack)}
Is AI Flawed / Trap?: ${event.isAiFlawed ? 'YES - ' + event.aiFlawExplanation : 'NO'}

Explain clearly to the human commander:
1. Why this is suspicious (Forensic Indicators)
2. Attack Path Correlation
3. The Trap to Avoid (Why blindly following AI recommendation could be dangerous here)
4. Recommended Sovereign Action`,
        config: {
          systemInstruction: 'You are the CyberSim X Explainability Engine. Deliver sharp, forensic-grade explanations of cyber telemetry in banking environments.',
        },
      });

      return res.json({
        explanation: response.text,
        source: 'gemini-3.7-flash',
      });
    } else {
      return res.json({
        explanation: `### Forensic Investigation Summary
**1. Forensic Indicators:**
- Anomalous telemetry detected in ${event?.title || 'current node'}.
- Token velocity and source IP deviations violate Zero-Trust baseline.

**2. Attack Path Correlation:**
- Aligns with MITRE ATT&CK ${event?.mitreAttack?.id || 'T1539'}: ${event?.mitreAttack?.technique || 'Credential Access'}.

**3. Human-in-the-Loop Check:**
- ${event?.isAiFlawed ? `⚠️ CAUTION: AI recommendation has a critical blind spot! ${event.aiFlawExplanation}` : 'AI recommendations are aligned with raw logs, but verify business continuity impact before applying containment.'}`,
        source: 'local-sovereign-agent',
      });
    }
  } catch (error: any) {
    console.error('Error in explain-event:', error);
    res.status(500).json({ error: error.message || 'Explanation failed' });
  }
});

// 4. Generate Dynamic BFSI Scenario
app.post('/api/gemini/generate-scenario', async (req, res) => {
  try {
    const { theme, targetBank } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `Create a high-stakes BFSI cyber breach scenario titled around "${theme || 'AI Deepfake Wire Heist'}" for bank "${targetBank || 'State Apex Financial'}". Include 4 progressive timeline events, MITRE ATT&CK tags, and one subtle AI hallucination/trap where the AI recommends an overzealous action that would cause massive business disruption. Return concise JSON.`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      try {
        const scenario = JSON.parse(response.text || '{}');
        return res.json({ scenario, source: 'gemini-3.7-flash' });
      } catch (err) {
        return res.json({ scenario: null, raw: response.text, source: 'gemini-3.7-flash' });
      }
    } else {
      return res.json({
        scenario: {
          title: `Operation ${theme || 'Cloud Vault Breach'}`,
          subtitle: `Autonomous multi-stage intrusion on ${targetBank || 'Bharat Sovereign Bank'}`,
          targetVictim: targetBank || 'Bharat Sovereign Bank',
        },
        source: 'local-sovereign-agent',
      });
    }
  } catch (error: any) {
    console.error('Error in generate-scenario:', error);
    res.status(500).json({ error: error.message || 'Scenario generation failed' });
  }
});

// Vite Middleware for development & static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CyberSim X] Sovereign Bank Breach War Room Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
