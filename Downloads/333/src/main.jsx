import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ConnectPage from './ConnectPage.jsx'
import ConnectedPage from './ConnectedPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/connect" element={<ConnectPage />} />
        <Route path="/connected" element={<ConnectedPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
