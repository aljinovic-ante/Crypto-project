const express = require("express");

const router = express.Router();

router.get("/price", async (req, res) => {
  const { fromId, to } = req.query;

  try {
    const r = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${fromId}&vs_currencies=${to}`
    );
    const data = await r.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: "price fetch failed" });
  }
});

router.get("/history", async (req, res) => {
  const { fromId, to, days } = req.query;

  try {
    const r = await fetch(
      `https://api.coingecko.com/api/v3/coins/${fromId}/market_chart?vs_currency=${to}&days=${days}`
    );
    const data = await r.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: "history fetch failed" });
  }
});

module.exports = router;
