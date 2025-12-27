const express = require("express");
const router = express.Router();

router.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const interval = setInterval(() => {
    const tx = {
      txid: [...Array(64)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join(""),
      value: +(Math.random() * 2).toFixed(4),
      fee: +(Math.random() * 0.001).toFixed(6),
      vsize: Math.floor(Math.random() * 200 + 100),
      timestamp: Math.floor(Date.now() / 1000)
    };

    res.write(`data: ${JSON.stringify(tx)}\n\n`);
  }, 800);

  req.on("close", () => {
    clearInterval(interval);
  });
});

module.exports = router;
