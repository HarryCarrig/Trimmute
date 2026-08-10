import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Analytics } from "@vercel/analytics/react"
import "leaflet/dist/leaflet.css";
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivacyPage from "./PrivacyPage";
import TermsPage from "./TermsPage";
import CookiesPage from "./CookiesPage";

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
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/privacy" element={<PrivacyPage />} />
    <Route path="/terms" element={<TermsPage />} />
    <Route path="/cookies" element={<CookiesPage />} />
  </Routes>
  <Analytics />
</BrowserRouter>
</ClerkProvider>
  </React.StrictMode>,
)