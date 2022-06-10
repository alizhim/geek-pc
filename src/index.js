import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/antd.css';
import { ConfigProvider } from 'antd';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/locale/zh_CN';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider locale={locale}>
    <App />
  </ConfigProvider>
);

