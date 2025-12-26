const express = require("express");
const client = require("../utils/client");

const router = express.Router();

router.get("/search/:query", async (req, res) => {
  console.log("🔥 HIT /search:", req.params.query);

  const q = req.params.query.trim();

  try {
    // 1️⃣ BLOCK HEIGHT (broj)
    if (/^\d+$/.test(q)) {
      const height = Number(q);

      const hash = await client.getBlockHash(height);
      const block = await client.getBlock(hash, 2);
      const stats = await client.getBlockStats(height);

      return res.json({
        type: "block",
        height,
        hash,
        time: block.time,
        txCount: block.tx.length,
        size: block.size,
        weight: block.weight,
        feeRange: stats.feerate_percentiles ?? null,
        medianFee: stats.medianfee ?? null,
        avgFee: stats.avgfee ?? null,
        totalFee: stats.totalfee ?? null,
        subsidy: stats.subsidy ?? null,
        totalValue: stats.total_out ?? null
      });
    }

    // 2️⃣ HEX STRING (64 chars) → BLOCK HASH or TXID
    if (/^[a-fA-F0-9]{64}$/.test(q)) {
      // 2a️⃣ TRY BLOCK HASH
      try {
        const block = await client.getBlock(q, 2);
        const stats = await client.getBlockStats(block.height);

        return res.json({
          type: "block",
          height: block.height,
          hash: q,
          time: block.time,
          txCount: block.tx.length,
          size: block.size,
          weight: block.weight,
          feeRange: stats.feerate_percentiles ?? null,
          medianFee: stats.medianfee ?? null,
          avgFee: stats.avgfee ?? null,
          totalFee: stats.totalfee ?? null,
          subsidy: stats.subsidy ?? null,
          totalValue: stats.total_out ?? null
        });
      } catch {
        // ignore → try TX
      }

      // 2b️⃣ TRY TRANSACTION
      const tx = await client.getRawTransaction(q, true);

      return res.json({
        type: "tx",
        txid: tx.txid,
        size: tx.size,
        vinCount: tx.vin.length,
        voutCount: tx.vout.length
      });
    }

    res.status(400).json({ error: "Invalid input" });
  } catch (e) {
    console.error("❌ RPC ERROR:", e.message);
    res.status(404).json({ error: "Not found" });
  }
});


module.exports = router;
