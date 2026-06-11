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
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
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

// Use /shops as the main clean route.
// Your backend /barbers alias is just a safety net now.
const BACKEND_URL = `${API_BASE}/barbers`;
const BACKEND_NEAR_URL = `${API_BASE}/barbers/near`;

const THEME = {
  bodyBg: "#000000",
  bg: "#050505",
  panel: "rgba(255,255,255,0.03)",
  panelStrong: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.15)",
  textMain: "#ffffff",
  textSoft: "#a1a1aa",
  textMuted: "#71717a",
  silent: "#5eead4", // Teal
  silentGradient: "linear-gradient(135deg, #5eead4 0%, #0ea5e9 100%)",
  gold: "#eab308", // Bright Gold
  goldGradient: "linear-gradient(135deg, #facc15 0%, #ca8a04 100%)",
  danger: "#ef4444",
};

export default function App() {
  const [view, setView] = useState<View>("home");
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [postcode, setPostcode] = useState("");
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
  const [showRosterOnly, setShowRosterOnly] = useState(false);

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("trimmute_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavs = prev.includes(id)
        ? prev.filter((fav) => fav !== id)
        : [...prev, id];

      localStorage.setItem("trimmute_favorites", JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const mapShop = (b: any, index: number): Shop => {
    const patchedUrl = b.externalUrl ?? b.external_url ?? "";
    const patchedPrice = Number(b.basePrice ?? b.base_price_pence ?? 2000);
    const patchedIsPartner = Boolean(b.isPartner ?? b.is_partner ?? false);
    const patchedImageUrl =
      typeof b.imageUrl === "string"
        ? b.imageUrl
        : typeof b.image_url === "string"
        ? b.image_url
        : null;
    const patchedSupportsSilent = Boolean(
      b.supportsSilent ?? b.supports_silent ?? true
    );

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
      deal: b.deal ?? undefined,
      distance: typeof b.distance === "number" ? b.distance : undefined,
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
    loadShops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleShops = [...shops]
    .filter((shop) => {
      const query = searchTerm.toLowerCase();

      const matchesSearch =
        shop.name.toLowerCase().includes(query) ||
        (shop.address && shop.address.toLowerCase().includes(query));

      const matchesPrice = shop.basePrice / 100 <= maxPrice;
      const matchesRoster = showRosterOnly
        ? favorites.includes(shop.id)
        : true;

      return matchesSearch && matchesPrice && matchesRoster;
    })
    .sort((a, b) => {
      if (sortBy === "price_low") return a.basePrice - b.basePrice;

      if (
        sortBy === "distance" &&
        a.distance !== undefined &&
        b.distance !== undefined
      ) {
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

  return (
    <div className="tm-shell">
      <style>{trimmuteStyles}</style>

      <div className="tm-bg-orb tm-bg-orb-one" />
      <div className="tm-bg-orb tm-bg-orb-two" />

      <div className="tm-app">
        <div className="tm-auth">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="tm-signin-btn">Sign In</button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        <div className="tm-inner">
          <header className="tm-hero">
            <div className="tm-logo-wrap">
              <img src={logo} alt="Trimmute" className="tm-logo" />
              <div className="tm-tagline">Silence speaks volumes</div>
            </div>

            <div className="tm-hero-copy">
              <div className="tm-eyebrow">
                <span className="tm-pulse-dot" />
                Canterbury Live Now
              </div>

              <h1>
                Book the cut.
                <br />
                <span className="tm-text-gradient">Skip the chat.</span>
              </h1>

              <p>
                Find quiet-friendly barbers before you book. Verified local
                shops, calmer appointments, zero awkward small talk.
              </p>
            </div>
          </header>

          {showBarberMode && <BarberMode onBack={() => setView("home")} />}

          {showDetail && selectedShop && (
            <BarberDetail
              shop={selectedShop}
              onBack={() => {
                setSelectedShop(null);
                setView("home");
              }}
            />
          )}

          {showBookings && <MyBookings onBack={() => setView("home")} />}

          {showHome && !showDetail && !showBookings && (
            <>
              <section className="tm-control-panel">
                <nav className="tm-nav">
                  <NavButton
                    icon="MapPin"
                    label="Near Me"
                    active={!showRosterOnly}
                    onClick={() => {
                      setShowRosterOnly(false);
                      setSelectedShop(null);
                      setView("home");
                      loadShopsNearMe();
                    }}
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
                </nav>

                <div className="tm-search-heading">
                  <h2>
                    Find your <span className="tm-text-gradient">quiet place.</span>
                  </h2>
                </div>

                <div className="tm-search-bar">
                  <div className="tm-input-group">
                    <span className="tm-input-icon">🔍</span>
                    <input
                      placeholder="Area or shop..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="tm-divider" />

                  <div className="tm-input-group tm-postcode-group">
                    <span className="tm-input-icon">📍</span>
                    <input
                      className="tm-postcode-input"
                      placeholder="Postcode"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") searchByPostcode();
                      }}
                    />
                  </div>

                  <button className="tm-go-btn" onClick={searchByPostcode}>
                    Search
                  </button>
                </div>

                <div className="tm-filters">
                  <div className="tm-filter-block">
                    <label>
                      <span>Max Price: <strong className="tm-price-text">£{maxPrice}</strong></span>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="1"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />
                  </div>

                  <div className="tm-filter-block">
                    <label>
                      <span>Sort By</span>
                    </label>
                    <div className="tm-select-wrapper">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="recommended">Recommended</option>
                        <option value="price_low">Lowest Price</option>
                        <option value="distance">Closest to Me</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="tm-micro-stats">
                  <span><strong>{visibleShops.length}</strong> spots visible</span>
                  <span className="tm-stat-verified">
                    <strong>{shops.filter((shop) => shop.isPartner).length}</strong> verified partners
                  </span>
                  <span><strong>{favorites.length}</strong> saved to roster</span>
                </div>
              </section>

              {loading && (
                <div className="tm-status-card tm-loading-card">
                  <div className="tm-spinner"></div>
                  Finding quiet-friendly shops…
                </div>
              )}

              {error && <div className="tm-status-card tm-error-card">⚠️ {error}</div>}

              {!loading && !error && visibleShops.length === 0 && (
                <div className="tm-status-card tm-empty-card">
                  {showRosterOnly
                    ? "Your roster is empty. Tap a heart to save a barber."
                    : "No locations found matching your search."}
                </div>
              )}

              {showMap ? (
                <MapView
                  visibleShops={visibleShops}
                  userLoc={userLoc}
                  onSelectShop={(shop) => {
                    setSelectedShop(shop);
                    setView("detail");
                  }}
                />
              ) : (
                <section className="tm-results">
                  <div className="tm-results-topline">
                    <span>{showRosterOnly ? "Your Roster" : "Live Directory"}</span>
                  </div>

                  <div className="tm-card-list">
                    {visibleShops.map((shop) => (
                      <ShopCard
                        key={shop.id}
                        shop={shop}
                        isFavorited={favorites.includes(shop.id)}
                        onFavorite={() => toggleFavorite(shop.id)}
                        onClick={() => {
                          setSelectedShop(shop);
                          setView("detail");
                        }}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const MapView = ({
  visibleShops,
  userLoc,
  onSelectShop,
}: {
  visibleShops: Shop[];
  userLoc: [number, number] | null;
  onSelectShop: (shop: Shop) => void;
}) => {
  return (
    <div className="tm-map-wrap">
      <MapContainer
        center={userLoc || [51.28, 1.08]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />

        {userLoc && (
          <Marker position={userLoc} icon={userPin}>
            <Popup>
              <strong style={{ color: "#000", fontSize: "14px", fontFamily: "sans-serif" }}>
                You are here
              </strong>
            </Popup>
          </Marker>
        )}

        {visibleShops.map((shop) => {
          if (!shop.lat || !shop.lng) return null;

          return (
            <Marker
              key={shop.id}
              position={[shop.lat, shop.lng]}
              icon={shop.isPartner ? goldPin : cyanPin}
            >
              <Popup>
                <div style={{ textAlign: "center", fontFamily: "sans-serif", minWidth: "150px" }}>
                  <strong style={{ color: "#000", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                    {shop.isPartner && <span>⭐</span>} {shop.name}
                  </strong>

                  {shop.isPartner && (
                    <div style={{
                      marginTop: "6px", marginBottom: "8px", fontSize: "11px", fontWeight: "bold",
                      color: "#000", background: THEME.goldGradient, padding: "3px 8px",
                      borderRadius: "6px", display: "inline-block"
                    }}>
                      ★ Verified
                    </div>
                  )}

                  <div style={{ color: "#555", fontSize: "12px", marginTop: "4px", marginBottom: "8px" }}>
                    {shop.address}
                  </div>

                  <button
                    onClick={() => {
                      if (shop.isPartner) onSelectShop(shop);
                      else if (shop.externalUrl) {
                        window.open(shop.externalUrl, "_blank", "noopener,noreferrer");
                      }
                    }}
                    style={{
                      background: shop.isPartner ? "#000" : THEME.silent,
                      color: shop.isPartner ? THEME.gold : "#000",
                      border: "none", padding: "8px 10px", borderRadius: "8px",
                      fontWeight: "bold", cursor: "pointer", width: "100%", fontSize: "12px"
                    }}
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
  );
};

// ... Keep existing Pins and Icons identical to original ...
const cyanPin = L.divIcon({
  className: "custom-cyan-pin",
  html: `<svg width="28" height="28" viewBox="0 0 24 24" fill="${THEME.silent}" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#000"></circle></svg>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

const goldPin = L.divIcon({
  className: "custom-gold-pin",
  html: `<svg width="32" height="32" viewBox="0 0 24 24" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <defs><linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fef08a" /><stop offset="50%" stop-color="#eab308" /><stop offset="100%" stop-color="#a16207" /></linearGradient></defs>
          <path fill="url(#goldGradient)" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#000"></circle>
        </svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const userPin = L.divIcon({
  className: "custom-user-pin",
  html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" stroke="${THEME.silent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"></circle></svg>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const Icons: any = {
  MapFold: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  ),
  List: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  MapPin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Scissors: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  ),
};

const NavButton = ({ icon, label, onClick, active }: any) => (
  <button onClick={onClick} className={`tm-nav-btn ${active ? "active" : ""}`}>
    <span>{Icons[icon]}</span>
    {label && <span>{label}</span>}
  </button>
);

const ShopCard = ({
  shop,
  onClick,
  isFavorited,
  onFavorite,
}: {
  shop: Shop;
  onClick: () => void;
  isFavorited: boolean;
  onFavorite: () => void;
}) => {
  const hasDistance = typeof shop.distance === "number" && !Number.isNaN(shop.distance);

  const handleCardClick = () => {
    if (shop.isPartner) {
      onClick();
    } else if (shop.externalUrl) {
      window.open(shop.externalUrl, "_blank", "noopener,noreferrer");
    }
  };

  const price = `£${(shop.basePrice / 100).toFixed(2).replace(/\.00$/, "")}`;

  return (
    <article onClick={handleCardClick} className={`tm-shop-card ${shop.isPartner ? "partner" : ""}`}>
      {shop.isPartner && <div className="tm-shop-glow" />}

      <div className="tm-shop-image-wrap">
        {shop.imageUrl ? (
          <img src={shop.imageUrl} alt={shop.name} className="tm-shop-image" />
        ) : (
          <div className="tm-shop-placeholder">✂️</div>
        )}
      </div>

      <div className="tm-shop-content">
        <div className="tm-shop-header">
          <div className="tm-shop-title">
            <h3>{shop.name}</h3>
            <p>{shop.address}</p>
          </div>
          <div className="tm-shop-price-tag">{price}</div>
        </div>

        {hasDistance && (
          <div className="tm-distance-badge">
            <span>📍</span> {shop.distance?.toFixed(1)} miles
          </div>
        )}

        {(shop as any).deal && (
          <div className="tm-deal-badge">
            <span>💳</span> {(shop as any).deal}
          </div>
        )}

        {!shop.isPartner && (
          <div className="tm-community-note">
            <strong>Community Listing:</strong> Request “Silent Cut” in booking notes.
          </div>
        )}

        <div className="tm-card-footer">
          <div className="tm-badges">
            {shop.supportsSilent && (
              <span className="tm-badge tm-badge-silent">
                SILENT CUT
              </span>
            )}
            {shop.isPartner && (
              <span className="tm-badge tm-badge-verified">
                ★ VERIFIED
              </span>
            )}
          </div>

          <div className="tm-actions">
            <button
              className={`tm-heart-btn ${isFavorited ? "saved" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
            >
              {isFavorited ? "❤️" : "🤍"}
            </button>
            <span className="tm-card-arrow">{shop.isPartner ? "→" : "↗"}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

const trimmuteStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  * {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
  }

  html, body {
    margin: 0;
    background: ${THEME.bodyBg};
  }

  .tm-shell {
    min-height: 100vh;
    width: 100%;
    color: ${THEME.textMain};
    background-color: ${THEME.bodyBg};
    display: flex;
    justify-content: center;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  /* Animated Ambient Glows */
  .tm-bg-orb {
    position: fixed;
    width: 50vw;
    height: 50vw;
    max-width: 600px;
    max-height: 600px;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.15;
    pointer-events: none;
    z-index: 0;
  }

  .tm-bg-orb-one {
    background: ${THEME.silent};
    top: -10%;
    left: -10%;
    animation: float 10s ease-in-out infinite alternate;
  }

  .tm-bg-orb-two {
    background: ${THEME.gold};
    bottom: -10%;
    right: -10%;
    animation: float 12s ease-in-out infinite alternate-reverse;
  }

  @keyframes float {
    0% { transform: translateY(0px) scale(1); }
    100% { transform: translateY(30px) scale(1.05); }
  }

  .tm-app {
    width: 100%;
    max-width: 800px; /* Tighter width for modern startup feel */
    min-height: 100vh;
    position: relative;
    z-index: 1;
  }

  .tm-inner {
    padding: 2rem;
    padding-top: 5rem;
  }

  /* AUTH BUTTON */
  .tm-auth {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    z-index: 50;
  }

  .tm-signin-btn {
    padding: 0.6rem 1.2rem;
    border-radius: 99px;
    background: ${THEME.panelStrong};
    color: #fff;
    border: 1px solid ${THEME.border};
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: all 0.2s;
  }
  .tm-signin-btn:hover {
    background: #fff;
    color: #000;
  }

  /* HERO SECTION */
  .tm-hero {
    margin-bottom: 2.5rem;
  }

  .tm-logo-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 2rem;
  }

  .tm-logo {
    height: 38px;
    filter: brightness(0) invert(1);
    margin-bottom: 0.5rem;
  }

  .tm-tagline {
    font-size: 0.75rem;
    letter-spacing: 0.2rem;
    color: ${THEME.textMuted};
    text-transform: uppercase;
    font-weight: 700;
  }

  .tm-hero-copy {
    position: relative;
  }

  .tm-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: ${THEME.silent};
    border: 1px solid rgba(94,234,212,0.3);
    background: rgba(94,234,212,0.1);
    border-radius: 99px;
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1rem;
  }

  .tm-pulse-dot {
    width: 6px;
    height: 6px;
    background: ${THEME.silent};
    border-radius: 50%;
    box-shadow: 0 0 10px ${THEME.silent};
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(94,234,212, 0.4); }
    70% { box-shadow: 0 0 0 6px rgba(94,234,212, 0); }
    100% { box-shadow: 0 0 0 0 rgba(94,234,212, 0); }
  }

  .tm-hero h1 {
    margin: 0 0 1rem;
    font-size: clamp(3rem, 8vw, 4.5rem);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -0.04em;
  }

  .tm-text-gradient {
    background: ${THEME.silentGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }

  .tm-hero p {
    margin: 0;
    max-width: 500px;
    color: ${THEME.textSoft};
    font-size: 1.1rem;
    line-height: 1.5;
    font-weight: 400;
  }

  /* CONTROL PANEL (BENTO) */
  .tm-control-panel {
    background: ${THEME.panel};
    border: 1px solid ${THEME.border};
    border-radius: 28px;
    padding: 1.5rem;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    margin-bottom: 2rem;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  }

  .tm-nav {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    background: rgba(0,0,0,0.4);
    padding: 0.4rem;
    border-radius: 16px;
    border: 1px solid ${THEME.border};
  }

  .tm-nav-btn {
    flex: 1;
    background: transparent;
    border: none;
    color: ${THEME.textMuted};
    padding: 0.8rem;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tm-nav-btn:hover {
    color: #fff;
  }

  .tm-nav-btn.active {
    background: ${THEME.panelStrong};
    color: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.1);
  }

  .tm-search-heading h2 {
    margin: 0 0 1rem;
    font-size: 1.8rem;
    font-weight: 700;
    letter-spacing: -0.03em;
  }

  /* SLEEK SEARCH BAR */
  .tm-search-bar {
    display: flex;
    background: #000;
    border: 1px solid ${THEME.borderStrong};
    border-radius: 20px;
    padding: 0.4rem;
    margin-bottom: 1.5rem;
    transition: border-color 0.2s;
  }
  .tm-search-bar:focus-within {
    border-color: ${THEME.silent};
  }

  .tm-input-group {
    display: flex;
    align-items: center;
    flex: 2;
    padding: 0 1rem;
  }

  .tm-postcode-group {
    flex: 1;
  }

  .tm-input-icon {
    font-size: 1.1rem;
    opacity: 0.5;
    margin-right: 0.5rem;
  }

  .tm-search-bar input {
    width: 100%;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1rem;
    outline: none;
    font-family: inherit;
  }
  .tm-search-bar input::placeholder {
    color: ${THEME.textMuted};
  }

  .tm-divider {
    width: 1px;
    background: ${THEME.border};
    margin: 0.5rem 0;
  }

  .tm-go-btn {
    background: ${THEME.silentGradient};
    color: #000;
    border: none;
    padding: 0 1.5rem;
    border-radius: 14px;
    font-weight: 800;
    font-size: 0.95rem;
    cursor: pointer;
    transition: transform 0.1s;
  }
  .tm-go-btn:active {
    transform: scale(0.96);
  }

  /* FILTERS */
  .tm-filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid ${THEME.border};
  }

  .tm-filter-block label {
    display: block;
    color: ${THEME.textSoft};
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 0.8rem;
  }

  .tm-price-text {
    color: ${THEME.silent};
    float: right;
  }

  input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    background: transparent;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: ${THEME.silent};
    cursor: pointer;
    margin-top: -8px;
    box-shadow: 0 0 10px rgba(94,234,212,0.5);
  }
  input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    cursor: pointer;
    background: ${THEME.borderStrong};
    border-radius: 2px;
  }

  .tm-select-wrapper select {
    width: 100%;
    appearance: none;
    background: #000;
    border: 1px solid ${THEME.borderStrong};
    color: #fff;
    padding: 0.8rem 1rem;
    border-radius: 14px;
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 500;
    outline: none;
  }

  .tm-micro-stats {
    display: flex;
    gap: 0.5rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }

  .tm-micro-stats span {
    background: #000;
    border: 1px solid ${THEME.border};
    padding: 0.4rem 0.8rem;
    border-radius: 99px;
    font-size: 0.75rem;
    color: ${THEME.textMuted};
  }
  .tm-micro-stats strong {
    color: #fff;
  }
  .tm-stat-verified strong {
    color: ${THEME.gold};
  }

  /* STATE CARDS */
  .tm-status-card {
    background: ${THEME.panel};
    border: 1px solid ${THEME.border};
    border-radius: 24px;
    padding: 2rem;
    text-align: center;
    color: ${THEME.textSoft};
    font-weight: 500;
    margin-top: 1rem;
  }

  .tm-loading-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .tm-spinner {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(94,234,212,0.2);
    border-top-color: ${THEME.silent};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes spin { 100% { transform: rotate(360deg); } }

  /* CARDS LIST */
  .tm-results-topline {
    font-size: 0.85rem;
    font-weight: 800;
    color: ${THEME.textSoft};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 1rem;
    padding-left: 0.5rem;
  }

  .tm-card-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* PREMIUM SHOP CARD */
  .tm-shop-card {
    background: ${THEME.panel};
    border: 1px solid ${THEME.border};
    border-radius: 24px;
    padding: 1.25rem;
    display: flex;
    gap: 1.25rem;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(12px);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .tm-shop-card:hover {
    transform: translateY(-2px) scale(1.01);
    border-color: ${THEME.borderStrong};
    background: ${THEME.panelStrong};
  }

  .tm-shop-card.partner {
    border-color: rgba(234,179,8,0.3);
    background: linear-gradient(180deg, rgba(234,179,8,0.05) 0%, rgba(0,0,0,0) 100%);
  }
  .tm-shop-card.partner:hover {
    border-color: rgba(234,179,8,0.6);
  }

  .tm-shop-glow {
    position: absolute;
    top: -50px;
    right: -50px;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(234,179,8,0.15) 0%, rgba(0,0,0,0) 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .tm-shop-image-wrap {
    flex-shrink: 0;
  }

  .tm-shop-image {
    width: 88px;
    height: 88px;
    border-radius: 18px;
    object-fit: cover;
    box-shadow: 0 8px 20px rgba(0,0,0,0.5);
  }

  .tm-shop-placeholder {
    width: 88px;
    height: 88px;
    border-radius: 18px;
    background: #111;
    border: 1px solid ${THEME.borderStrong};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }

  .tm-shop-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .tm-shop-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.25rem;
  }

  .tm-shop-title h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tm-shop-title p {
    margin: 0.2rem 0 0;
    font-size: 0.85rem;
    color: ${THEME.textMuted};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tm-shop-price-tag {
    font-size: 1.1rem;
    font-weight: 900;
    color: #fff;
    background: rgba(255,255,255,0.1);
    padding: 0.3rem 0.6rem;
    border-radius: 10px;
  }

  .tm-distance-badge {
    font-size: 0.8rem;
    color: ${THEME.textSoft};
    margin-top: 0.4rem;
    font-weight: 600;
  }

  .tm-community-note {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: ${THEME.textSoft};
    background: rgba(255,255,255,0.05);
    padding: 0.4rem 0.6rem;
    border-radius: 8px;
    border-left: 2px solid ${THEME.textMuted};
  }

  .tm-card-footer {
    margin-top: auto;
    padding-top: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .tm-badges {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .tm-badge {
    font-size: 0.7rem;
    font-weight: 900;
    padding: 0.3rem 0.6rem;
    border-radius: 8px;
    letter-spacing: 0.05em;
  }

  .tm-badge-silent {
    background: ${THEME.silent};
    color: #000;
  }

  .tm-badge-verified {
    background: ${THEME.gold};
    color: #000;
  }

  .tm-actions {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .tm-heart-btn {
    background: none;
    border: none;
    font-size: 1.4rem;
    cursor: pointer;
    padding: 0;
    transition: transform 0.2s;
  }
  .tm-heart-btn:hover {
    transform: scale(1.2);
  }

  .tm-card-arrow {
    background: #fff;
    color: #000;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 1.1rem;
  }

  .tm-shop-card.partner .tm-card-arrow {
    background: ${THEME.goldGradient};
  }

  .tm-map-wrap {
    height: 500px;
    border-radius: 28px;
    overflow: hidden;
    border: 1px solid ${THEME.borderStrong};
  }

  /* MOBILE RESPONSIVENESS */
  @media (max-width: 640px) {
    .tm-inner {
      padding: 1rem;
      padding-top: 4.5rem;
    }

    .tm-hero {
      margin-bottom: 2rem;
    }

    .tm-logo-wrap {
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .tm-hero-copy {
      text-align: center;
    }

    .tm-hero h1 {
      font-size: 2.8rem;
    }

    .tm-hero p {
      margin: 0 auto;
      font-size: 1rem;
    }

    .tm-control-panel {
      padding: 1.25rem;
      border-radius: 24px;
    }

    /* Stack search bar on mobile */
    .tm-search-bar {
      flex-direction: column;
      background: transparent;
      border: none;
      padding: 0;
      gap: 0.5rem;
    }

    .tm-input-group {
      background: #000;
      border: 1px solid ${THEME.borderStrong};
      border-radius: 16px;
      padding: 0.8rem 1rem;
    }

    .tm-divider {
      display: none;
    }

    .tm-go-btn {
      padding: 1rem;
      border-radius: 16px;
      width: 100%;
    }

    .tm-filters {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .tm-micro-stats {
      display: none; /* Clean up mobile UI */
    }

    .tm-shop-card {
      padding: 1rem;
      gap: 1rem;
      border-radius: 20px;
    }

    .tm-shop-image, .tm-shop-placeholder {
      width: 72px;
      height: 72px;
      border-radius: 14px;
    }

    .tm-shop-title h3 {
      font-size: 1.1rem;
    }

    .tm-shop-price-tag {
      font-size: 1rem;
    }
  }
`;