const { 
    getTransactionHistoryFromService, 
    insertTransactionToService, 
    deleteTransactionFromService, 
    updateTransactionInService, 
    importCSVFileToService, 
    exportTransactionsToCSVService, 
    exportDenominationsToCSVService 
} = require("../services/transactionService");  // サービスのインポート

const json2csv = require('json2csv').parse;  // CSVに変換するためのライブラリ

// 1. 取引履歴を取得するコントローラ
const getTransactionHistory = async (req, res) => {
    const { startDate } = req.query;
    if (!startDate) {
        return res.status(400).json({ error: "❌ `startDate` パラメータが必要です。" });
    }
    
    try {
        const results = await getTransactionHistoryFromService(startDate);
        res.json({ transactions: results });
    } catch (error) {
        console.error("❌ 取引履歴取得エラー:", error);
        res.status(500).json({ error: "取引履歴の取得に失敗しました。" });
    }
};

// 2. 取引を挿入するコントローラ
const insertTransaction = async (req, res) => {
    const data = req.body;
    try {
        const result = await insertTransactionToService(data);
        res.json({ message: "✅ 取引が正常に保存されました", data: result });
    } catch (error) {
        console.error("❌ 取引挿入エラー:", error);
        res.status(500).json({ error: "取引の保存に失敗しました" });
    }
};

// 3. 取引を削除するコントローラ
const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteTransactionFromService(id);
        res.json({ message: "✅ 取引が正常に削除されました" });
    } catch (error) {
        console.error("❌ 取引削除エラー:", error);
        res.status(500).json({ error: "取引の削除に失敗しました" });
    }
};

// 4. 取引を更新するコントローラ
const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        await updateTransactionInService(id, data);
        res.json({ message: "✅ 取引が正常に更新されました" });
    } catch (error) {
        console.error("❌ 取引更新エラー:", error);
        res.status(500).json({ error: "取引の更新に失敗しました" });
    }
};

// 5. CSVインポートのコントローラ
const importCSVFile = async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "CSVファイルが必要です。" });

    try {
        await importCSVFileToService(file.path);
        res.json({ message: "✅ CSVファイルが正常にインポートされました" });
    } catch (error) {
        console.error("❌ CSVインポートエラー:", error);
        res.status(500).json({ error: "CSVインポートに失敗しました" });
    }
};

// 6. 取引データのCSVエクスポートのコントローラ
const exportToCSV = async (req, res) => {
    try {
        // 取引履歴を取得してCSV形式に変換
        const data = await exportTransactionsToCSVService();

        // CSV変換
        const csv = json2csv(data);

        // ヘッダー設定とCSVファイル送信
        res.header('Content-Type', 'text/csv');
        res.attachment('transactions.csv');
        return res.send(csv);
    } catch (error) {
        console.error("❌ CSVエクスポートエラー:", error);
        res.status(500).json({ error: "CSVエクスポートに失敗しました" });
    }
};

// 7. 金庫の状態をCSVエクスポートするコントローラ
const exportToDenominationsCSV = async (req, res) => {
    try {
        const data = await exportDenominationsToCSVService();

        // CSV変換
        const csv = json2csv(data);

        // ヘッダー設定とCSVファイル送信
        res.header('Content-Type', 'text/csv');
        res.attachment('denominations.csv');
        return res.send(csv);
    } catch (error) {
        console.error("❌ 金庫の状態CSVエクスポートエラー:", error);
        res.status(500).json({ error: "金庫の状態CSVエクスポートに失敗しました" });
    }
};

// モジュールのエクスポート
module.exports = {
    getTransactionHistory,
    insertTransaction,
    deleteTransaction,
    updateTransaction,
    importCSVFile,
    exportToCSV,
    exportToDenominationsCSV
};
