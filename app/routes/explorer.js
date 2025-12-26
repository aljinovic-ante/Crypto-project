const express = require("express");
const client = require("../utils/client");

const router = express.Router();

router.get("/search/:query", async (req, res) => {
  const q = String(req.params.query || "").trim();
  const blockFromQuery = req.query.block ?? null;

  try {
    // -------- BLOCK BY HEIGHT --------
    if (/^\d+$/.test(q)) {
      const height = Number(q);
      const hash = await client.getBlockHash(height);
      const block = await client.getBlock(hash, 2);
      const stats = await client.getBlockStats(height);

      return res.json({
        type: "block",
        height,
        hash,
        time: block.time ?? null,
        txCount: block.tx.length,
        tx: block.tx,
        size: block.size ?? null,
        weight: block.weight ?? null,
        feeRange: stats?.feerate_percentiles ?? null,
        medianFee: stats?.medianfee ?? null,
        avgFee: stats?.avgfee ?? null,
        totalFee: stats?.totalfee ?? null,
        subsidy: stats?.subsidy ?? null,
        totalValue: stats?.total_out ?? null
      });
    }

    // -------- 64 HEX: BLOCK HASH OR TXID --------
    if (/^[a-fA-F0-9]{64}$/.test(q)) {
      // 1️⃣ PROVJERI JE LI OVO BLOCK HASH
      let block = null;
      try {
        const candidate = await client.getBlock(q, 2);
        if (candidate?.hash === q) block = candidate;
      } catch {}

      if (block) {
        const stats = await client.getBlockStats(block.height);

        return res.json({
          type: "block",
          height: block.height,
          hash: block.hash,
          time: block.time ?? null,
          txCount: block.tx.length,
          tx: block.tx,
          size: block.size ?? null,
          weight: block.weight ?? null,
          feeRange: stats?.feerate_percentiles ?? null,
          medianFee: stats?.medianfee ?? null,
          avgFee: stats?.avgfee ?? null,
          totalFee: stats?.totalfee ?? null,
          subsidy: stats?.subsidy ?? null,
          totalValue: stats?.total_out ?? null
        });
      }

      // 2️⃣ INAČE → TX (NEMA POGAĐANJA)
      let fullTx;

      if (blockFromQuery) {
        fullTx = await client.getRawTransaction(q, true, blockFromQuery);
      } else {
        fullTx = await client.getRawTransaction(q, true);
      }

      const vin = fullTx.vin ?? [];
      const vout = fullTx.vout ?? [];

      let inputValue = null;
      let fee = null;

      if (!vin.some(v => v.coinbase) && fullTx.blockhash) {
        let inSum = 0;
        for (const v of vin) {
          const prevTx = await client.getRawTransaction(v.txid, true);
          const prevOut = prevTx.vout[v.vout];
          inSum += Math.round(prevOut.value * 1e8);
        }

        let outSum = 0;
        for (const o of vout) outSum += Math.round(o.value * 1e8);

        inputValue = inSum;
        fee = inSum - outSum;
      }

      let outputValue = 0;
      for (const o of vout) outputValue += Math.round(o.value * 1e8);

      return res.json({
        type: "tx",
        txid: fullTx.txid,
        version: fullTx.version ?? null,
        size: fullTx.size ?? null,
        vsize: fullTx.vsize ?? null,
        weight: fullTx.weight ?? null,
        locktime: fullTx.locktime ?? null,
        blockhash: fullTx.blockhash ?? null,
        confirmations: fullTx.confirmations ?? null,
        vin,
        vout,
        inputValue,
        outputValue,
        fee
      });
    }

    res.status(400).json({ error: "Invalid input" });
  } catch (e) {
    res.status(404).json({ error: "Not found" });
  }
});

module.exports = router;
