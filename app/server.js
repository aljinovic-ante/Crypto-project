require("dotenv").config();
const express = require("express");
const cors = require("cors");

const explorerRoutes = require("./routes/explorer");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());


const blocksRoutes = require("./routes/blocks");
app.use("/api/blocks", blocksRoutes);

app.use("/api/explorer", explorerRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

const exchangeRoutes = require("./routes/exchange");
app.use("/api/exchange", exchangeRoutes);

app.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});
