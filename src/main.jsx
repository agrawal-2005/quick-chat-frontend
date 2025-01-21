import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { SessionProvider } from './context/SessionContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <ThemeProvider>
          <SessionProvider>
              <App />
          </SessionProvider>
      </ThemeProvider>
  </React.StrictMode>
);
