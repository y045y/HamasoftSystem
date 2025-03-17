const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const { Transaction } = require("./transactionModel");  // Transactionを先にインポート

// Denomination モデルの定義
const Denomination = sequelize.define("Denomination", {
    TransactionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Transactions',  // 参照するテーブル名
            key: 'Id',              // 参照するカラム
        },
        primaryKey: true,
        autoIncrement: false,  // 自動インクリメントを無効にする
    },
    TenThousandYen: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    FiveThousandYen: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    OneThousandYen: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    FiveHundredYen: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    OneHundredYen: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    FiftyYen: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    TenYen: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    FiveYen: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    OneYen: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    TotalAmount: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    CreatedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
    UpdatedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW }
}, {
    tableName: "Denomination",
    timestamps: false,
});

// リレーション設定 (Denomination -> Transaction)
Denomination.belongsTo(Transaction, {
    foreignKey: 'TransactionId',
    targetKey: 'Id',
});

module.exports = { Denomination };  // CommonJSでエクスポート
