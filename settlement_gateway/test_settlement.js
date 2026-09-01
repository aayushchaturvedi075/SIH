const assert = require("assert");
const { generateCaseMerkleRoot, generateSection65BCertificate } = require("./cert_hasher");
const algorandClient = require("./algorand_client");

async function runTests() {
  console.log("Running Layer 11 Blockchain & x402 Automated Tests...\n");

  // Test 1: Merkle Root Calculation
  const dossier = {
    ncrp_id: "NCRP-DEMO-894321",
    total_loss_inr: 4250000.0,
    victim_token: "TOK_ARVIND_UP_NOIDA",
    target_atm: "ATM-UP-NOI-042"
  };
  const { merkleRoot } = generateCaseMerkleRoot(dossier);
  assert(merkleRoot && merkleRoot.length === 64, "Merkle Root must be a 64-char SHA-256 hash");
  console.log("✓ Test 1 Passed: SHA-256 Merkle Root generated (" + merkleRoot.substring(0, 16) + "...)");

  // Test 2: Algorand Testnet Anchoring
  const algoTx = await algorandClient.anchorEvidence("NCRP-DEMO-894321", merkleRoot);
  assert(algoTx.success === true, "Algorand anchor must succeed");
  assert(algoTx.txId.startsWith("ALGO-TX-"), "Transaction ID must follow ALGO-TX format");
  assert(algoTx.round > 40000000, "Block round must be valid Testnet round");
  console.log("✓ Test 2 Passed: Anchored to Algorand Testnet (TxID: " + algoTx.txId.substring(0, 20) + "..., Round: #" + algoTx.round + ")");

  // Test 3: Section 65B Certificate Generation
  const cert = generateSection65BCertificate(dossier, algoTx);
  assert(cert.certificate_id.startsWith("CERT-SEC65B-"), "Must produce Section 65B Certificate ID");
  assert(cert.hash_verification_status === "VERIFIED_TAMPER_PROOF", "Must be verified tamper-proof");
  console.log("✓ Test 3 Passed: Section 65B Indian Evidence Act Certificate generated (" + cert.certificate_id + ")");

  // Test 4: Verification
  const verification = algorandClient.verifyEvidence(algoTx.txId, merkleRoot);
  assert(verification.tamper_evident_check === "PASSED_100_PERCENT", "Tamper check must pass 100%");
  console.log("✓ Test 4 Passed: On-chain tamper-proof verification passed 100%");

  console.log("\n=============================================");
  console.log("ALL 4 LAYER 11 TESTS PASSED SUCCESSFULLY!");
  console.log("=============================================");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
