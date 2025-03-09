require("dotenv").config();
const { Sequelize } = require("sequelize");

// ホスト名とインスタンス名を分離
const [host, instanceName] = process.env.DB_SERVER.split("\\");

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: host,  // ホスト名のみ指定
    dialect: "mssql",
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    dialectOptions: {
        instanceName: instanceName,  // インスタンス名を指定
        options: {
            encrypt: true,
            trustServerCertificate: true,
        },
    },
    logging: console.log,
});

// 接続確認
sequelize.authenticate()
    .then(() => console.log("✅ 接続成功"))
    .catch(err => console.error("❌ 接続失敗:", err));

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ SQL Server に接続成功 (Sequelize使用)");
    } catch (err) {
        console.error("❌ SQL Server 接続エラー:", err);
        process.exit(1);
    }
};

module.exports = {
    sequelize,
    connectDB,
};
