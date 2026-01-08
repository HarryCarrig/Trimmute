import React, { useEffect, useState } from "react";


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://trimmute.onrender.com";

const BOOKINGS_URL = `${API_BASE_URL}/bookings`;


type BarberDetailProps = {
  shop: {
    id: string;
    name: string;
    address: string;
    imageUrl?: string | null;
    basePrice: number;
    styles: string[];
    distanceKm?: number;
    postcode?: string;
    lat?: number;
    lng?: number;
  };
  onBack: () => void;
};

const BarberDetail: React.FC<BarberDetailProps> = ({ shop, onBack }) => {

  const [bookingDate, setBookingDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
const [loadingTimes, setLoadingTimes] = useState(false);

  const hasDistance =
    typeof shop.distanceKm === "number" && !Number.isNaN(shop.distanceKm);

  const walkingMins = hasDistance
    ? Math.round(((shop.distanceKm as number) / 5) * 60)
    : null;
  const drivingMins = hasDistance
    ? Math.round(((shop.distanceKm as number) / 30) * 60)
    : null;

  const isSilent = shop.styles.includes("Silent cut available");

  // Map support – only if we have coordinates
  const hasCoords =
    typeof shop.lat === "number" && typeof shop.lng === "number";

  const mapUrl = hasCoords
    ? `https://www.google.com/maps?q=${shop.lat},${shop.lng}&z=15&output=embed`
    : null;

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
  ];

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
  async function loadBooked() {
 if (!bookingDate) {
  setBookedTimes([]);
  setLoadingTimes(false);
  return;
}


    try {
      setLoadingTimes(true);
      const url = `${BOOKINGS_URL}?barberId=${encodeURIComponent(
        shop.id
      )}&date=${encodeURIComponent(bookingDate)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load bookings (HTTP ${res.status})`);
      const data = await res.json();

      // backend returns [{ time: "09:00", ... }]
      const times = Array.isArray(data)
        ? data.map((b: any) => String(b.time)).filter(Boolean)
        : [];

      setBookedTimes(times);

      // if user had picked a time that is now booked, clear it
      if (times.includes(selectedTime)) setSelectedTime("");
    } catch (e) {
      console.error(e);
      // fail soft: don’t block booking UI
      setBookedTimes([]);
    } finally {
      setLoadingTimes(false);
    }
  }

  loadBooked();
}, [bookingDate, shop.id, selectedTime]); // eslint-disable-line react-hooks/exhaustive-deps

  // Treat Silent Snips (id "1") as the flagship real shop
  const isSilentSnips = shop.id === "1" || shop.name === "Silent Snips";

  const aboutText = isSilentSnips
    ? "Silent Snips is Trimmute’s flagship silent-first barbershop in central London. Lights low, music soft, no forced small talk – just sharp fades, clean tapers and a calm, neurodivergent-friendly space where you can fully switch off."
    : `${shop.name} is a calm, conversation-optional barbershop focused on clean fades, sharp lines and a low-stress experience. Let the clippers buzz and your brain switch off – no forced small talk required.`;

  const servicesList = isSilentSnips ? (
    <>
      <li>Silent skin fade – from £25.00</li>
      <li>Silent standard cut – from £22.00</li>
      <li>Buzz cut (quiet, in-and-out) – from £18.00</li>
      <li>Beard trim &amp; line-up – from £12.00</li>
      <li>Silent full restyle (45 mins) – from £30.00</li>
    </>
  ) : (
    <>
      <li>Standard cut – from £{(shop.basePrice / 100).toFixed(2)}</li>
      <li>
        Skin fade &amp; style – from £
        {(shop.basePrice / 100 + 5).toFixed(2)}
      </li>
      <li>Beard trim &amp; shape up – from £10.00</li>
      {isSilent && <li>Silent appointment option (no small talk)</li>}
    </>
  );

  const openingHours = isSilentSnips
    ? "Mon–Fri: 9am – 7pm · Sat: 10am – 6pm · Sun: Closed"
    : "Mon–Fri: 9am – 7pm · Sat: 9am – 5pm · Sun: Closed";

  async function handleConfirmBooking() {
    setError("");
    setMessage("");

    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!bookingDate) {
      setError("Please choose a date.");
      return;
    }
    if (!selectedTime) {
      setError("Please choose a time slot.");
      return;
    }

    try {
      const res = await fetch(BOOKINGS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barberId: shop.id,
          barberName: shop.name,
          customerName: customerName.trim(),
          date: bookingDate,
          time: selectedTime,
        }),
      });
      
if (res.status === 409) {
  const data = await res.json().catch(() => null);
  setError(data?.error ?? "That time slot is already booked. Pick another time.");
  return;
}


      if (!res.ok) {
        throw new Error(`Booking failed (HTTP ${res.status})`);
      }

      const data = await res.json();

// use the values the user picked (always clean + no timezone weirdness)
setMessage(
  `Silent cut booked at ${shop.name} for ${
    customerName.trim() || "you"
  } on ${bookingDate} at ${selectedTime}.`
);

setBookedTimes((prev) =>
  prev.includes(selectedTime) ? prev : [...prev, selectedTime]
);

    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to confirm booking.");
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
        ← Back to results
      </button>

      {/* Hero card */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          padding: "1.25rem",
          borderRadius: "12px",
          border: "1px solid #e5e5e5",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
          marginBottom: "1.5rem",
          alignItems: "center",
        }}
      >
        {/* Image / avatar */}
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "12px",
            backgroundColor: "#e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontWeight: 600,
            color: "#374151",
            fontSize: "0.9rem",
            textAlign: "center",
            padding: "0.25rem",
          }}
        >
          {shop.imageUrl ? (
            <img
              src={shop.imageUrl}
              alt={shop.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          ) : (
            <span>{shop.name}</span>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: "0.35rem", fontSize: "1.5rem" }}>
            {shop.name}
          </h2>

          <div
            style={{
              fontSize: "0.95rem",
              marginBottom: "0.35rem",
              color: "#4b5563",
            }}
          >
            {shop.address}
          </div>

          <div
            style={{
              fontSize: "0.95rem",
              marginBottom: "0.35rem",
              fontWeight: 500,
            }}
          >
            From £{(shop.basePrice / 100).toFixed(2)}
          </div>

          <div style={{ marginBottom: "0.35rem" }}>
            {isSilent && (
              <span
                style={{
                  display: "inline-block",
                  padding: "0.15rem 0.45rem",
                  borderRadius: "999px",
                  backgroundColor: "#dcfce7",
                  color: "#166534",
                  marginRight: "0.4rem",
                  fontSize: "0.8rem",
                }}
              >
                🔇 Silent cut available
              </span>
            )}
            {hasDistance && (
              <span
                style={{
                  display: "inline-block",
                  padding: "0.15rem 0.45rem",
                  borderRadius: "999px",
                  backgroundColor: "#dbeafe",
                  color: "#1d4ed8",
                  fontSize: "0.8rem",
                }}
              >
                ~{(shop.distanceKm as number).toFixed(1)} km away
              </span>
            )}
          </div>

          {hasDistance && (walkingMins !== null || drivingMins !== null) && (
            <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
              {walkingMins !== null && `~${walkingMins} min walk`}
              {walkingMins !== null && drivingMins !== null && " · "}
              {drivingMins !== null && `~${drivingMins} min drive`}
            </div>
          )}
        </div>
      </div>

      {/* Map section */}
      {mapUrl && (
        <section
          style={{
            marginBottom: "1.25rem",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3
            style={{
              margin: "0.75rem 0.75rem 0.25rem",
              fontSize: "0.95rem",
            }}
          >
            Location
          </h3>
          <div style={{ width: "100%", height: "220px" }}>
            <iframe
              src={mapUrl}
              title={`Map of ${shop.name}`}
              style={{ border: 0, width: "100%", height: "100%" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      )}

      {/* About / description */}
      <section style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ marginBottom: "0.35rem" }}>About</h3>
        <p style={{ fontSize: "0.95rem", color: "#4b5563" }}>{aboutText}</p>
      </section>

      {/* Services */}
      <section style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ marginBottom: "0.35rem" }}>Services</h3>
        <ul
          style={{
            fontSize: "0.95rem",
            color: "#4b5563",
            paddingLeft: "1.1rem",
          }}
        >
          {servicesList}
        </ul>
      </section>

      {/* Booking section */}
      <section style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ marginBottom: "0.35rem" }}>Book a silent cut</h3>

        {/* Name */}
        <div style={{ marginBottom: "0.75rem" }}>
          <label style={{ fontSize: "0.95rem" }}>
            Your name:{" "}
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Harry"
              style={{ padding: "0.25rem 0.5rem", minWidth: "180px" }}
            />
          </label>
        </div>

        {/* Date picker */}
        <div style={{ marginBottom: "0.75rem" }}>
          <label style={{ fontSize: "0.95rem" }}>
            Choose a date:{" "}
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              min={todayStr}
              style={{ padding: "0.25rem 0.5rem" }}
            />
          </label>
        </div>

        {/* Time slots */}
        <div style={{ marginBottom: "0.75rem" }}>
          <p style={{ fontSize: "0.95rem", marginBottom: "0.35rem" }}>
            Choose a time:
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {timeSlots.map((slot) => {
              const isSelected = selectedTime === slot;
              const isBooked = bookedTimes.includes(slot);
              return (
       <button
  key={slot}
  type="button"
  onClick={() => setSelectedTime(slot)}
  disabled={isBooked}
  style={{
    padding: "0.35rem 0.75rem",
    borderRadius: "999px",
    border: isSelected ? "2px solid #2563eb" : "1px solid #d1d5db",
    backgroundColor: isBooked ? "#f3f4f6" : isSelected ? "#dbeafe" : "white",
    cursor: isBooked ? "not-allowed" : "pointer",
    fontSize: "0.85rem",
    opacity: isBooked ? 0.55 : 1,
  }}
  title={isBooked ? "Already booked" : undefined}
>
  {slot}
</button>

              );
            })}
          </div>
        </div>

        {/* Confirm button + messages */}
        <div style={{ marginTop: "0.5rem" }}>
          <button
            type="button"
            onClick={handleConfirmBooking}
            style={{
              padding: "0.6rem 1.4rem",
              backgroundColor: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "999px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            Confirm booking
          </button>

          {error && (
            <p
              style={{ marginTop: "0.5rem", color: "red", fontSize: "0.9rem" }}
            >
              {error}
            </p>
          )}
          {message && (
            <p
              style={{
                marginTop: "0.5rem",
                color: "#16a34a",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              {message}
            </p>
          )}
        </div>
      </section>

      {/* Opening hours */}
      <section style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ marginBottom: "0.35rem" }}>Opening hours</h3>
        <p style={{ fontSize: "0.95rem", color: "#4b5563" }}>
          {openingHours}
        </p>
      </section>
    </div>
  );
};

export default BarberDetail;
