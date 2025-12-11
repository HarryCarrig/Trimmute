import React, { useState, useEffect } from "react";

const BOOKINGS_URL = "http://localhost:3000/bookings";

type Booking = {
  id: number;
  barberId: string | number;
  barberName?: string | null;
  customerName?: string | null;
  date: string;
  time: string;
  createdAt: string;
};

export default function BarberMode() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  async function loadBookings() {
    try {
      setError("");
      setLoading(true);

      const url = `${BOOKINGS_URL}?date=${encodeURIComponent(selectedDate)}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: Booking[] = await res.json();
      const sorted = [...data].sort((a, b) => a.time.localeCompare(b.time));
      setBookings(sorted);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  async function cancelBooking(id: number) {
    try {
      setError("");

      const res = await fetch(`${BOOKINGS_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok && res.status !== 204) {
        throw new Error(`Failed to cancel booking (HTTP ${res.status})`);
      }

      // Remove from local state
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to cancel booking");
    }
  }

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: "1rem 0" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem" }}>
        Barber Mode
      </h1>
      <p style={{ marginBottom: "1rem" }}>
        View and manage silent cut bookings for your shop.
      </p>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <label style={{ fontSize: "0.95rem" }}>
          Date:{" "}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: "0.25rem 0.5rem" }}
          />
        </label>
        <button
          type="button"
          onClick={loadBookings}
          style={{
            padding: "0.4rem 0.9rem",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          Refresh bookings
        </button>
      </div>

      {loading && <p>Loading bookings...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <p>No bookings for this date yet.</p>
      )}

      {bookings.length > 0 && (
        <div
          style={{
            borderTop: "1px solid #e5e7eb",
            marginTop: "0.5rem",
            paddingTop: "0.5rem",
          }}
        >
          {bookings.map((b) => (
            <div
              key={b.id}
              style={{
                padding: "0.5rem 0",
                borderBottom: "1px solid #e5e7eb",
                fontSize: "0.95rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div>
                <div>
                  <strong>{b.time}</strong> — Silent cut{" "}
                  {b.customerName
                    ? `for ${b.customerName}`
                    : "(no name given)"}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#6b7280",
                    marginTop: "0.15rem",
                  }}
                >
                  {b.barberName
                    ? `At ${b.barberName}`
                    : `Barber #${b.barberId}`}{" "}
                  · Created at{" "}
                  {new Date(b.createdAt).toLocaleString()}
                </div>
              </div>

              <button
                type="button"
                onClick={() => cancelBooking(b.id)}
                style={{
                  padding: "0.3rem 0.7rem",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  whiteSpace: "nowrap",
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
