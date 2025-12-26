require("dotenv").config();
const Client = require("bitcoin-core");

const client = new Client({
  host: `http://${process.env.RPC_HOST}:${process.env.RPC_PORT}`,
  username: process.env.RPC_USER,
  password: process.env.RPC_PASS,
});

module.exports = client;
