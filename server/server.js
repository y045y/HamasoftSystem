require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { connectDB, sequelize } = require("./config/db");  // ⭐️ DB接続用のインポート

const app = express();
const PORT = process.env.PORT || 5000;

// CORS設定
app.use(cors({
    origin: "http://localhost:3000",  // ReactのフロントエンドURL
    credentials: true
}));

app.use(bodyParser.json());

// ルーティング
const transactionRoutes = require("./routes/transactionRoutes");
app.use("/api", transactionRoutes);  // ⭐️ APIルートは静的ファイル提供より前に配置

// Reactビルド済みファイルの提供
app.use(express.static(path.resolve(__dirname, "../client/build")));  // ⭐️ `path.resolve` を使う

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));  // ⭐️ `path.resolve` を使う
});

// データベース接続とサーバー起動
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 サーバー起動: http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("❌ データベース接続エラー:", err);
});
