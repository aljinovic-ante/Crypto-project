const express = require("express");
const client = require("../utils/client");
const { parseCoinbaseTag } = require("./coinbase");

const router = express.Router();

router.get("/latest", async (req, res) => {
  try {
    const count = 10;
    const tip = await client.getBlockCount();
    const blocks = [];

    for (let i = 0; i < count; i++) {
      const height = tip - i;
      const hash = await client.getBlockHash(height);
      const block = await client.getBlock(hash, 2);

      const coinbaseHex = block.tx[0]?.vin?.[0]?.coinbase ?? null;
      const minerTag = parseCoinbaseTag(coinbaseHex);

      blocks.push({
        height,
        hash,
        time: block.time,
        txCount: block.tx.length,
        minerTag,
        minerCoinbase: coinbaseHex,
        btcEur: null
      });
    }

    res.json(blocks);
  } catch (e) {
    console.error(e);
    res.status(500).json([]);
  }
});

module.exports = router;
