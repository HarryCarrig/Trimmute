/// <reference types="vite/client" />

import React, { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL || "https://trimmute.onrender.com";

const MY_BOOKINGS_URL = `${API_BASE_URL}/my-bookings`;

type Booking = {
  id: string | number;
  barberId: string | number;
  barberName: string | null;
  customerName: string | null;
  date: string;
  time: string;
  createdAt?: string;
};

type MyBookingsProps = {
  onBack: () => void;
};

const MyBookings: React.FC<MyBookingsProps> = ({ onBack }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  async function loadBookings() {
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("trimmute_customer_token");

      if (!token) {
        setBookings([]);
        setError("No bookings found on this device yet.");
        return;
      }

      const res = await fetch(MY_BOOKINGS_URL, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // If backend was asleep, retry once after a delay
      if (!res.ok) {
        await new Promise((resolve) => setTimeout(resolve, 1200));

        const retry = await fetch(MY_BOOKINGS_URL, {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!retry.ok) throw new Error(`Failed to fetch bookings (HTTP ${retry.status})`);

        const data = await retry.json();
        setBookings(Array.isArray(data) ? data : []);
        return;
      }

      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message ?? "Failed to fetch");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

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
        <p style={{ color: "red", fontSize: "0.9rem" }}>
          {error}
        </p>
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
              <div style={{ fontWeight: 600 }}>
                {b.barberName ?? `Barber #${b.barberId}`}
              </div>

              <div style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                {b.date} at {String(b.time).slice(0, 5)}
              </div>

              <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                Booked for {b.customerName ?? "(no name given)"}
              </div>
            </div>

            <button
              type="button"
              disabled
              title="Customer cancel is not enabled yet"
              style={{
                padding: "0.35rem 0.9rem",
                backgroundColor: "#9ca3af",
                color: "white",
                border: "none",
                borderRadius: "999px",
                cursor: "not-allowed",
                fontSize: "0.85rem",
                opacity: 0.85,
              }}
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
