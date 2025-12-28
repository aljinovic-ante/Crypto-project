const express = require("express");
const router = express.Router();
const client = require("../utils/client");

router.get("/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let alive = true;
  req.on("close", () => (alive = false));

  const seen = new Set();

  while (alive) {
    let mempool;

    try {
      mempool = await client.getRawMempool();
    } catch {
      await new Promise(r => setTimeout(r, 1000));
      continue;
    }

    for (const txid of mempool) {
      if (!alive) break;
      if (seen.has(txid)) continue;

      seen.add(txid);

      try {
        const tx = await client.getRawTransaction(txid, true);
        const entry = await client.getMempoolEntry(txid);

        const payload = {
          txid,
          value: tx.vout.reduce((s, o) => s + o.value, 0),
          fee: entry.fees?.base ?? null,
          vsize: entry.vsize ?? null,
          timestamp: Math.floor(Date.now() / 1000)
        };

        res.write(`data: ${JSON.stringify(payload)}\n\n`);
      } catch {}
    }

    if (seen.size > 5000) seen.clear();
    await new Promise(r => setTimeout(r, 2000));
  }
});

module.exports = router;
