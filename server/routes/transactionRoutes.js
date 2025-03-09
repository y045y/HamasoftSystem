const express = require("express");
const router = express.Router();
const { 
    getTransactionHistory, 
    insertTransaction, 
    deleteTransaction, 
    updateTransaction, 
    importCSVFile, 
    exportToCSV, 
    exportToDenominationsCSV 
} = require("../controllers/transactionController");

// 取引履歴を取得するルート
router.get("/transaction-history", getTransactionHistory);

// 取引を挿入するルート
router.post("/insert-and-calculate-transaction", insertTransaction);

// 取引を削除するルート
router.delete("/transactions/:id", deleteTransaction);

// 取引を更新するルート
router.put("/update-transaction-and-denomination/:id", updateTransaction);

// CSVファイルをインポートするルート
router.post("/import-csv", importCSVFile);

// 取引データをCSVでエクスポートするルート
router.get("/export-transactions", exportToCSV);

// 金庫の状態をCSVでエクスポートするルート
router.get("/export-denominations", exportToDenominationsCSV);

module.exports = router;
