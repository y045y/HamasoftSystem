import React from 'react';
import { Route, Routes } from 'react-router-dom';  // <- BrowserRouter は削除
import MenuPage from './pages/MenuPage';

function App() {
    return (
        <Routes>  {/* <- ここで BrowserRouter は使わない */}
            <Route path="/" element={<MenuPage />} />
            <Route path="/dashboard" element={<div>ダッシュボード</div>} />
            <Route path="/users" element={<div>ユーザー管理</div>} />
            <Route path="/settings" element={<div>設定</div>} />
        </Routes>
    );
}

export default App;
