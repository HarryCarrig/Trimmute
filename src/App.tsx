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

  const THEME = {
  bg: "#0b1220",            // deep slate background
  surface: "#111a2e",       // card surface
  surface2: "#0f172a",      // slightly darker surface
  border: "rgba(255,255,255,0.10)",
  text: "#e5e7eb",
  muted: "#aab3c5",

  primary: "#0ea5a4",       // teal
  primaryHover: "#0891b2",
  primaryText: "#062225",

  secondary: "rgba(255,255,255,0.06)",
  secondaryHover: "rgba(255,255,255,0.10)",

  chipBg: "rgba(34,197,94,0.14)", // green chip background
  chipText: "#86efac",

  danger: "#fb7185",
};

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

 const mapped: Shop[] = raw.map((b, index) => {
  const id = String(b.id ?? index);
  const name = String(b.name ?? "");

  const isSilentSnips = id === "1" || name === "Silent Snips";

  return {
    id,
    name,
    address: b.address ?? b.city ?? "Unknown area",

    // ✅ Always give Silent Snips the imported image
    // ✅ For others: only use b.imageUrl if it’s a real string
    imageUrl:
      isSilentSnips
        ? silentSnipsImg
        : typeof b.imageUrl === "string" && b.imageUrl.trim()
        ? b.imageUrl
        : null,

    basePrice: b.basePrice ?? b.basePricePence ?? 2000,

    styles:
      b.styles ??
      (b.silentCutAvailable || isSilentSnips
        ? ["Silent cut available"]
        : []),

    distanceKm: b.distanceKm,
    postcode: b.postcode,
    lat: typeof b.lat === "number" ? b.lat : undefined,
    lng: typeof b.lng === "number" ? b.lng : undefined,
  };
});


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
    padding: "1.75rem",
    maxWidth: 820,
    margin: "0 auto",
    minHeight: "100vh",
    background: `radial-gradient(1200px 800px at 20% 0%, rgba(14,165,164,0.18), transparent 60%),
                 radial-gradient(900px 600px at 90% 10%, rgba(56,189,248,0.12), transparent 55%),
                 ${THEME.bg}`,
    color: THEME.text,
  }}
>

   <h1 style={{ marginBottom: "0.35rem", fontSize: "2rem", letterSpacing: "-0.02em" }}>
  Trimmute
</h1>
<p style={{ marginBottom: "1.25rem", color: THEME.muted }}>
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
    padding: "0.9rem",
    borderRadius: "16px",
    backgroundColor: "rgba(255,255,255,0.05)",
    border: `1px solid ${THEME.border}`,
    backdropFilter: "blur(6px)",
  }}
>
  <button
    onClick={() => {
      setSelectedShop(null);
      setView("home");
      loadShops();
    }}
    style={{
      padding: "0.65rem 1.1rem",
      background: `linear-gradient(180deg, ${THEME.primary}, ${THEME.primaryHover})`,
      color: "white",
      border: "none",
      borderRadius: "999px",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: "0.9rem",
      boxShadow: "0 10px 22px rgba(14,165,164,0.22)",
      display: "flex",
      gap: "0.5rem",
      alignItems: "center",
    }}
  >
    🔄 <span>Reload</span>
  </button>

  <button
    onClick={() => {
      setSelectedShop(null);
      setView("home");
      loadShopsNearMe();
    }}
    style={{
      padding: "0.65rem 1.1rem",
      background: `linear-gradient(180deg, ${THEME.primary}, ${THEME.primaryHover})`,
      color: "white",
      border: "none",
      borderRadius: "999px",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: "0.9rem",
      boxShadow: "0 10px 22px rgba(14,165,164,0.22)",
      display: "flex",
      gap: "0.5rem",
      alignItems: "center",
    }}
  >
    📍 <span>Near me</span>
  </button>

  <div style={{ flex: 1 }} />

  <button
    onClick={() => {
      setSelectedShop(null);
      setView("barber");
    }}
    style={{
      padding: "0.55rem 1rem",
      backgroundColor: THEME.secondary,
      color: THEME.text,
      border: `1px solid ${THEME.border}`,
      borderRadius: "999px",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "0.85rem",
      display: "flex",
      gap: "0.5rem",
      alignItems: "center",
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
      padding: "0.55rem 1rem",
      backgroundColor: THEME.secondary,
      color: THEME.text,
      border: `1px solid ${THEME.border}`,
      borderRadius: "999px",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "0.85rem",
      display: "flex",
      gap: "0.5rem",
      alignItems: "center",
    }}
  >
    📅 My bookings
  </button>
</div>

          {/* Search row */}
          <div
            style={{
         display: "grid",
    gridTemplateColumns: "1fr",
    gap: "0.9rem",
    marginBottom: "1.1rem",
    padding: "1rem",
    borderRadius: "16px",
    backgroundColor: THEME.surface2,
    border: `1px solid ${THEME.border}`,
  }}
          >
            <div>
              <label>
                Search by area or postcode:{" "}
                <input
         value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="e.g. SW1A or Manchester"
  style={{
    padding: "0.65rem 0.8rem",
    borderRadius: "12px",
    border: `1px solid ${THEME.border}`,
    backgroundColor: "rgba(255,255,255,0.06)",
    color: THEME.text,
    outline: "none",
    minWidth: 260,
  }}
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
    padding: "0.65rem 0.8rem",
    borderRadius: "12px",
    border: `1px solid ${THEME.border}`,
    backgroundColor: "rgba(255,255,255,0.06)",
    color: THEME.text,
    outline: "none",
    minWidth: 200,
    marginRight: "0.6rem",
  }}
/>
              </label>
              <button
        onClick={searchByPostcode}
  style={{
    padding: "0.7rem 1.1rem",
    background: `linear-gradient(180deg, ${THEME.primary}, ${THEME.primaryHover})`,
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: "0.9rem",
    boxShadow: "0 10px 22px rgba(14,165,164,0.18)",
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
  borderRadius: "18px",
  backgroundColor: THEME.surface,
  border: `1px solid ${THEME.border}`,
  boxShadow: "0 18px 35px rgba(0,0,0,0.35)",
  marginBottom: "0.9rem",
  alignItems: "center",
  cursor: "pointer",
                }}
              >
  {/* Avatar / image box */}
<div
  style={{
    width: "92px",
    height: "92px",
    borderRadius: "16px",
    backgroundColor: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
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
        borderRadius: "14px",
        filter: "saturate(1.05) contrast(1.05)",
      }}
    />
  ) : (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,0.75)",
        fontWeight: 800,
        fontSize: "0.8rem",
        textAlign: "center",
        padding: "0.6rem",
        background:
          "linear-gradient(135deg, rgba(45,212,191,0.22), rgba(56,189,248,0.10))",
      }}
    >
      {shop.name}
    </div>
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
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.22rem 0.6rem",
    borderRadius: "999px",
    backgroundColor: "rgba(45, 212, 191, 0.14)", // teal tint
    color: "#99f6e4", // teal-200
    border: "1px solid rgba(45, 212, 191, 0.28)",
    fontSize: "0.78rem",
    fontWeight: 700,
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
