/// <reference types="vite/client" />
import React, { useEffect, useState } from "react";

const DEMO_BOOKINGS = [
  { id: 101, customerName: "Harry Carrig", time: "11:30", date: "2026-02-10", service: "Skin Fade", createdAt: "2026-02-07T10:00:00" },
  { id: 102, customerName: "Tom Smith", time: "13:00", date: "2026-02-10", service: "Little Fella", createdAt: "2026-02-07T14:30:00" },
  { id: 103, customerName: "Alex Jones", time: "15:45", date: "2026-02-10", service: "Beard Trim", createdAt: "2026-02-08T09:15:00" },
];

export default function BarberMode({ onBack }: { onBack?: () => void }) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => { setBookings(DEMO_BOOKINGS); setLoading(false); }, 600);
  }, [selectedDate]);

  function cancelBooking(id: number) {
    if (confirm("Demo: Cancel this booking?")) setBookings((prev) => prev.filter((b) => b.id !== id));
  }

  const THEME = { bg: "#1a1a1a", cardBg: "#262626", textMain: "#ffffff", textMuted: "#a3a3a3", danger: "#ef4444", border: "#404040" };

  return (
    <div style={{ padding: "1rem", color: THEME.textMain, maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        {onBack && (
          <button onClick={onBack} style={{ background: "transparent", border: "1px solid " + THEME.border, color: THEME.textMain, padding: "6px 12px", borderRadius: "8px", cursor: "pointer" }}>
            ← Back
          </button>
        )}
        <h1 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Barber Dashboard</h1>
        <div style={{ width: "60px" }}></div>
      </div>
      
      {/* Date Picker */}
      <div style={{ background: THEME.cardBg, padding: "1rem", borderRadius: "12px", border: `1px solid ${THEME.border}`, marginBottom: "1.5rem" }}>
         <label style={{ fontSize: "0.9rem", color: THEME.textMuted, marginRight: "10px" }}>Date:</label>
         <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ padding: "0.5rem", borderRadius: "6px", border: `1px solid ${THEME.border}`, background: "#333", color: "white" }} />
      </div>

      {loading ? <p>Refreshing...</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          {bookings.map((b) => (
            <div key={b.id} style={{ backgroundColor: THEME.cardBg, padding: "1rem", borderRadius: "10px", border: `1px solid ${THEME.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#4ade80", marginBottom: "4px" }}>{b.time} <span style={{ color: "white", fontSize: "0.9rem" }}>{b.customerName}</span></div>
                <div style={{ fontSize: "0.85rem", color: THEME.textMuted }}>✂️ {b.service}</div>
              </div>
              <button onClick={() => cancelBooking(b.id)} style={{ padding: "0.4rem 0.8rem", backgroundColor: "rgba(239, 68, 68, 0.15)", color: THEME.danger, border: `1px solid ${THEME.danger}`, borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}