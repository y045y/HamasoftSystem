require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { connectDB, sequelize } = require("./config/db");  // ⭐️ ここで `connectDB` もインポート

const app = express();
const PORT = process.env.PORT || 5000;

// CORS設定
app.use(cors());
app.use(bodyParser.json());

// ルーティング
const transactionRoutes = require("./routes/transactionRoutes");
app.use("/api", transactionRoutes);

// Reactビルド済みファイルの提供
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 サーバー起動: http://localhost:${PORT}`);
    });
});
