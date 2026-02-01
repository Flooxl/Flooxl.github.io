import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // обязательно проверь, что файл App.tsx в src
import './index.css';    // если есть глобальные стили

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
