import React, { useState, useEffect, useCallback } from "react";
import { deleteTransaction, importCSV, exportToCSV, updateTransaction } from "../services/api";
import PDFButton from './PDFButton';

const TransactionHistory = ({ transactions, fetchTransactions, fetchCashState, currentMonth, setCurrentMonth }) => {
    const [editRow, setEditRow] = useState(null);
    const [error, setError] = useState(null);
    const [updatedTransactions, setUpdatedTransactions] = useState(transactions); // 状態管理用にコピー

    useEffect(() => {
        if (transactions && transactions.length > 0) {
            setUpdatedTransactions(transactions);
        }
    }, [transactions]);

    useEffect(() => {
        if (currentMonth) {
            fetchTransactions(currentMonth);  // currentMonthを渡して取引履歴を取得
        }
    }, [fetchTransactions, currentMonth]);

    // 🔄 取引履歴を取得
    const fetchTransactionsData = useCallback(async () => {
        try {
            console.log("🔄 取引履歴を取得中...");
            await fetchTransactions(currentMonth);  // currentMonthを渡して取得
            if (fetchCashState) await fetchCashState();
        } catch (error) {
            console.error("❌ 取引履歴取得エラー:", error);
            setError("取引履歴の取得に失敗しました。サーバーを確認してください。");
        }
    }, [fetchTransactions, fetchCashState, currentMonth]);

    // 月変更ボタンでcurrentMonthを更新
    useEffect(() => {
        if (currentMonth) {
            fetchTransactionsData();  // currentMonthが変わった際に再取得
        }
    }, [currentMonth, fetchTransactionsData]);  // currentMonthが変わった時に再取得


    // ✅ 最新の取引データをログに出力 (デバッグ用)
    useEffect(() => {
        console.log("💡 最新の取引データ:", transactions);
    }, [transactions]);

    // 🔄 取引を削除
    const handleDelete = async (transactionId) => {
        if (!transactionId) return;
        if (!window.confirm("この取引を削除しますか？")) return;

        try {
            await deleteTransaction(transactionId);
            await fetchTransactionsData();  // 削除後に再取得
        } catch (error) {
            console.error("削除エラー:", error);
        }
    };

    // 🔄 CSVインポート
    const handleImportClick = () => {
        document.getElementById('csvImportInput').click();  // hiddenのinputをクリック
    };

    const handleCSVImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            await importCSV(file);  // CSVインポート処理
            await fetchTransactionsData();  // インポート後に取引履歴を再取得
        } catch (error) {
            console.error('CSVインポートエラー:', error);
        } finally {
            event.target.value = "";  // インポート後はinputをリセット
        }
    };

    // 🔄 CSVエクスポート
    const exportToDenominationsCSV = async () => {
        try {
            const csvData = await exportToCSV();  // CSVデータを取得
            const link = document.createElement('a');
            link.href = URL.createObjectURL(new Blob([csvData]));  // Blobに変換してURLを作成
            link.download = 'denominations.csv';  // ダウンロードファイル名
            link.click();  // ダウンロード開始
        } catch (error) {
            console.error("CSVダウンロードエラー:", error);
        }
    };

    // 🔄 編集モードの切り替え
    const handleEditClick = (index) => {
        setEditRow(index);  // 編集する行のインデックスを設定
    };

    // 🔄 編集中の入力変更
    const handleInputChange = (index, field, value) => {
        const updatedTransactionsCopy = [...updatedTransactions];
        updatedTransactionsCopy[index][field] = value;  // 編集した値を反映
        setUpdatedTransactions(updatedTransactionsCopy);  // 状態を更新
    };

    // 🔄 編集内容を保存
    const handleSaveClick = async (index) => {
        const transaction = updatedTransactions[index];  // 編集された取引
        try {
            await updateTransaction(transaction.TransactionID, transaction);  // 更新API呼び出し
            setEditRow(null);  // 編集モードを終了
            await fetchTransactionsData();  // 再取得
        } catch (error) {
            console.error('更新エラー:', error);
        }
    };

    // 🔄 編集キャンセル
    const handleCancelClick = () => {
        setEditRow(null);  // 編集モードを終了
        fetchTransactionsData();  // 変更をキャンセルして再取得
    };

    const handleMonthChange = (direction) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + direction);  // 前月(-1) または 次月(+1)
            return newDate.toISOString().slice(0, 7);  // `YYYY-MM`形式で返す
        });
    };

    // 🔄 currentMonthが変更されたら、取引履歴を再取得
    useEffect(() => {
        if (currentMonth) {
            fetchTransactionsData();  // currentMonthが変わった際に再取得
        }
    }, [currentMonth, fetchTransactionsData]);  // currentMonthが変更されたときに再取得


    return (
        <div className="container">
            {error && <p className="text-danger text-center">{error}</p>}  {/* エラーメッセージの表示 */}

            <h4 className="text-center my-3">{new Date(`${currentMonth}-01`).getFullYear()}年{new Date(`${currentMonth}-01`).getMonth() + 1}月度</h4>

            {/* ボタンエリア */}
            <div className="d-flex justify-content-between align-items-center my-3">
                <div>
                    <button className="btn btn-warning me-2" onClick={handleImportClick}>CSVIm</button>
                    <button className="btn btn-info me-2" onClick={exportToDenominationsCSV}>CSVEx</button>
                </div>
                <div>
                    {/* 月変更ボタン */}
                    <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => handleMonthChange(-1)}  // 前月に変更
                    >
                        ◀ 前月
                    </button>
                    <button
                        className="btn btn-outline-secondary me-2"
                        onClick={() => handleMonthChange(0)}  // 当月に変更
                    >
                        📅 当月
                    </button>
                    <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => handleMonthChange(1)}  // 次月に変更
                    >
                        次月 ▶
                    </button>

                </div>

                <div>
                    <PDFButton transactions={transactions} currentMonth={currentMonth} />
                </div>
                <input id="csvImportInput" type="file" accept=".csv" onChange={handleCSVImport} style={{ display: 'none' }} />
            </div>

            {/* 取引履歴テーブル */}
            <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered text-center align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>日付</th>
                            <th>金額</th>
                            <th>残高</th>
                            <th>相手</th>
                            <th>摘要</th>
                            <th>メモ</th>
                            <th>万</th>
                            <th>5千</th>
                            <th>千</th>
                            <th>5百</th>
                            <th>百</th>
                            <th>5十</th>
                            <th>十</th>
                            <th>5</th>
                            <th>1</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {updatedTransactions.length > 0 ? (
                            updatedTransactions.map((tx, index) => (
                                <tr key={tx.TransactionID || tx.TransactionDate || Math.random()}>
                                    {editRow === index ? (
                                        <>
                                            {/* 編集モード */}
                                            <td>
                                                <input
                                                    type="date"
                                                    value={tx.TransactionDate ? tx.TransactionDate.split('T')[0] : ''}
                                                    onChange={(e) => handleInputChange(index, 'TransactionDate', e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={tx.Amount || ''}
                                                    onChange={(e) => handleInputChange(index, 'Amount', parseInt(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td>{tx.RunningBalance !== null ? tx.RunningBalance.toLocaleString() : 'N/A'}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={tx.Recipient || ''}
                                                    onChange={(e) => handleInputChange(index, 'Recipient', e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={tx.Summary || ''}
                                                    onChange={(e) => handleInputChange(index, 'Summary', e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={tx.Memo || ''}
                                                    onChange={(e) => handleInputChange(index, 'Memo', e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={tx.TenThousandYen || 0}
                                                    onChange={(e) => handleInputChange(index, 'TenThousandYen', parseInt(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={tx.FiveThousandYen || 0}
                                                    onChange={(e) => handleInputChange(index, 'FiveThousandYen', parseInt(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={tx.OneThousandYen || 0}
                                                    onChange={(e) => handleInputChange(index, 'OneThousandYen', parseInt(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-success me-1" onClick={() => handleSaveClick(index)}>💾 保存</button>
                                                <button className="btn btn-sm btn-secondary" onClick={handleCancelClick}>❌ キャンセル</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            {/* 通常表示 */}
                                            <td>{tx.TransactionDate ? new Date(tx.TransactionDate).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" }) : "N/A"}</td>
                                            <td className="text-end">{tx.Amount !== null ? `${tx.Amount < 0 ? "-" : ""}${Math.abs(tx.Amount).toLocaleString()}` : "N/A"}</td>
                                            <td className="text-end">{tx.RunningBalance !== null ? `${tx.RunningBalance.toLocaleString()}` : "N/A"}</td>
                                            <td className="text-start">{tx.Recipient || "N/A"}</td>
                                            <td className="text-start">{tx.Summary || "N/A"}</td>
                                            <td className="text-start">{tx.Memo || "N/A"}</td>
                                            <td className="text-end">{tx.TenThousandYen || 0}</td>
                                            <td className="text-end">{tx.FiveThousandYen || 0}</td>
                                            <td className="text-end">{tx.OneThousandYen || 0}</td>
                                            <td className="text-end">{tx.FiveHundredYen || 0}</td>
                                            <td className="text-end">{tx.OneHundredYen || 0}</td>
                                            <td className="text-end">{tx.FiftyYen || 0}</td>
                                            <td className="text-end">{tx.TenYen || 0}</td>
                                            <td className="text-end">{tx.FiveYen || 0}</td>
                                            <td className="text-end">{tx.OneYen || 0}</td>
                                            <td>
                                                <button className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(tx.TransactionID)}>🗑 削除</button>
                                                <button className="btn btn-sm btn-primary" onClick={() => handleEditClick(index)}>✏️ 修正</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="16" className="text-center">取引データなし</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionHistory;
