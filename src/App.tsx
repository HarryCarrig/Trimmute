import React, { useState, useEffect } from "react";
import BarberMode from "./BarberMode";
import BarberDetail from "./BarberDetail";
import MyBookings from "./mybookings";
import logo from "./assets/trimmute-logo.png";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

// 🛠️ FIX FOR REACT LEAFLET MISSING ICONS
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export type Shop = {
  id: string;
  name: string;
  address: string;
  imageUrl: string | null;
  cover_url?: string | null;
  supportsSilent: boolean;
  basePrice: number;
  styles: string[];
  distanceKm?: number;
  postcode?: string;
  lat?: number;
  lng?: number;
  isPartner?: boolean;
  externalUrl?: string;
  price?: string;
  deal?: string;
  distance?: number;
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
  const [showMap, setShowMap] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(100); // Defaults to £100 max
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
  
  // 👇 FIXED: States are now properly separated
  const [showRosterOnly, setShowRosterOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("trimmute_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavs = prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id];
      localStorage.setItem("trimmute_favorites", JSON.stringify(newFavs));
      return newFavs;
    });
  };

  // --- LOGIC (UPDATED FOR DYNAMIC BACKEND) ---
  const mapShop = (b: any, index: number): Shop => {
    let patchedUrl = b.externalUrl ?? b.external_url ?? "";
    let patchedPrice = Number(b.basePrice ?? b.base_price_pence ?? 2000);
    let patchedIsPartner = Boolean(b.isPartner ?? b.is_partner ?? false);
    let patchedImageUrl = typeof b.imageUrl === "string" ? b.imageUrl : null;
    let patchedDeal = b.deal ?? undefined;
    let patchedSupportsSilent = Boolean(b.supportsSilent ?? b.supports_silent ?? true);

    return {
  id: String(b.id ?? index),
  name: String(b.name ?? ""),
  address: b.address ?? "Unknown area",
  imageUrl: patchedImageUrl,
  cover_url: b.cover_url ?? null,
  supportsSilent: patchedSupportsSilent,
  basePrice: patchedPrice,
  styles: Array.isArray(b.styles) ? b.styles : [],
  distanceKm: typeof b.distanceKm === "number" ? b.distanceKm : undefined,
  postcode: b.postcode ?? undefined,
  lat: typeof b.lat === "number" ? b.lat : undefined,
  lng: typeof b.lng === "number" ? b.lng : undefined,
  isPartner: patchedIsPartner,
  externalUrl: patchedUrl,
  deal: patchedDeal,
  distance: b.distance,
};
  };

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
      setUserLoc([latitude, longitude]);
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

  const urlParams = new URLSearchParams(window.location.search);
  const isFriendMode = urlParams.get("mode") === "friend";

  // 👇 FIXED: The filter array is properly chained again
  const visibleShops = [...shops]
    .filter(shop => {
      const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (shop.address && shop.address.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesPrice = (shop.basePrice / 100) <= maxPrice;
      
      // Roster Gate
      const matchesRoster = showRosterOnly ? favorites.includes(shop.id) : true;
      
      return matchesSearch && matchesPrice && matchesRoster;
    })
    .sort((a, b) => {
      if (sortBy === "price_low") return a.basePrice - b.basePrice;
      if (sortBy === "distance" && a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;        
      }
      if (a.isPartner && !b.isPartner) return -1;                                                                  
      if (!a.isPartner && b.isPartner) return 1;
      return 0; 
    });

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
            maxWidth: "1000px", 
            minHeight: "100vh",
            background: THEME.bg,
            position: "relative",
        }}
        >
        {/* 👇 AUTHENTICATION CORNER 👇 */}
        <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", zIndex: 50 }}>
          <SignedOut>
            <SignInButton mode="modal">
              <button style={{ 
                padding: "0.5rem 1.2rem", 
                borderRadius: "8px", 
                background: THEME.silent, 
                color: THEME.bg, 
                border: "none", 
                fontWeight: "bold", 
                cursor: "pointer",
                fontSize: "0.9rem"
              }}>
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
        
        {/* Subtle top light leak for atmosphere */}
        <div style={{
            position: "absolute", top: "-100px", left: "0", right: "0", height: "300px",
            background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
            pointerEvents: "none"
        }} />

        <div style={{ padding: "1.5rem", position: "relative", zIndex: 2 }}>
            
            {/* LOGO AREA */}
            <div style={{ textAlign: "center", marginBottom: "2.5rem", paddingTop: "2rem" }}>
              <img
                  src={logo}
                  alt="Trimmute"
                  style={{ height: "36px", margin: "0 auto 12px auto", display: "block", filter: "brightness(0) invert(1)", opacity: 1 }}
              />
              <div style={{ fontSize: "0.75rem", color: THEME.textMuted, letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 }}>
                  Silence speaks volumes
              </div>
            </div>

            {/* SUB-VIEWS */}
            {showBarberMode && <BarberMode onBack={() => setView("home")} />}
            
            {view === "detail" && selectedShop && (
              <BarberDetail shop={selectedShop} onBack={() => { setSelectedShop(null); setView("home"); }} />
            )}

            {showBookings && (
              <MyBookings onBack={() => { setView("home"); }} />
            )}

            {/* HOME VIEW */}
            {showHome && !showDetail && !showBookings && (
            <>
                {/* NAVIGATION */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <NavButton 
                      icon="MapPin" 
                      label="Near Me" 
                      active={!showRosterOnly} 
                      onClick={() => { setShowRosterOnly(false); setSelectedShop(null); setView("home"); loadShopsNearMe(); }} 
                    />
                    
                    <NavButton 
                      icon="Scissors" 
                      label={showRosterOnly ? "Show All" : "My Roster"} 
                      active={showRosterOnly}
                      onClick={() => setShowRosterOnly(!showRosterOnly)} 
                    />

                    <NavButton 
                      icon={showMap ? "List" : "MapFold"} 
                      label={showMap ? "List" : "Map"} 
                      onClick={() => setShowMap(!showMap)} 
                      active={showMap} 
                    />
                  </div>
                </div>

                {/* SEARCH SECTION */}
                <div style={{ marginBottom: "3rem" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 300, marginBottom: "1.5rem", color: THEME.textMain, letterSpacing: "-0.5px" }}>
                        Find your <span style={{ color: THEME.textMuted }}>quiet place.</span>
                    </h2>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.5rem" }}>
                  
                  <div style={{ display: "flex", alignItems: "stretch", background: "rgba(255, 255, 255, 0.05)", borderRadius: "14px", border: `1px solid ${THEME.border}`, overflow: "hidden" }}>
                    <input 
                      placeholder="Area or Shop..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ flex: 1, padding: "0.875rem 1rem", background: "transparent", border: "none", color: THEME.textMain, outline: "none", fontSize: "0.95rem", minWidth: "50px" }}
                    />
                    <div style={{ width: "1px", background: THEME.border, margin: "0.6rem 0" }} />
                    <input 
                      placeholder="Postcode..." 
                      value={postcode} 
                      onChange={(e) => setPostcode(e.target.value)}
                      style={{ width: "100px", padding: "0.875rem 1rem", background: "transparent", border: "none", color: THEME.textMain, outline: "none", fontSize: "0.95rem" }}
                    />
                    <button 
                      onClick={searchByPostcode}
                      style={{ padding: "0 1.2rem", background: THEME.textMain, color: THEME.bg, border: "none", fontWeight: "bold", cursor: "pointer" }}
                    >
                      Go
                    </button>
                  </div>

                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ flex: 1, minWidth: "150px" }}>
                      <label style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: THEME.textMuted, marginBottom: "0.5rem" }}>
                        <span>Max Price</span>
                        <span style={{ color: THEME.silent, fontWeight: "bold" }}>£{maxPrice}</span>
                      </label>
                      <input 
                        type="range" min="10" max="100" step="1" 
                        value={maxPrice} 
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        style={{ width: "100%", accentColor: THEME.silent }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: "150px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", color: THEME.textMuted, marginBottom: "0.5rem" }}>
                        Sort By
                      </label>
                      <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", background: "transparent", color: THEME.textMain, border: `1px solid ${THEME.border}`, outline: "none" }}
                      >
                        <option value="recommended" style={{ background: THEME.bodyBg }}>Recommended</option>
                        <option value="price_low" style={{ background: THEME.bodyBg }}>Lowest Price</option>
                        <option value="distance" style={{ background: THEME.bodyBg }}>Closest to Me</option>
                      </select>
                    </div>
                  </div>
                </div>
                </div>

                {/* STATUS MESSAGES */}
                {loading && <div style={{ textAlign: "center", padding: "2rem", color: THEME.textMuted }}>Searching...</div>}
                
                {error && (
                  <div style={{ padding: "1rem", borderRadius: "12px", border: `1px solid ${THEME.danger}`, color: THEME.danger, marginBottom: "1rem", fontSize: "0.9rem" }}>
                      {error}
                  </div>
                )}

                {!loading && !error && visibleShops.length === 0 && (
                  <div style={{ textAlign: "center", color: THEME.textMuted, marginTop: "2rem" }}>
                      {showRosterOnly ? "Your roster is empty! Heart some barbers to save them here." : "No locations found."}
                  </div>
                )}

                {/* MAP OR LIST VIEW */}
                {showMap ? (
                  <div style={{ height: "450px", width: "100%", borderRadius: "12px", overflow: "hidden", border: `1px solid ${THEME.border}`, zIndex: 0 }}>
                    <MapContainer center={userLoc || [51.28, 1.08]} zoom={13} style={{ height: "100%", width: "100%" }}>
                      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
                      {userLoc && (
                        <Marker position={userLoc} icon={userPin}>
                          <Popup><strong style={{ color: "#000", fontSize: "14px", fontFamily: "sans-serif" }}>You Are Here</strong></Popup>
                        </Marker>
                      )}
                      {visibleShops.map(shop => {
                        if (!shop.lat || !shop.lng) return null;
                        return (
                          <Marker key={shop.id} position={[shop.lat, shop.lng]} icon={shop.isPartner ? goldPin : cyanPin}>
                            <Popup>
                              <div style={{ textAlign: "center", fontFamily: "sans-serif", minWidth: "140px" }}>
                                <strong style={{ color: "#000", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                                  {shop.isPartner && <span>⭐</span>} {shop.name}
                                </strong>
                                {shop.isPartner && (
                                  <div style={{ marginBottom: "8px", fontSize: "11px", fontWeight: "bold", color: "#b8860b", backgroundColor: "#fff8dc", padding: "3px 6px", borderRadius: "4px", display: "inline-block", border: "1px solid #FFC107" }}>
                                    ✓ Trimmute Verified
                                  </div>
                                )}
                                <div style={{ color: "#555", fontSize: "12px", marginTop: "4px", marginBottom: "8px" }}>{shop.address}</div>
                                <button
                                  onClick={() => {
                                    if (shop.isPartner) { setSelectedShop(shop); setView("detail"); } 
                                    else if (shop.externalUrl) { window.open(shop.externalUrl, "_blank", "noopener,noreferrer"); }
                                  }}
                                  style={{ background: shop.isPartner ? "#D4AF37" : THEME.silent, color: "#000", border: "none", padding: "6px 10px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", width: "100%", fontSize: "12px" }}
                                >
                                  {shop.isPartner ? "View Details" : "Book External"}
                                </button>
                              </div>
                            </Popup>
                          </Marker>
                        );
                      })}
                    </MapContainer>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {visibleShops.map((shop) => (
                      <ShopCard 
                        key={shop.id} 
                        shop={shop} 
                        isFavorited={favorites.includes(shop.id)} 
                        onFavorite={() => toggleFavorite(shop.id)}
                        onClick={() => { setSelectedShop(shop); setView("detail"); }} 
                      />
                    ))}
                  </div>
                )}
            </>
            )}
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const cyanPin = L.divIcon({
  className: "custom-cyan-pin",
  html: `<svg width="28" height="28" viewBox="0 0 24 24" fill="${THEME.silent}" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#000"></circle></svg>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28]
});

const goldPin = L.divIcon({
  className: "custom-gold-pin",
  html: `<svg width="28" height="28" viewBox="0 0 24 24" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <defs><linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FFE066" /><stop offset="50%" stop-color="#F5B700" /><stop offset="100%" stop-color="#9E7600" /></linearGradient></defs>
          <path fill="url(#goldGradient)" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#000"></circle>
        </svg>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28]
});

const userPin = L.divIcon({
  className: "custom-user-pin",
  html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" stroke="${THEME.silent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"></circle></svg>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const Icons: any = {
  MapFold: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>,
  List: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
  MapPin: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  RotateCcw: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>,
  Calendar: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  Scissors: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>
};

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

// 👇 FIXED: Added the new props so the card knows how to show the Heart!
const ShopCard = ({ shop, onClick, isFavorited, onFavorite }: { shop: Shop; onClick: () => void; isFavorited: boolean; onFavorite: () => void }) => {
  const hasDistance = typeof shop.distance === "number" && !Number.isNaN(shop.distance);

  const handleCardClick = () => {
    if (shop.isPartner) {
      onClick(); 
    } else if (shop.externalUrl) {
      window.open(shop.externalUrl, "_blank", "noopener,noreferrer"); 
    }
  };

  return (
    <div
      onClick={handleCardClick}
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
      <div style={{ width: "60px", height: "60px", borderRadius: "12px", overflow: "hidden", flexShrink: 0, background: "#1a1a1a", marginRight: "1.2rem", border: `1px solid ${THEME.border}` }}>
        {shop.imageUrl ? (
          <img src={shop.imageUrl} alt={shop.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", color: THEME.textMuted }}>✂️</div>
        )}
      </div>

      {/* Details (This is the wrapper that went missing!) */}
      <div style={{ flex: 1, minWidth: 0, width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        
        {/* 👇 The new Title, Price & Heart Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "0.75rem", marginBottom: "0.3rem" }}>
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: THEME.textMain, flex: 1, minWidth: 0 }}>{shop.name}</h3>
          
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, marginLeft: "auto" }}>
            <span style={{ fontWeight: 400, color: THEME.textMain, fontSize: "0.9rem" }}>
              £{(shop.basePrice / 100).toFixed(2).replace(/\.00$/, '')}
            </span>
            
            <button 
              onClick={(e) => {
                e.stopPropagation(); 
                onFavorite();
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.1rem",
                padding: "0", 
                display: "flex",
                color: isFavorited ? THEME.danger : THEME.textMuted,
                transition: "transform 0.1s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              {isFavorited ? "❤️" : "🤍"}
            </button>
          </div>
        </div>
        
        {(shop as any).deal && (
          <div style={{ display: "inline-flex", alignItems: "center", backgroundColor: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.5)", color: "#4ade80", fontSize: "0.7rem", fontWeight: "600", padding: "2px 8px", borderRadius: "6px", marginBottom: "0.4rem", marginTop: "-0.2rem", alignSelf: "flex-start", whiteSpace: "nowrap" }}>
            <span style={{ marginRight: "4px" }}>💳</span> {(shop as any).deal}
          </div>
        )}
        <p style={{ margin: 0, fontSize: "0.85rem", color: THEME.textMuted, marginBottom: "0.6rem" }}>{shop.address}</p>

        {hasDistance && (
          <div style={{ fontSize: "0.85rem", color: THEME.silent, fontWeight: 600, marginTop: "0.4rem" }}>
            📍 {shop.distance?.toFixed(1)} miles away
          </div>
        )}

        {!shop.isPartner && (
          <div style={{ marginBottom: "8px", padding: "6px 8px", backgroundColor: "rgba(234, 179, 8, 0.1)", border: "1px solid rgba(234, 179, 8, 0.3)", borderRadius: "6px", color: "#fde047", fontSize: "0.7rem", fontWeight: 500, lineHeight: "1.4" }}>
            ⚠️ <b>Community Listing:</b> To get a silent cut here, you MUST write "Silent Cut Please" in their booking notes!
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {shop.supportsSilent && (
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: THEME.silent, background: THEME.silentBg, padding: "3px 8px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "4px", border: `1px solid ${THEME.silent}40` }}>
                    ● SILENT
                </span>
            )}
            {shop.isPartner && (
              <span style={{ backgroundColor: "rgba(255, 193, 7, 0.15)", color: "#FFC107", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "bold" }}>
                ★ Trimmute Verified
              </span>
            )}
        </div>
      </div>
       
     {/* 👇 Added minWidth: "55px" right here! */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginLeft: "10px", minWidth: "55px" }}>
        {shop.isPartner ? (
          <div style={{color: THEME.border, fontSize: "1.5rem"}}>›</div>
        ) : (
          <>
            <div style={{color: THEME.textMain, fontSize: "0.8rem", fontWeight: 600}}>↗</div>
            <div style={{color: THEME.textMuted, fontSize: "0.6rem", marginTop: "4px", whiteSpace: "nowrap"}}>External</div>
          </>
        )}
      </div>

    </div>
  );
};