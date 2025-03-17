import React, { useState, useEffect, useCallback } from "react";
import CashStateTable from "./CashStateTable";
import TransactionHistory from "./TransactionHistory";
import { getTransactionHistory, getCurrentInventory, insertTransaction } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/cashManagementForm.css";

const CashManagementFormUI = () => {
    const [difference, setDifference] = useState(0);
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [inputCounts, setInputCounts] = useState({});
    const [cashState, setCashState] = useState({});
    const [form, setForm] = useState({
        date: "",
        amount: 0,
        transactionType: "出金",
        summary: "交通費",
        recipient: "会社",
        memo: "",
    });

    // `currentMonth`の状態を管理
    const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));  // 初期値は現在の年月

    // 取引履歴を取得
    const fetchTransactions = useCallback(async () => {
        try {
            const startDate = new Date(`${currentMonth}-01`);  // currentMonthの初日を取得
            const startMonth = startDate.toISOString().slice(0, 7);  // YYYY-MM形式

            const data = await getTransactionHistory(startMonth);

            if (Array.isArray(data) && data.length > 0) {
                setTransactions(data);
            } else {
                setTransactions([]);
            }
        } catch (error) {
            console.error("❌ 取引履歴取得エラー:", error);
            setTransactions([]);
        }
    }, [currentMonth]);

    // 金庫状態を取得する関数
    const fetchCashState = useCallback(async () => {
        try {
            const data = await getCurrentInventory();
            setCashState(data);
        } catch (error) {
            console.error("❌ 金庫状態取得エラー:", error);
            setCashState({});
        }
    }, []);

    // コンポーネントがマウントされた後に金庫状態を取得
    useEffect(() => {
        fetchCashState();
    }, [fetchCashState]);

    // 月が変更されたら取引履歴を再取得
    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    // 取引送信処理
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
            TenThousandYen: form.tenThousandYen || 0,
            FiveThousandYen: form.fiveThousandYen || 0,
            OneThousandYen: form.oneThousandYen || 0,
            FiveHundredYen: form.fiveHundredYen || 0,
            OneHundredYen: form.oneHundredYen || 0,
            FiftyYen: form.fiftyYen || 0,
            TenYen: form.tenYen || 0,
            FiveYen: form.fiveYen || 0,
            OneYen: form.oneYen || 0,
            ...inputCounts
        };

        try {
            setLoading(true);
            await insertTransaction(data);
            await fetchTransactions();
            await fetchCashState();

            setForm({
                date: "",
                amount: 0,
                transactionType: "出金",
                summary: "交通費",
                recipient: "なし",
                memo: "",
                tenThousandYen: 0,
                fiveThousandYen: 0,
                oneThousandYen: 0,
                fiveHundredYen: 0,
                oneHundredYen: 0,
                fiftyYen: 0,
                tenYen: 0,
                fiveYen: 0,
                oneYen: 0
            });
            setInputCounts({});
        } catch (error) {
            console.error("❌ 取引挿入エラー:", error);
        } finally {
            setLoading(false);
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
            <TransactionHistory
                transactions={transactions}
                fetchTransactions={fetchTransactions}
                fetchCashState={fetchCashState}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}  // Pass setCurrentMonth to TransactionHistory
                />

</div>
        </div>
    );
};

export default CashManagementFormUI;
