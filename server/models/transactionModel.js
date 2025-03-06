// server/models/transactionModel.js

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");  // ⭐️ ここを修正 (分割代入でインポート)

const Transaction = sequelize.define("Transaction", {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    TransactionDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    TransactionType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    Summary: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Memo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Recipient: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    RunningBalance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    tableName: "Transactions",
    timestamps: false,
});

module.exports = Transaction;
