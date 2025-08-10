import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';

import './i18n/i18n.js';
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <React.Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
    <App />
    </React.Suspense>
  </StrictMode>,
)
