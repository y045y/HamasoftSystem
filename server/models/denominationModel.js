// server/models/denominationModel.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");  // ⭐️ db.js から構造分解で取得

const Denomination = sequelize.define("Denomination", {
    TransactionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    TenThousandYen: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    FiveThousandYen: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    OneThousandYen: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    FiveHundredYen: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    OneHundredYen: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    FiftyYen: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    TenYen: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    FiveYen: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    OneYen: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    TotalAmount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    CreatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
    UpdatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: "Denomination",
    timestamps: false,
});

console.log(sequelize);  // <- ここで `sequelize` が undefined ならエクスポートに問題あり

module.exports = Denomination;
