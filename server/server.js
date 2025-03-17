require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { connectDB, sequelize } = require("./config/db");  // DB接続用のインポート (CommonJSスタイル)
const transactionRoutes = require("./routes/transactionRoutes");  // 拡張子を削除
const denominationRoutes = require("./routes/denominationRoutes");  // 拡張子を削除

// Express アプリケーションの作成
const app = express();
const PORT = process.env.PORT || 5000;

// CORS設定: フロントエンドとバックエンドが異なるポートで動作する場合に必要
app.use(cors({
    origin: "http://localhost:3000",  // ReactのフロントエンドURL
    credentials: true
}));

// JSONデータのパース設定
app.use(bodyParser.json());

// ルーティング設定
app.use("/api", transactionRoutes);  // 取引関連のルート
app.use("/api", denominationRoutes);  // 金種関連のルート

// Reactビルド済みファイルの提供（プロダクション環境用）
app.use(express.static(path.resolve(__dirname, "../client/build")));  // Reactビルドファイルを提供

// フロントエンドのデフォルトページを提供するルート
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));  // フロントエンドのデフォルトページを提供
});

// データベース接続とサーバー起動
connectDB()  // データベース接続を確立
    .then(() => {
        // モデルとデータベースを同期（既存のデータを削除しない）
        sequelize.sync({ force: false })
            .then(() => {
                // サーバーの起動
                app.listen(PORT, () => {
                    console.log(`🚀 サーバー起動: http://localhost:${PORT}`);
                });
            })
            .catch((err) => {
                // データベース同期に失敗した場合
                console.error("❌ データベース同期エラー:", err);
            });
    })
    .catch((err) => {
        // データベース接続に失敗した場合
        console.error("❌ データベース接続エラー:", err);
    });
