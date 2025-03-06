// config/db.js
require("dotenv").config();
const { Sequelize } = require("sequelize");

// Sequelize インスタンスの作成
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_SERVER,
    dialect: "mssql",
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    dialectOptions: {
        instanceName: "SQLEXPRESS01",
        options: {
            encrypt: true,
            trustServerCertificate: true,
        },
    },
    logging: console.log,
});

// 接続確認用の関数
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ SQL Server に接続成功 (Sequelize使用)");
    } catch (err) {
        console.error("❌ SQL Server 接続エラー:", err);
        process.exit(1);
    }
};

// ⭐️ 正しくエクスポートされているか確認
module.exports = {
    sequelize,   // これで `sequelize` をエクスポート
    connectDB,   // これで `connectDB` をエクスポート
};
