import React from "react";

export default function BarberMode({ onBack }: { onBack?: () => void }) {
  const THEME = {
    bg: "#1a1a1a",
    cardBg: "#262626",
    textMain: "#ffffff",
    textMuted: "#a3a3a3",
    border: "#404040",
  };

  return (
    <div
      style={{
        padding: "1rem",
        color: THEME.textMain,
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        {onBack ? (
          <button
            onClick={onBack}
            style={{
              background: "transparent",
              border: `1px solid ${THEME.border}`,
              color: THEME.textMain,
              padding: "6px 12px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        ) : (
          <div style={{ width: "60px" }} />
        )}

        <h1
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            margin: 0,
          }}
        >
          Barber Dashboard
        </h1>

        <div style={{ width: "60px" }} />
      </div>

      <div
        style={{
          background: THEME.cardBg,
          padding: "1.5rem",
          borderRadius: "12px",
          border: `1px solid ${THEME.border}`,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            fontSize: "1.1rem",
          }}
        >
          Partner dashboard coming soon
        </h2>

        <p
          style={{
            color: THEME.textMuted,
            marginBottom: 0,
            lineHeight: 1.5,
          }}
        >
          Trimmute currently operates as a discovery platform. Businesses can be
          listed as quiet-friendly and direct customers to their existing
          booking service.
        </p>
      </div>
    </div>
  );
}