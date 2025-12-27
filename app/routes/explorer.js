const express = require("express");
const client = require("../utils/client");
const { parseCoinbaseTag } = require("./coinbase");

const router = express.Router();

router.get("/search/:query", async (req, res) => {
  const q = String(req.params.query || "").trim();
  const blockFromQuery = req.query.block ?? null;

  try {
    if (/^\d+$/.test(q)) {
      const height = Number(q);
      const tip = await client.getBlockCount();

      if (height > tip) {
        return res.status(404).json({ error: "Block not found" });
      }

      const hash = await client.getBlockHash(height);
      const block = await client.getBlock(hash, 2);
      const stats = await client.getBlockStats(height);

      const coinbaseHex = block.tx[0]?.vin?.[0]?.coinbase ?? null;
      const minerTag = parseCoinbaseTag(coinbaseHex);

      return res.json({
        type: "block",
        height,
        hash,
        time: block.time ?? null,
        txCount: block.tx.length,
        tx: block.tx,
        size: block.size ?? null,
        weight: block.weight ?? null,
        medianFee: stats?.medianfee ?? null,
        avgFee: stats?.avgfee ?? null,
        totalFee: stats?.totalfee ?? null,
        subsidy: stats?.subsidy ?? null,
        totalValue: stats?.total_out ?? null,
        minerTag,
        minerCoinbase: coinbaseHex
      });
    }

    if (/^[a-fA-F0-9]{64}$/.test(q)) {
      try {
        const block = await client.getBlock(q, 2);

        if (block?.hash === q) {
          const stats = await client.getBlockStats(block.height);
          const coinbaseHex = block.tx[0]?.vin?.[0]?.coinbase ?? null;
          const minerTag = parseCoinbaseTag(coinbaseHex);

          return res.json({
            type: "block",
            height: block.height,
            hash: block.hash,
            time: block.time ?? null,
            txCount: block.tx.length,
            tx: block.tx,
            size: block.size ?? null,
            weight: block.weight ?? null,
            medianFee: stats?.medianfee ?? null,
            avgFee: stats?.avgfee ?? null,
            totalFee: stats?.totalfee ?? null,
            subsidy: stats?.subsidy ?? null,
            totalValue: stats?.total_out ?? null,
            minerTag,
            minerCoinbase: coinbaseHex
          });
        }
      } catch {}

      let fullTx;
      try {
        fullTx = blockFromQuery
          ? await client.getRawTransaction(q, true, blockFromQuery)
          : await client.getRawTransaction(q, true);
      } catch {
        return res.status(404).json({ error: "Not found" });
      }

      const vinWithValue = [];

      for (const v of fullTx.vin ?? []) {
        if (v.coinbase) {
          vinWithValue.push(v);
          continue;
        }

        const prevTx = await client.getRawTransaction(v.txid, true);
        const prevOut = prevTx.vout[v.vout];

        vinWithValue.push({
          ...v,
          value: Math.round(prevOut.value * 1e8)
        });
      }

      const vout = fullTx.vout ?? [];

      let inputValue = null;
      let fee = null;

      if (!vinWithValue.some(v => v.coinbase) && fullTx.blockhash) {
        let inSum = 0;
        for (const v of vinWithValue) {
          if (typeof v.value === "number") inSum += v.value;
        }

        let outSum = 0;
        for (const o of vout) {
          outSum += Math.round(o.value * 1e8);
        }

        inputValue = inSum;
        fee = inSum - outSum;
      }

      let outputValue = 0;
      for (const o of vout) {
        outputValue += Math.round(o.value * 1e8);
      }

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
        vin: vinWithValue,
        vout,
        inputValue,
        outputValue,
        fee
      });
    }

    return res.status(400).json({ error: "Invalid input" });

  } catch (e) {
    console.error("SEARCH ERROR:", e);
    res.status(500).json({ error: "Internal error" });
  }
});

module.exports = router;
