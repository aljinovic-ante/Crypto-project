const express = require("express");
const client = require("../utils/client");

const router = express.Router();

router.get("/latest", async (req, res) => {
  try {
    const tip = await client.getBlockCount();
    const blocks = [];

    for (let i = tip; i > tip - 10; i--) {
      const hash = await client.getBlockHash(i);
      const block = await client.getBlock(hash, 1);

      blocks.push({
        height: i,
        hash,
        time: block.time,
        txCount: block.tx.length
      });
    }

    res.json(blocks);
  } catch (e) {
    res.status(500).json({ error: "Failed to load blocks" });
  }
});

module.exports = router;
