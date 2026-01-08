import React, { useState, useEffect } from "react";
import BarberMode from "./BarberMode";
import BarberDetail from "./BarberDetail";
import silentSnipsImg from "./assets/silent-snips.jpg";
import MyBookings from "./mybookings";

type Shop = {
  id: string;
  name: string;
  address: string;
  imageUrl?: string | null;
  basePrice: number; // pence
  styles: string[];
  distanceKm?: number;
  postcode?: string;
  lat?: number;
  lng?: number;
};

// 👇 added "bookings" here
type View = "home" | "barber" | "detail" | "bookings";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://trimmute.onrender.com";

const BACKEND_URL = `${API_BASE}/barbers`;
const BACKEND_NEAR_URL = `${API_BASE}/barbers/near`;


export default function App() {
  const [view, setView] = useState<View>("home");
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [postcode, setPostcode] = useState("");
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  async function loadShops() {
    try {
      setError("");
      setLoading(true);

      const res = await fetch(BACKEND_URL);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const raw: any[] = await res.json();

      const mapped: Shop[] = raw.map((b, index) => ({
        id: String(b.id ?? index),
        name: b.name,
        address: b.address ?? b.city ?? "Unknown area",
        imageUrl:
          b.imageUrl ??
          (b.id === 1 || b.name === "Silent Snips" ? silentSnipsImg : null),
        basePrice: b.basePrice ?? b.basePricePence ?? 2000,
        styles:
          b.styles ??
          (b.silentCutAvailable ? ["Silent cut available"] : []),
        distanceKm: b.distanceKm,
        postcode: b.postcode,
        lat: typeof b.lat === "number" ? b.lat : undefined,
        lng: typeof b.lng === "number" ? b.lng : undefined,
      }));

      setShops(mapped);
      setView("home");
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to load barbers");
      setShops([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadShopsNearCoords(latitude: number, longitude: number) {
    try {
      setError("");
      setLoading(true);

      const url = `${BACKEND_NEAR_URL}?lat=${latitude}&lng=${longitude}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const raw: any[] = await res.json();

      const mapped: Shop[] = raw.map((b, index) => ({
        id: String(b.id ?? index),
        name: b.name,
        address: b.address ?? b.city ?? "Unknown area",
        imageUrl:
          b.imageUrl ??
          (b.id === 1 || b.name === "Silent Snips" ? silentSnipsImg : null),
        basePrice: b.basePrice ?? b.basePricePence ?? 2000,
        styles:
          b.styles ??
          (b.silentCutAvailable ? ["Silent cut available"] : []),
        distanceKm: b.distanceKm,
        postcode: b.postcode,
        lat: typeof b.lat === "number" ? b.lat : undefined,
        lng: typeof b.lng === "number" ? b.lng : undefined,
      }));

      setView("home");
      setShops(mapped);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to load nearby barbers");
      setShops([]);
    } finally {
      setLoading(false);
    }
  }

  function loadShopsNearMe() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    setError("");
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        loadShopsNearCoords(latitude, longitude);
      },
      (geoError) => {
        console.error(geoError);
        setLoading(false);
        if (geoError.code === 1) {
          setError("Location permission denied.");
        } else {
          setError("Could not get your location.");
        }
      }
    );
  }

  async function searchByPostcode() {
    if (!postcode.trim()) return;

    try {
      setError("");
      setLoading(true);

      const cleaned = postcode.trim().replace(/\s+/g, "");

      const res = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(cleaned)}`
      );
      const data = await res.json();

      if (data.status !== 200 || !data.result) {
        throw new Error(data.error || "Postcode not found");
      }

      const { latitude, longitude } = data.result;
      await loadShopsNearCoords(latitude, longitude);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to search by postcode");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (shops.length === 0) {
      loadShops();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleShops = shops.filter((shop) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.trim().toLowerCase();
    return shop.address.toLowerCase().includes(q);
  });

  const showHome = view === "home";
  const showBarberMode = view === "barber";
  const showDetail = view === "detail" && selectedShop;
  const showBookings = view === "bookings";

  return (
<div
  style={{
    padding: "1.5rem",
    maxWidth: 700,
    margin: "0 auto",
    backgroundColor: "#f3f4f6", // light grey
    minHeight: "100vh",
  }}
>

      <h1 style={{ marginBottom: "0.5rem" }}>Trimmute</h1>
      <p style={{ marginBottom: "1rem" }}>
        Silent-friendly barbers, no awkward small talk.
      </p>


      {showBarberMode && <BarberMode />}

      {showDetail && selectedShop && (
        <BarberDetail
          shop={selectedShop}
          onBack={() => {
            setView("home");
          }}
        />
      )}

      {/* 👇 NEW: bookings view */}
      {showBookings && (
        <MyBookings
          onBack={() => {
            setView("home");
          }}
        />
      )}

      {showHome && !showDetail && !showBookings && (
        <>
        {/* TOP BUTTONS */}
<div
  style={{
    display: "flex",
    gap: "0.75rem",
    marginBottom: "1.25rem",
    flexWrap: "wrap",
    alignItems: "center",
  }}
>
  {/* Primary actions */}
  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
    <button
      onClick={() => {
        setSelectedShop(null);
        setView("home");
        loadShops();
      }}
      style={{
padding: "0.6rem 1.2rem",
  backgroundColor: "#dc2626", // red-600
  color: "white",
  border: "1px solid #b91c1c",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "0.95rem",
  boxShadow: "0 10px 20px rgba(220, 38, 38, 0.25)",
      }}
    >
      🔄 Reload barbers
    </button>

    <button
      onClick={() => {
        setSelectedShop(null);
        setView("home");
        loadShopsNearMe();
      }}
      style={{
    padding: "0.6rem 1.2rem",
  backgroundColor: "#dc2626", // red-600
  color: "white",
  border: "1px solid #b91c1c",
  borderRadius: "14px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "0.95rem",
  boxShadow: "0 10px 20px rgba(220, 38, 38, 0.25)",
      }}
    >
      📍 Use my location
    </button>
  </div>

  {/* Secondary actions */}
  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
    <button
      onClick={() => {
        setSelectedShop(null);
        setView("barber");
      }}
      style={{
  padding: "0.45rem 0.9rem",
  backgroundColor: "white",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.85rem",
      }}
    >
      ✂️ Barber mode
    </button>

    <button
      onClick={() => {
        setSelectedShop(null);
        setView("bookings");
      }}
      style={{
  padding: "0.45rem 0.9rem",
  backgroundColor: "white",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.85rem",
      }}
    >
      📅 My bookings
    </button>
  </div>
</div>

          {/* Search row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginBottom: "1rem",
              alignItems: "center",
            }}
          >
            <div>
              <label>
                Search by area or postcode:{" "}
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. SW1A or Manchester"
                  style={{ padding: "0.25rem 0.5rem" }}
                />
              </label>
            </div>

            <div>
              <label>
                Or enter full postcode:{" "}
                <input
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="e.g. SW1A 1AA"
                  style={{
                    padding: "0.25rem 0.5rem",
                    marginRight: "0.5rem",
                  }}
                />
              </label>
              <button
                onClick={searchByPostcode}
                style={{
                 padding: "0.35rem 0.8rem",
    backgroundColor: "#0ea5e9",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
                }}
              >
                Search postcode
              </button>
            </div>
          </div>

          {loading && <p>Loading barbers...</p>}
          {error && <p style={{ color: "red" }}>Error: {error}</p>}

          {!loading && !error && visibleShops.length === 0 && (
            <p>No barbers found. Try a different area or postcode.</p>
          )}

          {visibleShops.map((shop) => {
            const hasDistance =
              typeof shop.distanceKm === "number" &&
              !Number.isNaN(shop.distanceKm);
            const walkingMins = hasDistance
              ? Math.round(((shop.distanceKm as number) / 5) * 60)
              : null;
            const drivingMins = hasDistance
              ? Math.round(((shop.distanceKm as number) / 30) * 60)
              : null;

            return (
              <div
                key={shop.id}
                onClick={() => {
                  setSelectedShop(shop);
                  setView("detail");
                }}
                style={{
                  display: "flex",
                  gap: "1rem",
                  padding: "1rem",
                  borderRadius: "10px",
                  border: "1px solid #e5e5e5",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                  marginBottom: "0.75rem",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                {/* Avatar / image box */}
                <div
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "8px",
                    backgroundColor: "#e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: "0.85rem",
                    textAlign: "center",
                    padding: "0.25rem",
                  }}
                >
                  {shop.imageUrl ? (
                    <img
                      src={shop.imageUrl}
                      alt={shop.name}
                      crossOrigin="anonymous"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <span>{shop.name}</span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: "0.25rem" }}>{shop.name}</h3>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      marginBottom: "0.25rem",
                      color: "#4b5563",
                    }}
                  >
                    {shop.address}
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      marginBottom: "0.25rem",
                      fontWeight: 500,
                    }}
                  >
                    £{(shop.basePrice / 100).toFixed(2)}
                  </div>

                  <div style={{ fontSize: "0.85rem", color: "#374151" }}>
                    {shop.styles.includes("Silent cut available") && (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.15rem 0.4rem",
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
                  </div>

                  {hasDistance && (
                    <div
                      style={{
                        fontSize: "0.85rem",
                        marginTop: "0.35rem",
                        color: "#6b7280",
                      }}
                    >
                      ~{(shop.distanceKm as number).toFixed(1)} km away
                      {walkingMins !== null &&
                        ` · ~${walkingMins} min walk`}
                      {drivingMins !== null &&
                        ` · ~${drivingMins} min drive`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
