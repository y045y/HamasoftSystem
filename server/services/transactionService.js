const { sequelize } = require("../config/db");  // Sequelize インスタンスのインポート
const { Transaction } = require("../models/transactionModel");  // 名前付きインポート
const { Denomination } = require("../models/denominationModel");  // 名前付きインポート
const fs = require("fs");
const csv = require("fast-csv");

// 取引履歴を取得するサービス
const getTransactionHistoryFromService = async (startDate) => {
    try {
        const results = await sequelize.query(
            "EXEC GetTransactionHistory @StartDate = :startDate",
            { replacements: { startDate }, type: sequelize.QueryTypes.SELECT }
        );
        return results;
    } catch (error) {
        console.error("❌ 取引履歴取得失敗:", error);
        throw error;
    }
};

// 取引を挿入するサービス
const insertTransactionToService = async (data) => {
    try {
        const [results] = await sequelize.query(
            `EXEC InsertAndCalculateTransaction
                @TransactionDate = :TransactionDate, 
                @TransactionType = :TransactionType, 
                @Amount = :Amount, 
                @Summary = :Summary, 
                @Memo = :Memo, 
                @Recipient = :Recipient, 
                @TenThousandYen = :TenThousandYen, 
                @FiveThousandYen = :FiveThousandYen, 
                @OneThousandYen = :OneThousandYen, 
                @FiveHundredYen = :FiveHundredYen, 
                @OneHundredYen = :OneHundredYen, 
                @FiftyYen = :FiftyYen, 
                @TenYen = :TenYen, 
                @FiveYen = :FiveYen, 
                @OneYen = :OneYen`,
            {
                replacements: {
                    TransactionDate: data.TransactionDate,
                    TransactionType: data.TransactionType,
                    Amount: data.Amount,
                    Summary: data.Summary,
                    Memo: data.Memo,
                    Recipient: data.Recipient,
                    TenThousandYen: data.TenThousandYen || 0,
                    FiveThousandYen: data.FiveThousandYen || 0,
                    OneThousandYen: data.OneThousandYen || 0,
                    FiveHundredYen: data.FiveHundredYen || 0,
                    OneHundredYen: data.OneHundredYen || 0,
                    FiftyYen: data.FiftyYen || 0,
                    TenYen: data.TenYen || 0,
                    FiveYen: data.FiveYen || 0,
                    OneYen: data.OneYen || 0
                },
                type: sequelize.QueryTypes.INSERT
            }
        );
        return results; // 成功時の結果を返す
    } catch (error) {
        console.error("❌ 取引挿入失敗:", error);
        throw error; // エラーを上位に投げる
    }
};


// 取引を削除するサービス
const deleteTransactionFromService = async (id) => {
    try {
        await Transaction.destroy({ where: { id } });
    } catch (error) {
        console.error("❌ 取引削除失敗:", error);
        throw error;
    }
};

// 取引を更新するサービス
const updateTransactionInService = async (id, data) => {
    try {
        await Transaction.update(data, { where: { id } });
    } catch (error) {
        console.error("❌ 取引更新失敗:", error);
        throw error;
    }
};

// CSVインポートサービス
const importCSVFileToService = async (filePath) => {
    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on("data", (data) => results.push(data))
            .on("end", async () => {
                try {
                    await Transaction.bulkCreate(results);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
    });
};

// CSVエクスポートサービス
const exportTransactionsToCSVService = async () => {
    try {
        const transactions = await Transaction.findAll();
        return transactions.map(tx => tx.toJSON());
    } catch (error) {
        console.error("❌ CSVエクスポート失敗:", error);
        throw error;
    }
};

// 金庫の状態をCSVエクスポートするサービス
const exportDenominationsToCSVService = async () => {
    try {
        const denominations = await Denomination.findAll();
        return denominations.map(denomination => denomination.toJSON());
    } catch (error) {
        console.error("❌ 金庫の状態CSVエクスポート失敗:", error);
        throw error;
    }
};

module.exports = {
    getTransactionHistoryFromService,
    insertTransactionToService,
    deleteTransactionFromService,
    updateTransactionInService,
    importCSVFileToService,
    exportTransactionsToCSVService,
    exportDenominationsToCSVService,
};
