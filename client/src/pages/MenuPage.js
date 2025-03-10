import React from 'react';
import { Link } from 'react-router-dom';

const MenuPage = () => {
    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">メニュー</h1>
            <div className="list-group">
                <Link to="/dashboard" className="list-group-item list-group-item-action">
                    ダッシュボード
                </Link>
                <Link to="/users" className="list-group-item list-group-item-action">
                    ユーザー管理
                </Link>
                <Link to="/settings" className="list-group-item list-group-item-action">
                    設定
                </Link>
                <Link to="/cash-management" className="list-group-item list-group-item-action">
                    金庫管理
                </Link>  {/* ✅ ここに金庫管理を追加 */}
            </div>
        </div>
    );
};

export default MenuPage;
