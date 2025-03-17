// server/controllers/denominationController.js

const { getDenominationsFromDb } = require('../services/denominationService');  // サービスからデータ取得関数をインポート

// 金種情報を取得するコントローラーの関数
const getDenominations = async (req, res) => {
    try {
        // サービスから金種情報をデータベースから取得
        const denominations = await getDenominationsFromDb();  
        
        // 取得した金種情報が空でないかを確認
        if (!denominations || denominations.length === 0) {
            return res.status(200).json({ message: 'データが存在しません', denominations: [] });
        }
        
        // 取得した金種情報をJSON形式で返す
        res.status(200).json({ denominations });

    } catch (error) {
        // 何らかのエラーが発生した場合、エラーメッセージをログ出力
        console.error('❌ 金種情報取得エラー:', error.message || error);
        
        // サーバーエラー (500) を返却し、エラーメッセージを含めて返す
        res.status(500).json({ error: '金種情報取得に失敗しました' });
    }
};

// コントローラーの関数を外部で利用できるようにエクスポート
module.exports = { getDenominations };
