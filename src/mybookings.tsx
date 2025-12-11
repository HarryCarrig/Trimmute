import React, { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const BOOKINGS_URL = `${API_BASE_URL}/bookings`;

type Booking = {
  id: string | number;
  barberId: string | number;
  barberName: string;
  customerName: string;
  date: string;
  time: string;
};

type MyBookingsProps = {
  onBack: () => void;
};

const MyBookings: React.FC<MyBookingsProps> = ({ onBack }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [cancellingId, setCancellingId] = useState<string | number | null>(
    null
  );

async function loadBookings() {
  setError("");
  setLoading(true);

  try {
    const res = await fetch(BOOKINGS_URL);

    // If backend was asleep, retry once after a delay
    if (!res.ok) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const retry = await fetch(BOOKINGS_URL);
      if (!retry.ok) throw new Error("Failed to fetch bookings");
      setBookings(await retry.json());
    } else {
      setBookings(await res.json());
    }
  } catch (err: any) {
    setError(err.message ?? "Failed to fetch");
  } finally {
    setLoading(false);
  }
}


  useEffect(() => {
    loadBookings();
  }, []);

  async function handleCancel(id: string | number) {
    const confirmCancel = window.confirm(
      "Cancel this booking? This cannot be undone."
    );
    if (!confirmCancel) return;

    try {
      setError("");
      setCancellingId(id);

      const res = await fetch(`${BOOKINGS_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok && res.status !== 204 && res.status !== 404) {
        throw new Error(`Failed to cancel booking (HTTP ${res.status})`);
      }

      setBookings((prev) => prev.filter((b) => String(b.id) !== String(id)));
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to cancel booking.");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      <button
        onClick={onBack}
        style={{
          padding: "0.4rem 0.9rem",
          backgroundColor: "#e5e7eb",
          border: "none",
          borderRadius: "999px",
          cursor: "pointer",
          fontSize: "0.9rem",
          marginBottom: "1rem",
        }}
      >
        ← Back to search
      </button>

      <h2 style={{ marginBottom: "0.75rem" }}>My bookings</h2>

      {loading && <p>Loading your bookings…</p>}
      {error && (
        <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>
      )}

      {!loading && !error && bookings.length === 0 && (
        <p style={{ fontSize: "0.95rem", color: "#4b5563" }}>
          You don’t have any bookings yet.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {bookings.map((b) => (
          <div
            key={b.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "0.75rem 1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{b.barberName}</div>
              <div style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                {b.date} at {b.time}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                Booked for {b.customerName}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCancel(b.id)}
              disabled={cancellingId === b.id}
              style={{
                padding: "0.35rem 0.9rem",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "999px",
                cursor: "pointer",
                fontSize: "0.85rem",
                opacity: cancellingId === b.id ? 0.7 : 1,
              }}
            >
              {cancellingId === b.id ? "Cancelling..." : "Cancel"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
