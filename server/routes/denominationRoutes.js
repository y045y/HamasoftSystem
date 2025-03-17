const express = require('express');  // expressをrequireでインポート
const router = express.Router();
const { getDenominations } = require('../controllers/denominationController');  // 名前付きインポート

// 金種の情報を取得
router.get('/denominations', getDenominations);  // 直接関数を呼び出す

// routerをエクスポート
module.exports = router;  // CommonJS形式でrouterをエクスポート
