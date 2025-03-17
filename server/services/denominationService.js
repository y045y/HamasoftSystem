const { sequelize } = require('../config/db');  // Sequelize インスタンスをインポート

// 金種情報をデータベースから取得する関数
const getDenominationsFromDb = async () => {
    try {
        // ストアドプロシージャを実行して金種情報を取得
        console.log('Sequelize でストアドプロシージャを実行中...');

        // ストアドプロシージャを呼び出して結果を取得
        const result = await sequelize.query('EXEC dbo.CalculateCurrentInventory;', {
            type: sequelize.QueryTypes.SELECT,  // SELECT クエリとして実行
        });

        // 結果を確認するためにコンソールに出力
        console.log("Sequelize 結果:", result);  // 返された結果をログに表示

        // ストアドプロシージャの結果をそのまま返す
        return result;
    } catch (error) {
        // エラーが発生した場合にログに表示
        console.error('❌ 金種情報取得失敗:', error);
        throw error;  // エラーを呼び出し元に伝える
    }
};

// 関数をエクスポートして外部で使えるようにする
module.exports = { getDenominationsFromDb };
