const express = require('express');
const app = express();
const poolPromise = require('./config/db');
const cors = require('cors');

app.use(cors());
app.use(express.json()); // JSONパース

// デフォルトルート
app.get('/', (req, res) => {
  res.send('Hello World');
});

// サーバー起動
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
