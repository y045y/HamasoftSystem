const { Sequelize } = require("sequelize");  // Sequelize を require でインポート

// Sequelize インスタンスの作成
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: "mssql",
    host: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    dialectOptions: {
        instanceName: process.env.DB_INSTANCE_NAME,  // インスタンス名を設定
        options: {
            encrypt: true,
            trustServerCertificate: true,
        },
    },
    logging: console.log,  // SQLクエリのログ表示
});

const connectDB = async () => {
    try {
        // SQL Server への接続確認
        await sequelize.authenticate();
        console.log("✅ SQL Server に接続成功 (Sequelize使用)");

        // モデルとデータベースを同期（変更なし）
        // alter: trueを削除して、データベースの変更を避ける
        await sequelize.sync({ force: false });
        console.log("✅ データベース同期完了");

        // テーブル構造情報を取得する関数の呼び出し
        await describeDenominationTable();  // Denomination テーブルの構造を表示
    } catch (err) {
        console.error("❌ データベース接続または同期エラー:", err);
        process.exit(1);  // エラーが発生した場合は終了
    }
};


// Denomination テーブルの構造を表示する関数
const describeDenominationTable = async () => {
    try {
        const tableInfo = await sequelize.getQueryInterface().describeTable('Denomination');
        console.log("Denomination テーブルの構造:", tableInfo);
    } catch (error) {
        console.error("❌ テーブル情報の取得に失敗しました:", error);
    }
};

module.exports = { sequelize, connectDB };  // CommonJS 形式でエクスポート
