const express = require("express");
const cors = require("cors");
const algorandClient = require("./algorand_client");
const { generateCaseMerkleRoot, generateSection65BCertificate } = require("./cert_hasher");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ==========================================================
// x402 Protocol Middleware (Agentic Access & Micro-Settlement)
// ==========================================================
function x402AgenticAuth(req, res, next) {
  const agentToken = req.header("X-Agent-Authorization") || req.header("X-402-Token");
  const agentAgency = req.header("X-Agent-Agency") || "CBI_INTERPOL_GATEWAY";

  // Valid agency authorization tokens for prototype demonstration
  const VALID_AGENT_KEYS = [
    "AGENT_AUTH_I4C_MHA_2026_SECURE",
    "AGENT_AUTH_CBI_CYBER_CRIME_DESK",
    "AGENT_AUTH_NPCI_CFCFRMS_BOT"
  ];

  if (!agentToken || !VALID_AGENT_KEYS.includes(agentToken)) {
    return res.status(402).json({
      error: "402 Payment / Statutory Authorization Required",
      protocol: "x402 Agentic Data Exchange Protocol v1.2",
      facilitator: "GoPlausible Facilitator & Algorand Micropayments",
      terms: {
        required_header: "X-Agent-Authorization",
        statutory_mandate: "Section 91 CrPC / Inter-Agency MoU Required",
        settlement_network: "Algorand Testnet",
        cost_microalgos: 1000,
        authorization_url: "https://goplausible.io/facilitator/auth/mha-i4c"
      }
    });
  }

  req.authenticatedAgent = {
    agency: agentAgency,
    token: agentToken,
    authorizedAt: new Date().toISOString()
  };
  next();
}

// ==========================================================
// Layer 11 REST Endpoints
// ==========================================================

// 1. Anchor Case Dossier to Algorand Testnet
app.post("/api/v1/settlement/anchor", async (req, res) => {
  try {
    const caseDossier = req.body || {};
    const caseId = caseDossier.ncrp_id || "NCRP-DEMO-894321";

    // 1. Generate SHA-256 Merkle Evidence Root
    const { merkleRoot } = generateCaseMerkleRoot(caseDossier);

    // 2. Commit transaction note to Algorand Testnet
    const algoTx = await algorandClient.anchorEvidence(caseId, merkleRoot);

    // 3. Generate Official Section 65B / 63 BSA Digital Certificate
    const cert = generateSection65BCertificate(caseDossier, algoTx);

    res.json({
      status: "ANCHORED_TO_BLOCKCHAIN_SUCCESSFULLY",
      case_id: caseId,
      merkle_root: merkleRoot,
      blockchain_tx: algoTx,
      section_65b_certificate: cert
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Verify On-Chain Transaction Hash
app.get("/api/v1/settlement/verify/:txId", (req, res) => {
  const { txId } = req.params;
  const verification = algorandClient.verifyEvidence(txId);
  res.json(verification);
});

// 3. x402 Protected Agentic Access Endpoint
app.get("/api/v1/agent/forensic-dossier/:caseId", x402AgenticAuth, (req, res) => {
  const { caseId } = req.params;
  res.json({
    status: "ACCESS_GRANTED_X402",
    authenticated_agent: req.authenticatedAgent,
    case_id: caseId,
    dossier_data: {
      victim: "Citizen Case #894321 (Encrypted SHA-256)",
      loss_inr: 4250000.0,
      mule_nodes_count: 5,
      target_atm: "ATM-UP-NOI-042 (HDFC Sector 62 E-Lobby)",
      prediction_confidence: 94.2,
      statutory_freeze_issued: true
    }
  });
});

// 4. Gateway Health
app.get("/health", (req, res) => {
  res.json({
    service: "IntelliTrace Layer 11 Settlement Gateway",
    protocol: "x402 Protocol & GoPlausible Facilitator",
    blockchain: "Algorand Testnet",
    status: "LIVE_OPERATIONAL",
    port: PORT
  });
});

app.listen(PORT, () => {
  console.log(`[Layer 11] x402 & Algorand Settlement Gateway running on http://localhost:${PORT}`);
});
