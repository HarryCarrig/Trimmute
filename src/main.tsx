import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Analytics } from "@vercel/analytics/react"
import "leaflet/dist/leaflet.css";
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { isAnalyticsOptedOut } from "./analyticsPreference";

import TermsPage from "./TermsPage";
import PrivacyPage from "./PrivacyPage";
import CookiesPage from "./CookiesPage";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

function AnalyticsGate() {
  if (isAnalyticsOptedOut()) {
    return null;
  }

  return <Analytics />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
        </Routes>

        <AnalyticsGate />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>,
)