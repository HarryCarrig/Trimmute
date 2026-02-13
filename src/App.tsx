import React, { useState, useEffect } from "react";
import BarberMode from "./BarberMode";
import BarberDetail from "./BarberDetail";
import MyBookings from "./mybookings";
import logo from "./assets/trimmute-logo.png";

type Shop = {
  id: string;
  name: string;
  address: string;
  imageUrl: string | null;
  supportsSilent: boolean;
  basePrice: number;
  styles: string[];
  distanceKm?: number;
  postcode?: string;
  lat?: number;
  lng?: number;
};

type View = "home" | "barber" | "detail" | "bookings";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://trimmute.onrender.com";

// 🎨 THEME UPDATE: SEAMLESS MIDNIGHT
const THEME = {
  bodyBg: "#000000",              // <--- CHANGED: Outer bg is now pure black to match
  bg: "#000000",                  // Inner bg
  
  glass: "rgba(20, 20, 20, 0.7)", 
  glassHover: "rgba(40, 40, 40, 0.9)",
  
  border: "rgba(255, 255, 255, 0.12)", 
  borderHighlight: "rgba(255, 255, 255, 0.3)", 

  textMain: "#ffffff",
  textMuted: "#737373",           
  
  silent: "#5eead4",              
  silentBg: "rgba(94, 234, 212, 0.1)",
  
  actionBg: "#ffffff",
  actionText: "#000000",
  
  danger: "#ef4444",
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
  const [demoMode, setDemoMode] = useState(false);

  // --- LOGIC (UNCHANGED) ---
  const mapShop = (b: any, index: number): Shop => ({
    id: String(b.id ?? index),
    name: String(b.name ?? ""),
    address: b.address ?? "Unknown area",
    // Force Silent Snips to have NO image so it uses the ✂️ icon
    imageUrl: b.name === "Silent Snips" 
      ? null 
      : (typeof b.imageUrl === "string" && b.imageUrl.trim() ? b.imageUrl : null),
    supportsSilent: Boolean(b.supportsSilent),
    basePrice: Number(b.basePrice ?? 2000),
    styles: Array.isArray(b.styles) ? b.styles : [],
    distanceKm: typeof b.distanceKm === "number" ? b.distanceKm : undefined,
    postcode: b.postcode ?? undefined,
    lat: typeof b.lat === "number" ? b.lat : undefined,
    lng: typeof b.lng === "number" ? b.lng : undefined,
  });

  async function loadShops() {
    try {
      setError("");
      setLoading(true);
      const res = await fetch(BACKEND_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw: any[] = await res.json();
      setShops(raw.map(mapShop));
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
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw: any[] = await res.json();
      setShops(raw.map(mapShop));
      setView("home");
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
        if (geoError.code === 1) setError("Location permission denied.");
        else setError("Could not get your location.");
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

 // 1. THE SECRET KEY CHECK 🕵️‍♂️
  const urlParams = new URLSearchParams(window.location.search);
  const isFriendMode = urlParams.get("mode") === "friend";

// 2. THE GHOST SHOP (Fella Mode) 🧢

const friendShop = {
  id: 99,
  name: "Fella (Canterbury)",
  address: "19 The Borough, Canterbury CT1 2DR", // Corrected number
  postcode: "CT1 2DR",
  bookingUrl: "https://getsquire.com/discover/barbershop/fella-canterbury-canterbury",
  lat: 51.2804,
  lng: 1.0805,
  
  // 👇 UPDATED PRICE & DEAL TO MATCH SQUIRE
  price: "24.00",
  deal: "Student Cut & Finish",
  
  basePrice: 2400,
  styles: ["Skin Fade", "Little Fella", "Beard Trim"],
  silentCutAvailable: true,
  imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop",
} as any;

// 3. THE LOGIC (UPDATED FOR LAUNCH 🚀)
// We force the app to show Fella immediately.
// We merge it with any backend shops if you add more later.
const visibleShops = [friendShop];

  const showHome = view === "home";
  const showBarberMode = view === "barber";
  const showDetail = view === "detail" && selectedShop !== null;
  const showBookings = view === "bookings";

  // --- RENDER ---
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: THEME.textMain,
        backgroundColor: THEME.bodyBg,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* APP CONTAINER */}
      <div
        style={{
            width: "100%",
            maxWidth: "1000px", // Keeps content centered and readable
            minHeight: "100vh",
            background: THEME.bg,
            position: "relative",
            // <--- REMOVED: Borders and Shadow. Now it blends seamlessly.
        }}
        >
        
        {/* Subtle top light leak for atmosphere */}
        <div style={{
            position: "absolute", top: "-100px", left: "0", right: "0", height: "300px",
            background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
            pointerEvents: "none"
        }} />

        <div style={{ padding: "1.5rem", position: "relative", zIndex: 2 }}>
            
            {/* LOGO AREA */}
            <div style={{ 
            textAlign: "center", 
            marginBottom: "2.5rem",
            paddingTop: "2rem" 
            }}>
            <img
                src={logo}
                alt="Trimmute"
                style={{
                height: "36px", 
                margin: "0 auto 12px auto",
                display: "block",
                filter: "brightness(0) invert(1)", 
                opacity: 1
                }}
            />
            <div style={{
                fontSize: "0.75rem",
                color: THEME.textMuted,
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontWeight: 600
            }}>
                Silence speaks volumes
            </div>
            </div>

            {/* SUB-VIEWS */}
            {showBarberMode && <BarberMode onBack={() => setView("home")} />}
            
            {view === "detail" && selectedShop && (
            <BarberDetail
                shop={selectedShop}
                onBack={() => {
                setSelectedShop(null);
                setView("home");
                }}
            />
            )}

            {showBookings && (
            <MyBookings
                onBack={() => {
                setView("home");
                }}
            />
            )}

            {/* HOME VIEW */}
            {showHome && !showDetail && !showBookings && (
            <>
                {/* NAVIGATION - PUBLIC LAUNCH MODE 🚀 */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "2rem",
                    }}>
                      {/* Left Side: Discovery Tools (Keep these!) */}
                      <div style={{ display: "flex", gap: "0.75rem" }}>
                        <NavButton icon="MapPin" label="Near Me" active onClick={() => { setSelectedShop(null); setView("home"); loadShopsNearMe(); }} />
                        <NavButton icon="RotateCcw" onClick={() => { setSelectedShop(null); setView("home"); loadShops(); }} />
                      </div>

                      {/* Right Side: HIDDEN so students don't see Admin tools */}
                    </div>

                {/* SEARCH SECTION */}
                <div style={{
                marginBottom: "3rem",
                }}>
                    <h2 style={{ 
                        fontSize: "1.5rem", 
                        fontWeight: 300, 
                        marginBottom: "1.5rem", 
                        color: THEME.textMain,
                        letterSpacing: "-0.5px"
                    }}>
                        Find your <span style={{ color: THEME.textMuted }}>quiet place.</span>
                    </h2>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <SearchInput 
                    placeholder="Search area (e.g. Manchester)" 
                    value={searchTerm} 
                    onChange={setSearchTerm} 
                    />
                    
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                    <SearchInput 
                        placeholder="Postcode (e.g. SW1A)" 
                        value={postcode} 
                        onChange={setPostcode} 
                    />
                    {/* The GO Button */}
                    <button
                        onClick={searchByPostcode}
                        style={{
                        padding: "0 2rem",
                        borderRadius: "12px",
                        background: THEME.actionBg, // White
                        color: THEME.actionText,    // Black
                        border: "none",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontSize: "0.95rem",
                        transition: "transform 0.1s"
                        }}
                    >
                        Go
                    </button>
                    </div>
                </div>
                </div>

                {/* STATUS MESSAGES */}
                {loading && (
                <div style={{ textAlign: "center", padding: "2rem", color: THEME.textMuted }}>
                    Searching...
                </div>
                )}
                
                {error && (
                <div style={{ 
                    padding: "1rem", 
                    borderRadius: "12px", 
                    border: `1px solid ${THEME.danger}`,
                    color: THEME.danger,
                    marginBottom: "1rem",
                    fontSize: "0.9rem"
                }}>
                    {error}
                </div>
                )}

                {!loading && !error && visibleShops.length === 0 && (
                <div style={{ textAlign: "center", color: THEME.textMuted, marginTop: "2rem" }}>
                    No locations found.
                </div>
                )}

                {/* SHOP LIST */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {visibleShops.map((shop) => (
                    <ShopCard 
                    key={shop.id} 
                    shop={shop} 
                    onClick={() => { setSelectedShop(shop); setView("detail"); }} 
                    />
                ))}
                </div>
            </>
            )}
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

// Updated Icons with Gapped Reload
const Icons: any = {
    MapPin: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
    
    // 👇 CHANGED: This is now a proper "Refresh" arrow with a gap
    RotateCcw: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>,

    Calendar: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
    Scissors: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>
}

const NavButton = ({ icon, label, onClick, active }: any) => (
  <button
    onClick={onClick}
    style={{
      padding: label ? "0.6rem 1rem" : "0.6rem",
      borderRadius: "10px",
      border: `1px solid ${active ? THEME.textMain : THEME.border}`, 
      background: "transparent",
      color: active ? THEME.textMain : THEME.textMuted,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.85rem",
      fontWeight: 500,
      transition: "all 0.2s"
    }}
  >
    <span style={{ opacity: active ? 1 : 0.7 }}>{Icons[icon]}</span>
    {label && <span>{label}</span>}
  </button>
);

const SearchInput = ({ placeholder, value, onChange }: any) => (
  <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      width: "100%",
      padding: "1rem 1.2rem",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.05)",
      border: `1px solid ${THEME.border}`,
      color: THEME.textMain,
      fontSize: "0.95rem",
      outline: "none",
      transition: "border 0.2s",
      fontFamily: "inherit"
    }}
    onFocus={(e) => (e.target.style.border = `1px solid ${THEME.textMuted}`)}
    onBlur={(e) => (e.target.style.border = `1px solid ${THEME.border}`)}
  />
);

const ShopCard = ({ shop, onClick }: { shop: Shop; onClick: () => void }) => {
  const hasDistance = typeof shop.distanceKm === "number" && !Number.isNaN(shop.distanceKm);

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        padding: "1.2rem",
        borderRadius: "0px", 
        borderBottom: `1px solid ${THEME.border}`,
        cursor: "pointer",
        transition: "background 0.2s",
        position: "relative",
        alignItems: "center"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      
      {/* Image */}
      <div style={{
        width: "60px",
        height: "60px",
        borderRadius: "12px", 
        overflow: "hidden",
        flexShrink: 0,
        background: "#1a1a1a",
        marginRight: "1.2rem",
        border: `1px solid ${THEME.border}`
      }}>
        {shop.imageUrl ? (
          <img src={shop.imageUrl} alt={shop.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", color: THEME.textMuted }}>
            ✂️
          </div>
        )}
      </div>

      {/* Details */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: THEME.textMain }}>{shop.name}</h3>
          <span style={{ fontWeight: 400, color: THEME.textMain, fontSize: "0.9rem" }}>£{(shop.basePrice / 100).toFixed(0)}</span>
        </div>
        
        {(shop as any).deal && (
  <div style={{ 
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    border: "1px solid rgba(34, 197, 94, 0.5)",
    color: "#4ade80",
    fontSize: "0.7rem", 
    fontWeight: "600", 
    padding: "2px 8px", 
    borderRadius: "6px", 
    marginBottom: "0.4rem", 
    marginTop: "-0.2rem",   // Added this to tuck it close to the name
    alignSelf: "flex-start",
    whiteSpace: "nowrap"
  }}>
    <span style={{ marginRight: "4px" }}>💳</span> 
    {(shop as any).deal}
  </div>
)}
        <p style={{ margin: 0, fontSize: "0.85rem", color: THEME.textMuted, marginBottom: "0.6rem" }}>{shop.address}</p>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {shop.supportsSilent && (
                <span style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: THEME.silent,
                    background: THEME.silentBg,
                    padding: "3px 8px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    border: `1px solid ${THEME.silent}40`
                }}>
                    ● SILENT
                </span>
            )}
  
            {hasDistance && (
                <span style={{ fontSize: "0.75rem", color: THEME.textMuted }}>
                    {shop.distanceKm?.toFixed(1)} km
                </span>
            )}
        </div>
      </div>
       <div style={{color: THEME.border, marginLeft: "10px"}}>›</div>
    </div>
  );
};