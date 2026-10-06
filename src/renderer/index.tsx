import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MainView } from './MainView'
import './index.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root element not found')
}

createRoot(container).render(
  <StrictMode>
    <MainView />
  </StrictMode>,
)
