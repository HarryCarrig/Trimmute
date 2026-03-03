import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Analytics } from "@vercel/analytics/react"
import "leaflet/dist/leaflet.css";
import { ClerkProvider } from '@clerk/clerk-react'

// 1. Grab the secret key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// 2. Safety check
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

// 3. Render everything together
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
      <Analytics />
    </ClerkProvider>
  </React.StrictMode>,
)