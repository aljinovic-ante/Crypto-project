require("dotenv").config();
const express = require("express");
const cors = require("cors");

const explorerRoutes = require("./routes/explorer");
const exchangeRoutes = require("./routes/exchange");
const mempoolRoutes = require("./routes/mempool");
const blocksRoutes = require("./routes/blocks");

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/api/blocks", blocksRoutes);
app.use("/api/explorer", explorerRoutes);
app.use("/api/exchange", exchangeRoutes);
app.use("/api/mempool", mempoolRoutes);
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});
