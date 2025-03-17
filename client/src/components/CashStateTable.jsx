import React, { useEffect, useState, useCallback } from "react";
import { getCurrentInventory } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/cashStateTable.css";



const denominationValues = { 
    TenThousandYen: 10000,
    FiveThousandYen: 5000, 
    OneThousandYen: 1000,
    FiveHundredYen: 500,
    OneHundredYen: 100,
    FiftyYen: 50,
    TenYen: 10,
    FiveYen: 5,
    OneYen: 1,
};


// ✅ 金種のラベル
const denominationLabels = {
    TenThousandYen: "万",
    FiveThousandYen: "5千",
    OneThousandYen: "千",
    FiveHundredYen: "5百",
    OneHundredYen: "百",
    FiftyYen: "5十",
    TenYen: "十",
    FiveYen: "5",
    OneYen: "1",
};

const CashStateTable = ({ inputCounts, setInputCounts, setDifference }) => {
    const [cashState, setCashState] = useState({});
    const [error, setError] = useState(null);

    // ✅ 金種データのキーを統一するためのマッピング関数
    const mapCashStateKeys = (data) => {
        if (data && data.denominations && data.denominations[0]) {
            const denom = data.denominations[0];
            return {
                TenThousandYen: denom.TotalTenThousandYen || 0,
                FiveThousandYen: denom.TotalFiveThousandYen || 0,
                OneThousandYen: denom.TotalOneThousandYen || 0,
                FiveHundredYen: denom.TotalFiveHundredYen || 0,
                OneHundredYen: denom.TotalOneHundredYen || 0,
                FiftyYen: denom.TotalFiftyYen || 0,
                TenYen: denom.TotalTenYen || 0,
                FiveYen: denom.TotalFiveYen || 0,
                OneYen: denom.TotalOneYen || 0,
            };
        }
        return {};  // データがない場合は空のオブジェクトを返す
    };
    

    // ✅ 金庫の現在状態を取得
    const fetchCashState = useCallback(async () => {
        try {
            const data = await getCurrentInventory();
            console.log("Received data:", data);  // ここでレスポンスデータを確認
            setCashState(mapCashStateKeys(data));
        } catch (error) {
            console.error("❌ 金庫状態取得エラー:", error);
            setError("金庫状態の取得に失敗しました。");
        }
    }, []);
    
    

    useEffect(() => {
        fetchCashState();
    }, [fetchCashState]);  // 依存関係を確認（`fetchCashState` は変更されないので、ここで問題なし）
 

    // ✅ 現在の金額を計算（金種 × 現在枚数）
    const calculateTotalAmount = () => {
        return Object.entries(denominationValues).reduce(
            (total, [denomination, value]) => total + (cashState[denomination] || 0) * value,
            0
        );
    };

    // ✅ 入力金額の計算
    const calculateInputAmount = useCallback(() => {
        const total = Object.entries(inputCounts).reduce(
            (sum, [denomination, count]) => sum + (denominationValues[denomination] || 0) * (count || 0),
            0
        );
        return total;
    }, [inputCounts]);  // 🔹 `inputCounts` に依存
    
    // ✅ `calculateInputAmount` を `useEffect` の依存配列に入れても安全になる
    useEffect(() => {
        setDifference(calculateInputAmount());
    }, [calculateInputAmount, setDifference]);  // 🔥 `calculateInputAmount` を依存配列に追加

    // ✅ 金種の増減ボタン
    const adjustCount = (denomination, delta) => {
        setInputCounts((prev) => ({
            ...prev,
            [denomination]: (prev[denomination] || 0) + delta,
        }));
    };

    return (
        <div className="container mt-3">
            {error && <p className="text-danger text-center">{error}</p>}
            <table className="fs-5 table table-bordered table-hover table-striped table-sm text-center cash-state-table">
                <thead className="table-success">
                    <tr>
                        <th>金種</th>
                        <th>現在枚数</th>
                        <th>入力枚数</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(denominationLabels).map(([denomination, label]) => (
                        <tr key={denomination}>
                            <td className="fs-4">{label}</td>
                            <td className="fs-4">{cashState[denomination] !== undefined ? cashState[denomination] : 0}</td>
                            <td className="d-flex align-items-center justify-content-center gap-2">
                                <div className="btn-group">
                                    <button 
                                        className="fs-6 btn btn-sm btn-outline-danger"
                                        onClick={() => adjustCount(denomination, -1)} 
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={inputCounts[denomination] || ""}
                                        className="fs-4 fw-bold form-control form-control-sm w-50 text-center"
                                        onChange={(e) => setInputCounts({ ...inputCounts, [denomination]: parseInt(e.target.value, 10) || 0 })} 
                                    />
                                    <button 
                                        className="fs-6 btn btn-sm btn-outline-primary"
                                        onClick={() => adjustCount(denomination, 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>

                <tfoot>
                    <tr>
                        <td colSpan="2" className="fs-4 text-end fw-bold">現金:</td>
                        <td className="fs-4 fw-bold">¥{calculateTotalAmount().toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td colSpan="2" className="fs-4 text-end fw-bold">差額:</td>
                        <td className="fs-4 fw-bold text-danger">¥{calculateInputAmount().toLocaleString()}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default CashStateTable;
