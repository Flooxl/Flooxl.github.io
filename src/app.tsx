// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // убедись, что файл src/App.tsx существует с точно таким именем

import './index.css'; // если есть глобальные стили

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
