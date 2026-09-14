import { useState } from "react";
import {
  isAnalyticsOptedOut,
  setAnalyticsOptOut,
} from "../analyticsPreference";

export default function AnalyticsToggle() {
  const [optedOut] = useState(() => isAnalyticsOptedOut());

  const handleToggle = () => {
    setAnalyticsOptOut(!optedOut);

    // Reload so Vercel Analytics is either mounted or removed completely.
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={!optedOut}
      title={
        optedOut
          ? "Turn anonymous website analytics on"
          : "Turn anonymous website analytics off"
      }
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
        color: "inherit",
        font: "inherit",
        cursor: "pointer",
        textDecoration: "none",
      }}
    >
      Analytics: {optedOut ? "Off" : "On"}
    </button>
  );
}