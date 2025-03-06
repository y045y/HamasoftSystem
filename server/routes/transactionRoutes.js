// server/routes/transactionRoute.js

const express = require("express");
const router = express.Router();
const { getTransactionHistory } = require("../controllers/transactionController");

router.get("/transaction-history", getTransactionHistory);

module.exports = router;
