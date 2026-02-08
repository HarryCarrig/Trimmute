/// <reference types="vite/client" />
import React, { useEffect, useState } from "react";

// DEMO DATA
const DEMO_BOOKINGS = [
  {
    id: 101,
    customerName: "Harry Carrig",
    time: "11:30",
    date: "2026-02-10",
    service: "Skin Fade",
    createdAt: "2026-02-07T10:00:00",
  },
  {
    id: 102,
    customerName: "Tom Smith",
    time: "13:00",
    date: "2026-02-10",
    service: "Little Fella (Student)",
    createdAt: "2026-02-07T14:30:00",
  },
  {
    id: 103,
    customerName: "Alex Jones",
    time: "15:45",
    date: "2026-02-10",
    service: "Beard Trim",
    createdAt: "2026-02-08T09:15:00",
  },
];

// FIXED: Added '?' to make onBack optional
export default function BarberMode({ onBack }: { onBack?: () => void }) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setBookings(DEMO_BOOKINGS);
      setLoading(false);
    }, 600);
  }, [selectedDate]);

  function cancelBooking(id: number) {
    if (confirm("Demo: Cancel this booking?")) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
    }
  }

  const THEME = {
    bg: "#1a1a1a",
    cardBg: "#262626",
    textMain: "#ffffff",
    textMuted: "#a3a3a3",
    accent: "#3b82f6",
    danger: "#ef4444",
    border: "#404040",
  };

  return (
    <div style={{ padding: "1rem", color: THEME.textMain, maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        {onBack && (
          <button 
            onClick={onBack}
            style={{ 
              background: "transparent", 
              border: "1px solid " + THEME.border, 
              color: THEME.textMain, 
              padding: "6px 12px", 
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            ← Back
          </button>
        )}
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
          Barber Dashboard
        </h1>
        <div style={{ width: "60px" }}></div>
      </div>

      <div style={{ background: THEME.cardBg, padding: "1rem", borderRadius: "12px", border: `1px solid ${THEME.border}`, marginBottom: "1.5rem" }}>
        <p style={{ margin: "0 0 1rem 0", color: THEME.textMuted, fontSize: "0.9rem" }}>
          Manage your silent appointments.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <label style={{ fontSize: "0.9rem", color: THEME.textMuted }}>Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ 
              padding: "0.5rem", 
              borderRadius: "6px", 
              border: `1px solid ${THEME.border}`, 
              background: "#333", 
              color: "white" 
            }}
          />
        </div>
      </div>

      {loading && <p style={{ textAlign: "center", color: THEME.textMuted }}>Refreshing schedule...</p>}

      {!loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          {bookings.map((b) => (
            <div
              key={b.id}
              style={{
                backgroundColor: THEME.cardBg,
                padding: "1rem",
                borderRadius: "10px",
                border: `1px solid ${THEME.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#4ade80" }}>{b.time}</span>
                  <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{b.customerName}</span>
                </div>
                <div style={{ fontSize: "0.85rem", color: THEME.textMuted }}>
                  ✂️ {b.service} &bull; Silent Requested 🤫
                </div>
              </div>

              <button
                type="button"
                onClick={() => cancelBooking(b.id)}
                style={{
                  padding: "0.4rem 0.8rem",
                  backgroundColor: "rgba(239, 68, 68, 0.15)",
                  color: THEME.danger,
                  border: `1px solid rgba(239, 68, 68, 0.3)`,
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: "600"
                }}
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}