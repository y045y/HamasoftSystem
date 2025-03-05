const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // Azureの場合
    trustServerCertificate: true, // ローカル開発時
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => pool)
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

module.exports = poolPromise;
