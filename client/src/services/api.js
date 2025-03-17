import axios from "axios";

// ✅ 環境変数からAPIのベースURLを取得
const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

// APIのベースURL確認用
console.log("API URL:", API_URL);

// 1. 取引履歴を取得

export const getTransactionHistory = async (currentMonth) => {
    try {
        // currentMonthが無効な場合や形式が不正なら、現在の年月を使用
        if (!currentMonth || !/^\d{4}-\d{2}$/.test(currentMonth)) {
            console.error("無効な日付形式です。YYYY-MMの形式で入力してください。");
            currentMonth = new Date().toISOString().slice(0, 7); // 現在の年月をデフォルトに設定
        }

        // 開始日を計算
        const startDate = new Date(`${currentMonth}-01`).toISOString().slice(0, 10);  // 月の初日

        // 終了日を計算：次月の1日から1日引いて前月の最終日を取得
        const endDate = new Date(currentMonth);  // currentMonthを基に日付を作成
        endDate.setMonth(endDate.getMonth() + 1);  // 次月の1日
        endDate.setDate(0);  // 次月の最終日に設定

        const formattedEndDate = endDate.toISOString().slice(0, 10);  // YYYY-MM-DD形式に変換

        console.log(`開始日: ${startDate}, 終了日: ${formattedEndDate}`);  // デバッグ用

        // 取得するAPIのURLにstartDateとendDateを渡す
        const response = await axios.get(`${API_URL}/transaction-history?startDate=${startDate}&endDate=${formattedEndDate}`);
        return response.data.transactions || [];
    } catch (error) {
        console.error("❌ 取引履歴取得エラー:", error);
        throw error;
    }
};




// 2. 現在の金庫状態を取得
export const getCurrentInventory = async () => {
    try {
        // 正しいエンドポイントを使用: /denominations
        const response = await axios.get(`${API_URL}/denominations`, { timeout: 10000 });
        return response.data || {};  // データがない場合は空のオブジェクトを返す
    } catch (error) {
        console.error("❌ 金庫状態取得エラー:", error);
        throw error;  // エラーが発生した場合は再度スローして呼び出し元でエラーハンドリング
    }
};


// 3. 取引の挿入
export const insertTransaction = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/insert-and-calculate-transaction`, data);
        return response.data;
    } catch (error) {
        console.error("❌ 取引挿入エラー:", error);
        throw error;
    }
};

// 4. 取引の削除
export const deleteTransaction = async (transactionId) => {
    try {
        await axios.delete(`${API_URL}/transactions/${transactionId}`);
    } catch (error) {
        console.error("❌ 取引削除エラー:", error);
        throw error;
    }
};

// 5. 取引の更新
export const updateTransaction = async (transactionId, data) => {
    try {
        const response = await axios.put(`${API_URL}/update-transaction-and-denomination/${transactionId}`, data);
        return response.data;
    } catch (error) {
        console.error("❌ 取引更新エラー:", error);
        throw error;
    }
};

// 6. CSVインポート
export const importCSV = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_URL}/import-csv`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error('❌ CSVインポートエラー:', error);
        throw error;
    }
};

// 7. CSVエクスポート（取引データ）
export const exportToCSV = async () => {
    try {
        const response = await axios.get(`${API_URL}/export-transactions`, {
            responseType: 'blob', // バイナリデータ（CSV）として受け取る
        });
        return response.data;
    } catch (error) {
        console.error("❌ CSVエクスポートエラー:", error);
        throw error;
    }
};

// 8. 金庫の状態CSVエクスポート
export const exportToDenominationsCSV = async () => {
    try {
        const response = await axios.get(`${API_URL}/export-denominations`, { responseType: 'blob' });
        return response.data;
    } catch (error) {
        console.error("❌ CSVダウンロードエラー:", error);
        throw error;
    }
};
