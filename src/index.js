import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { AuthContextProvider } from "./contexts/AuthContext";
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <Router>
    <AuthContextProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </AuthContextProvider>
  </Router>
);