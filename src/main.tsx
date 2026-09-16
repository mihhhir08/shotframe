import { inject } from '@vercel/analytics'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles.css'

createRoot(document.getElementById('root')!).render(<App />)

// Page counts only: no cookies, no accounts, and screenshots never leave the browser.
if (import.meta.env.PROD) inject()

if (import.meta.env.PROD && 'serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js')
