const express = require("express");
const router = express.Router();
const Stock = require("../models/Stock");

//Get All Stocks
router.get("/", async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get One Stock
router.get("/:id", getStock, (req, res) => {
  res.json(res.stock);
});

// Add Stock
router.post("/", async (req, res) => {
  const stock = new Stock({
    name: req.body.name,
    ticker: req.body.ticker,
    price: req.body.price,
    date: req.body.date,
  });
  try {
    const newStock = await stock.save();
    res.status(201).json(newStock);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Stock
router.patch("/:id", getStock, async (req, res) => {
  try {
    if (req.body.name != null) {
      res.stock.name = req.body.name;
    }
    if (req.body.ticker != null) {
      res.stock.ticker = req.body.ticker;
    }
    if (req.body.price != null) {
      res.stock.price = req.body.price;
    }
    const updatedStock = await res.stock.save();
    res.json({ updatedStock });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// Delete Stock
router.delete("/:id", getStock, async (req, res) => {
  try {
    await res.stock.remove();
    res.json({ message: "Deleted stock" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Middleware to get stock
async function getStock(req, res, next) {
  let stock;
  try {
    stock = await Stock.findById(req.params.id);
    if (stock == null) {
      return res.status(404).json({ message: "Cannot find stock" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.stock = stock;
  next();
}

module.exports = router;
