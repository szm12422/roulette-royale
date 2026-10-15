import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { startActivity } from './activity.ts'
import GameErrorBoundary from './ui/GameErrorBoundary.tsx'
import '@fontsource/noto-sans-jp/500.css'
import '@fontsource/noto-sans-jp/700.css'
import './styles.css'

void startActivity(() => {
  const rootElement = document.getElementById('root')
  if (!rootElement) throw new Error('Missing #root element')

  createRoot(rootElement).render(
    <StrictMode>
      <GameErrorBoundary>
        <App />
      </GameErrorBoundary>
    </StrictMode>,
  )
})
