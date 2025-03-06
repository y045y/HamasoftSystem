const Transaction = require("../models/transactionModel");
const Denomination = require("../models/denominationModel");
const { sequelize } = require("../config/db");  // 修正: sequelizeのインポート方法

const getTransactionHistory = async (req, res) => {
    const { startDate } = req.query;

    if (!startDate) {
        return res.status(400).json({ error: "❌ `startDate` パラメータが必要です。" });
    }

    try {
        // ストアドプロシージャの実行
        const [results] = await sequelize.query(
            "EXEC GetTransactionHistory @StartDate = :startDate",
            {
                replacements: { startDate },
                type: sequelize.QueryTypes.SELECT,  // 結果をシンプルな配列で取得
            }
        );

        res.json({ transactions: results });
    } catch (error) {
        console.error("❌ 取引履歴取得エラー:", error);
        res.status(500).json({ error: "取引履歴の取得に失敗しました" });
    }
};

module.exports = { getTransactionHistory };
