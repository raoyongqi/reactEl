// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';  // 使用 React 18 的新的 root API
import './index.css';  // 样式文件
import App from './App';  // 导入 App 组件

// 创建根节点并渲染应用
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
