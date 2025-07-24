import express from "express";
import Alpaca from "@alpacahq/alpaca-trade-api";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // to read JSON bodies in POST requests

const alpaca = new Alpaca({
  keyId: process.env.APCA_API_KEY_ID,
  secretKey: process.env.APCA_API_SECRET_KEY,
  paper: true,
});

// Root route
app.get("/", (req, res) => {
  res.send("Alpaca backend is running ✅");
});

// Get account details
app.get("/account", async (req, res) => {
  try {
    const account = await alpaca.getAccount();
    res.json(account);
  } catch (error) {
    console.error("Account error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Buy stock
app.post("/buy", async (req, res) => {
  const { symbol, qty } = req.body;
  try {
    const order = await alpaca.createOrder({
      symbol,
      qty,
      side: "buy",
      type: "market",
      time_in_force: "gtc",
    });
    res.json(order);
  } catch (error) {
    console.error("Buy order error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Sell stock
app.post("/sell", async (req, res) => {
  const { symbol, qty } = req.body;
  try {
    const order = await alpaca.createOrder({
      symbol,
      qty,
      side: "sell",
      type: "market",
      time_in_force: "gtc",
    });
    res.json(order);
  } catch (error) {
    console.error("Sell order error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get current positions
app.get("/positions", async (req, res) => {
  try {
    const positions = await alpaca.getPositions();
    res.json(positions);
  } catch (error) {
    console.error("Positions error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
