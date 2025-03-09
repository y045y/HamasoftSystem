import React, { useState, useEffect, useCallback } from "react";
import CashStateTable from "./CashStateTable";
import TransactionHistory from "./TransactionHistory";
import { getTransactionHistory, getCurrentInventory, insertTransaction, exportToCSV } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/cashManagementForm.css";
import axios from "axios";  // ⭐️ axiosをインポート

const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
console.log("API URL:", API_URL);

const CashManagementFormUI = () => {
    const [difference, setDifference] = useState(0); 
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [inputCounts, setInputCounts] = useState({});
    const [cashState, setCashState] = useState({});
    const [error, setError] = useState(null);  // エラー表示用

    const [form, setForm] = useState({
        date: "",
        amount: 0,
        transactionType: "出金",
        summary: "交通費",
        recipient: "会社",
        memo: "",
    });


    const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
    console.log("API URL:", API_URL);
    
    const fetchTransactions = useCallback(async () => {
        try {
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1);
            startDate.setDate(1);
            const endDate = new Date().toISOString().slice(0, 10);
    
            const apiUrl = `${API_URL}/transaction-history?startDate=${startDate.toISOString().slice(0, 10)}&endDate=${endDate}`;
            console.log("APIリクエスト送信:", apiUrl);
    
            // ⭐️ fetchをaxiosに変更
            const response = await axios.get(apiUrl);
            const data = response.data;  // axiosは自動でJSON変換するので `.data` で取得
            console.log("APIから取得したデータ:", data);
    
            if (Array.isArray(data) && data.length > 0) {
                if (JSON.stringify(data) !== JSON.stringify(transactions)) {
                    setTransactions(data);
                    console.log("🔄 取引履歴を更新:", data);
                } else {
                    console.log("⚠️ データに変更なし");
                }
            } else {
                console.log("⚠️ 取引履歴が空です");
                setTransactions([]);
            }
        } catch (error) {
            console.error("❌ 取引履歴取得エラー:", error);
            setTransactions([]);
        }
    }, []);
    
    
    const fetchCashState = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/cash-state`);  // ⭐️ axiosに変更
            const data = response.data;  // axiosは `.data` で取得
            console.log("💡 金庫の状態:", data);
            setCashState(data);
        } catch (error) {
            console.error("❌ 金庫状態取得エラー:", error);
            setError("金庫状態の取得に失敗しました。サーバーを確認してください。");
            setCashState({});
        }
    }, []);
    

    // ✅ 初回レンダリングのみ実行 (メモ化した関数を依存配列に)
    useEffect(() => {
        fetchTransactions();
        fetchCashState();
    }, [fetchTransactions, fetchCashState]);

    // 🔄 取引送信
    const handleSubmit = async () => {
        const transactionAmount = isNaN(difference) ? 0 : 
            (form.transactionType === "出金" ? -Math.abs(difference) : Math.abs(difference));

        const correctedAmount = Math.abs(form.amount);

        if (Math.abs(transactionAmount) !== correctedAmount) {
            alert(`エラー: 入力金額 (${correctedAmount}) と 差額 (${transactionAmount}) が一致しません！`);
            return;
        }

        const data = {
            TransactionDate: form.date,
            TransactionType: form.transactionType,
            Amount: transactionAmount,
            Summary: form.summary,
            Memo: form.memo,
            Recipient: form.recipient,
            ...inputCounts
        };

        try {
            setLoading(true);
            await insertTransaction(data);
            await fetchTransactions();
console.log("✅ 最新の取引履歴を取得しました");

            await fetchCashState();
            setForm({
                date: "",
                amount: 0,
                transactionType: "出金",
                summary: "交通費",
                recipient: "なし",
                memo: "",
            });
            setInputCounts({});
        } catch (error) {
            console.error("❌ 取引挿入エラー:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const csvData = await exportToCSV();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(new Blob([csvData]));
            link.download = "transactions.csv";
            link.click();
        } catch (error) {
            console.error("❌ CSVエクスポートエラー:", error);
        }
    };

    return (
        <div className="container mt-4 p-3 bg-light rounded shadow-sm">
            <h3 className="text-center mb-3">金庫管理システム</h3>
            <form>
                <div className="row g-3 align-items-center">
                    {/* 日付入力 */}
                    <div className="col-md-2">
                        <label className="form-label fw-bold">日付</label>
                        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="form-control" />
                    </div>

                    {/* 取引タイプ */}
                    <div className="col-md-2">
                        <label className="form-label fw-bold">取引タイプ</label>
                        <select value={form.transactionType} onChange={(e) => setForm({ ...form, transactionType: e.target.value })} className="form-select">
                            <option value="出金">出金</option>
                            <option value="入金">入金</option>
                        </select>
                    </div>

                    {/* 金額入力 */}
                    <div className="col-md-2">
                        <label className="form-label fw-bold">金額</label>
                        <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className="form-control" placeholder="金額を入力" />
                    </div>

                    {/* 取引先 */}
                    <div className="col-md-2">
                        <label className="form-label fw-bold">相手</label>
                        <select value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} className="form-select">
                            <option value="会社">会社</option>
                            <option value="佐脇">佐脇</option>
                            <option value="近松">近松</option>
                            <option value="白井">白井</option>
                            <option value="倉内">倉内</option>
                            <option value="杉山">杉山</option>
                            <option value="島村">島村</option>
                        </select>
                    </div>

                    {/* 摘要 */}
                    <div className="col-md-2">
                        <label className="form-label fw-bold">摘要</label>
                        <select value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="form-select">
                            <option value="交通費">交通費</option>
                            <option value="支払">支払</option>
                            <option value="その他">その他</option>
                        </select>
                    </div>

                    {/* メモ */}
                    <div className="col-md-2">
                        <label className="form-label fw-bold">メモ</label>
                        <input type="text" value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} className="form-control" placeholder="メモを入力" />
                    </div>
                </div>
            </form>

           <CashStateTable 
                inputCounts={inputCounts} 
                cashState={cashState} 
                fetchCashState={fetchCashState} 
                setInputCounts={setInputCounts} 
                setDifference={setDifference} 
            />
            <div className="text-end mt-3">
                <button className="btn btn-primary px-4" onClick={handleSubmit} disabled={loading}>
                    {loading ? "処理中..." : "保存"}
                </button>
            </div>

            <div className="mt-4">
                <TransactionHistory transactions={transactions} fetchTransactions={fetchTransactions} fetchCashState={fetchCashState} />
            </div>
        </div>
    );
};

export default CashManagementFormUI;
