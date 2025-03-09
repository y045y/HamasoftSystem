const Transaction = require("../models/transactionModel");
const Denomination = require("../models/denominationModel");
const { sequelize } = require("../config/db");
const fs = require("fs");
const csv = require("fast-csv");

const getTransactionHistory = async (req, res) => {
    const { startDate } = req.query;

    if (!startDate) {
        return res.status(400).json({ error: "❌ `startDate` パラメータが必要です。" });
    }

    try {
        // ストアドプロシージャの実行
        const results = await sequelize.query(
            "EXEC GetTransactionHistory @StartDate = :startDate",
            {
                replacements: { startDate: startDate || new Date().toISOString().slice(0, 10) },
                type: sequelize.QueryTypes.SELECT
            }
        );

        console.log("取得した取引履歴の全結果:", JSON.stringify(results, null, 2));

        if (!results || results.length === 0) {
            return res.status(404).json({ error: "取引履歴が見つかりませんでした。" });
        }

        // 🔄 `transactions` キーでレスポンスを包む
        res.json({ transactions: results });  // ⭐️ ここで `transactions` をキーに追加

    } catch (error) {
        console.error("❌ 取引履歴取得エラー:", error);
        res.status(500).json({ error: "取引履歴の取得に失敗しました。" });
    }
};



// 2. 取引を挿入する関数
const insertTransaction = async (req, res) => {
    const data = req.body;
    console.log("📌 受信したデータ:", data);

    try {
        const [results] = await sequelize.query(
            "EXEC InsertAndCalculateTransaction @TransactionDate = :TransactionDate, @TransactionType = :TransactionType, @Amount = :Amount, @Summary = :Summary, @Memo = :Memo, @Recipient = :Recipient, @TenThousandYen = :TenThousandYen, @FiveThousandYen = :FiveThousandYen, @OneThousandYen = :OneThousandYen, @FiveHundredYen = :FiveHundredYen, @OneHundredYen = :OneHundredYen, @FiftyYen = :FiftyYen, @TenYen = :TenYen, @FiveYen = :FiveYen, @OneYen = :OneYen",
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
                    OneYen: data.OneYen || 0,
                },
                type: sequelize.QueryTypes.INSERT,
            }
        );

        console.log("📌 データベースへの挿入結果:", results);
        res.json({ message: "✅ 取引が正常に保存されました", data: results });
    } catch (error) {
        console.error("❌ 取引挿入エラー:", error);
        res.status(500).json({ error: "取引の保存に失敗しました" });
    }
};

// 3. 取引を削除する関数
const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        await Transaction.destroy({ where: { id } });
        res.json({ message: "✅ 取引が正常に削除されました" });
    } catch (error) {
        console.error("❌ 取引削除エラー:", error);
        res.status(500).json({ error: "取引の削除に失敗しました" });
    }
};

// 4. 取引を更新する関数
const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        await Transaction.update(data, { where: { id } });
        res.json({ message: "✅ 取引が正常に更新されました" });
    } catch (error) {
        console.error("❌ 取引更新エラー:", error);
        res.status(500).json({ error: "取引の更新に失敗しました" });
    }
};

// 5. CSVインポート機能
const importCSVFile = async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "CSVファイルが必要です。" });

    const results = [];
    fs.createReadStream(file.path)
        .pipe(csv.parse({ headers: true }))
        .on("data", (data) => results.push(data))
        .on("end", async () => {
            try {
                await Transaction.bulkCreate(results);
                res.json({ message: "✅ CSVファイルが正常にインポートされました" });
            } catch (error) {
                console.error("❌ CSVインポートエラー:", error);
                res.status(500).json({ error: "CSVインポートに失敗しました" });
            }
        });
};

// 6. 取引データのCSVエクスポート機能
const exportToCSV = async (req, res) => {
    try {
        const transactions = await Transaction.findAll();
        const csvStream = csv.format({ headers: true });
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", 'attachment; filename="transactions.csv"');
        csvStream.pipe(res);
        transactions.forEach((tx) => csvStream.write(tx.toJSON()));
        csvStream.end();
    } catch (error) {
        console.error("❌ CSVエクスポートエラー:", error);
        res.status(500).json({ error: "CSVエクスポートに失敗しました" });
    }
};

// 5. 金庫の状態をCSVエクスポートする関数
const exportToDenominationsCSV = async (req, res) => {
    try {
        // 金庫の状態をデータベースから取得
        const denominations = await Denomination.findAll();

        // レスポンスヘッダー設定 (CSVとして返す)
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="denominations.csv"');

        // CSVストリームを作成
        const csvStream = csv.format({ headers: true });

        // CSVデータをレスポンスにパイプ
        csvStream.pipe(res);

        // 取得したデータをCSVフォーマットで書き込む
        denominations.forEach(denomination => {
            csvStream.write(denomination.toJSON());
        });

        // CSVストリームを終了
        csvStream.end();
    } catch (error) {
        console.error("❌ 金庫の状態CSVエクスポートエラー:", error);
        res.status(500).json({ error: "金庫の状態CSVエクスポートに失敗しました" });
    }
};

module.exports = {
    getTransactionHistory,
    insertTransaction,
    deleteTransaction,
    updateTransaction,
    importCSVFile,
    exportToCSV,
    exportToDenominationsCSV
}
