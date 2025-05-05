import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { TestProvider } from './contexts/TestContext'

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');

  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <BrowserRouter>
          <TestProvider>
            <App />
          </TestProvider>
        </BrowserRouter>
      </React.StrictMode>
    )
  } else {
    console.error('Root element not found in the DOM. Check your index.html file.');
  }
});