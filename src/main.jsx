
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

// Add this function to get the initial theme
function getInitialTheme() {
  const savedTheme = localStorage.getItem('darkMode');
  return savedTheme ? JSON.parse(savedTheme) : false;
}

// Apply the initial theme class to the body before rendering
document.body.classList.toggle('dark-theme', getInitialTheme());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
)
