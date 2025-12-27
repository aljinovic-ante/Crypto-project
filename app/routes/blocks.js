const express = require("express");
const client = require("../utils/client");
const { parseCoinbaseTag } = require("./coinbase");

const router = express.Router();

router.get("/latest/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  let lastHeight = null;

  const sendBlock = async (height) => {
    const hash = await client.getBlockHash(height);
    const block = await client.getBlock(hash, 2);

    const coinbaseHex = block.tx[0]?.vin?.[0]?.coinbase ?? null;
    const minerTag = parseCoinbaseTag(coinbaseHex);

    const payload = {
      height,
      hash,
      time: block.time,
      txCount: block.tx.length,
      minerTag,
      minerCoinbase: coinbaseHex
    };

    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  try {
    const tip = await client.getBlockCount();
    lastHeight = tip;

    for (let i = 0; i < 15; i++) {
      await sendBlock(tip - i);
    }

    const interval = setInterval(async () => {
      try {
        const currentTip = await client.getBlockCount();

        if (currentTip > lastHeight) {
          for (let h = lastHeight + 1; h <= currentTip; h++) {
            await sendBlock(h);
          }
          lastHeight = currentTip;
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    }, 10000);

    req.on("close", () => {
      clearInterval(interval);
    });
  } catch (e) {
    console.error("STREAM ERROR:", e);
    res.end();
  }
});

module.exports = router;
