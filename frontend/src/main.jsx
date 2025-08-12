import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './App.css'
import App from './App.jsx'
import { AppProviders } from './AppProvider.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </AppProviders>
  </StrictMode>
)
