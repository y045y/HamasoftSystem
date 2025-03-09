import React from 'react';
import { Route, Routes } from 'react-router-dom';  // <- BrowserRouter は削除
import MenuPage from './pages/MenuPage';
import CashManagementFormUI from './components/CashManagementFormUI';

function App() {
    return (
        <Routes>  {/* <- ここで BrowserRouter は使わない */}
            <Route path="/" element={<MenuPage />} />
            <Route path="/dashboard" element={<div>ダッシュボード</div>} />
            <Route path="/users" element={<div>ユーザー管理</div>} />
            <Route path="/settings" element={<div>設定</div>} />
            <Route path="/cash-management" element={<CashManagementFormUI />} /> 
        </Routes>
    );
}

export default App;
