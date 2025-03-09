import axios from "axios";

// ✅ 環境変数からAPIのベースURLを取得
const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

// APIのベースURL確認用
console.log("API URL:", API_URL);

// 1. 取引履歴を取得
export const getTransactionHistory = async (startDate, endDate) => {
    try {
        const response = await axios.get(`${API_URL}/transaction-history?startDate=${startDate}&endDate=${endDate}`);
        return response.data.transactions || [];
    } catch (error) {
        console.error("❌ 取引履歴取得エラー:", error);
        throw error;
    }
};

// 2. 現在の金庫状態を取得
export const getCurrentInventory = async () => {
    try {
        const response = await axios.get(`${API_URL}/current-inventory`, { timeout: 10000 });
        return response.data || {};
    } catch (error) {
        console.error("❌ 金庫状態取得エラー:", error);
        throw error;
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
