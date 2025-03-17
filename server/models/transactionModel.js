const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Transaction = sequelize.define("Transaction", {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    TransactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    TransactionType: {
        type: DataTypes.STRING(50),
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
        // defaultValue: 0,  // defaultValueを設定
    },
}, {
    tableName: "Transactions",
    timestamps: false,
});

module.exports = { Transaction };
