// server/models/denominationModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");  // ⭐️ ここでエラーになるなら、`console.log(sequelize)` で確認

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
    // 省略...
}, {
    tableName: "Denomination",
    timestamps: false,
});
console.log(sequelize);  // <- ここで `sequelize` が undefined ならエクスポートに問題あり


module.exports = Denomination;
