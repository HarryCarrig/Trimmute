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
  walkInsOnly?: boolean;
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
  bg: "#020202",
  panel: "rgba(255,255,255,0.045)",
  panelStrong: "rgba(255,255,255,0.075)",
  border: "rgba(255,255,255,0.12)",
  borderStrong: "rgba(255,255,255,0.22)",
  textMain: "#ffffff",
  textSoft: "#d4d4d8",
  textMuted: "#77777f",
  textFaint: "#4b4b52",
  silent: "#5eead4",
  silent2: "#2dd4bf",
  silentBg: "rgba(94, 234, 212, 0.105)",
  gold: "#d4af37",
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
      walkInsOnly: Boolean(b.walkInsOnly ?? b.walk_ins_only ?? false),
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
                Canterbury live now
              </div>

              <h1>
                Book the cut.
                <br />
                <span>Skip the chat.</span>
              </h1>

              <p>
                Find quiet-friendly barbers before you book. Verified local
                shops, calmer appointments, less awkward small talk.
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
                    Find your <span>quiet place.</span>
                  </h2>
                  <p>
                    Search by shop, area, or postcode. Save favourites to your
                    roster.
                  </p>
                </div>

                <div className="tm-search-bar">
                  <input
                    placeholder="Area or shop..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  <div className="tm-divider" />

                  <input
                    className="tm-postcode-input"
                    placeholder="Postcode..."
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") searchByPostcode();
                    }}
                  />

                  <button onClick={searchByPostcode}>Go</button>
                </div>

                <div className="tm-filters">
                  <div className="tm-filter-block">
                    <label>
                      <span>Max price</span>
                      <strong>£{maxPrice}</strong>
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
                      <span>Sort by</span>
                    </label>

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

                <div className="tm-micro-stats">
                  <span>
                    <strong>{visibleShops.length}</strong> visible shops
                  </span>
                  <span>
                    <strong>
                      {shops.filter((shop) => shop.isPartner).length}
                    </strong>{" "}
                    verified partners
                  </span>
                  <span>
                    <strong>{favorites.length}</strong> saved
                  </span>
                </div>
              </section>

              {loading && (
                <div className="tm-status-card">Finding quiet-friendly shops…</div>
              )}

              {error && <div className="tm-error-card">{error}</div>}

              {!loading && !error && visibleShops.length === 0 && (
                <div className="tm-empty-card">
                  {showRosterOnly
                    ? "Your roster is empty. Tap a heart to save a barber."
                    : "No locations found."}
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
                    <span>Quiet-friendly options</span>
                    <span>{showRosterOnly ? "Roster view" : "Live list"}</span>
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
              <strong
                style={{
                  color: "#000",
                  fontSize: "14px",
                  fontFamily: "sans-serif",
                }}
              >
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
                <div
                  style={{
                    textAlign: "center",
                    fontFamily: "sans-serif",
                    minWidth: "150px",
                  }}
                >
                  <strong
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                    }}
                  >
                    {shop.isPartner && <span>⭐</span>} {shop.name}
                  </strong>

                  {shop.isPartner && (
                    <div
                      style={{
                        marginTop: "6px",
                        marginBottom: "8px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: "#fff3b0",
                        background:
                          "linear-gradient(135deg, #2b2108 0%, #6f5413 45%, #caa84a 100%)",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        display: "inline-block",
                        border: "1px solid rgba(255, 215, 100, 0.45)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
                        letterSpacing: "0.2px",
                        textShadow: "0 1px 1px rgba(0,0,0,0.6)",
                      }}
                    >
                      ★ Verified
                    </div>
                  )}

                  <div
                    style={{
                      color: "#555",
                      fontSize: "12px",
                      marginTop: "4px",
                      marginBottom: "8px",
                    }}
                  >
                    {shop.address}
                  </div>

                  <button
                    onClick={() => {
                      if (shop.isPartner) onSelectShop(shop);
                      else if (shop.externalUrl) {
                        window.open(
                          shop.externalUrl,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }
                    }}
                    style={{
                      background: shop.isPartner ? "#D4AF37" : THEME.silent,
                      color: "#000",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      width: "100%",
                      fontSize: "12px",
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

const cyanPin = L.divIcon({
  className: "custom-cyan-pin",
  html: `<svg width="28" height="28" viewBox="0 0 24 24" fill="${THEME.silent}" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#000"></circle></svg>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

const goldPin = L.divIcon({
  className: "custom-gold-pin",
  html: `<svg width="28" height="28" viewBox="0 0 24 24" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <defs><linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FFE066" /><stop offset="50%" stop-color="#F5B700" /><stop offset="100%" stop-color="#9E7600" /></linearGradient></defs>
          <path fill="url(#goldGradient)" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#000"></circle>
        </svg>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
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
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  ),
  List: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  MapPin: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Scissors: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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
  const hasDistance =
    typeof shop.distance === "number" && !Number.isNaN(shop.distance);

  const handleCardClick = () => {
    if (shop.isPartner) {
      onClick();
    } else if (shop.externalUrl) {
      window.open(shop.externalUrl, "_blank", "noopener,noreferrer");
    }
  };

  const price = `£${(shop.basePrice / 100).toFixed(2).replace(/\.00$/, "")}`;

  return (
    <article
      onClick={handleCardClick}
      className={`tm-shop-card ${shop.isPartner ? "partner" : ""}`}
    >
      <div className="tm-shop-glow" />

      <div className="tm-shop-image">
        {shop.imageUrl ? (
          <img src={shop.imageUrl} alt={shop.name} />
        ) : (
          <span>✂️</span>
        )}
      </div>

      <div className="tm-shop-main">
        <div className="tm-shop-title-row">
          <div>
            <h3>{shop.name}</h3>
            <p>{shop.address}</p>
          </div>
        </div>

        {(shop as any).deal && (
          <div className="tm-deal-badge">
            <span>💳</span> {(shop as any).deal}
          </div>
        )}

        {hasDistance && (
          <div className="tm-distance">📍 {shop.distance?.toFixed(1)} miles away</div>
        )}

        {!shop.isPartner && (
          <div className="tm-community-note">
            ⚠️ <strong>Community Listing:</strong> request “Silent Cut Please”
            in booking notes.
          </div>
        )}

        <div className="tm-badge-row">
          {shop.supportsSilent && (
            <span className="tm-badge tm-badge-silent">
              <span className="tm-badge-dot" />
              SILENT
            </span>
          )}

          {shop.isPartner && (
            <span className="tm-badge tm-badge-verified">★ Verified</span>
          )}
        </div>
      </div>

      <div className="tm-shop-action">
        <span className="tm-price">{price}</span>

        <button
          className={`tm-heart ${isFavorited ? "saved" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onFavorite();
          }}
          aria-label={isFavorited ? "Remove from roster" : "Add to roster"}
        >
          {isFavorited ? "❤️" : "🤍"}
        </button>

        <span className="tm-chevron">{shop.isPartner ? "›" : "↗"}</span>
      </div>
    </article>
  );
};

const trimmuteStyles = `
  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    background: #000;
  }

  .tm-shell {
    min-height: 100vh;
    width: 100%;
    color: ${THEME.textMain};
    background:
      radial-gradient(circle at 50% -10%, rgba(94,234,212,0.12), transparent 32%),
      radial-gradient(circle at 90% 18%, rgba(212,175,55,0.08), transparent 24%),
      #000;
    display: flex;
    justify-content: center;
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .tm-bg-orb {
    position: fixed;
    width: 360px;
    height: 360px;
    border-radius: 999px;
    filter: blur(90px);
    opacity: 0.18;
    pointer-events: none;
  }

  .tm-bg-orb-one {
    background: ${THEME.silent};
    top: 4rem;
    left: -12rem;
  }

  .tm-bg-orb-two {
    background: ${THEME.gold};
    bottom: 8rem;
    right: -14rem;
  }

  .tm-app {
    width: 100%;
    max-width: 1040px;
    min-height: 100vh;
    position: relative;
  }

  .tm-inner {
    padding: 1.75rem;
    position: relative;
    z-index: 2;
  }

  .tm-auth {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    z-index: 50;
  }

  .tm-signin-btn {
    padding: 0.65rem 1.25rem;
    border-radius: 12px;
    background: linear-gradient(135deg, #7dded5 0%, #5eead4 100%);
    color: #00100e;
    border: 0;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 12px 34px rgba(94,234,212,0.18);
  }

  .tm-hero {
    min-height: 310px;
    display: grid;
    grid-template-columns: 0.9fr 1.1fr;
    gap: 2.25rem;
    align-items: center;
    padding: 3rem 0 2rem;
  }

  .tm-logo-wrap {
    text-align: center;
  }

 .tm-logo {
  height: 68px;
  display: block;
  margin: 0 auto 0.9rem;
  filter: brightness(0) invert(1);
}

  .tm-tagline {
    font-size: 0.78rem;
    letter-spacing: 0.26rem;
    color: ${THEME.textMuted};
    text-transform: uppercase;
    font-weight: 700;
  }

  .tm-hero-copy {
    padding: 1.25rem;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 28px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015));
    box-shadow: 0 30px 80px rgba(0,0,0,0.45);
  }

  .tm-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: ${THEME.silent};
    border: 1px solid rgba(94,234,212,0.22);
    background: rgba(94,234,212,0.075);
    border-radius: 999px;
    padding: 0.45rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.02rem;
    text-transform: uppercase;
  }

  .tm-pulse-dot {
    width: 8px;
    height: 8px;
    background: ${THEME.silent};
    border-radius: 999px;
    box-shadow: 0 0 0 6px rgba(94,234,212,0.12);
  }

  .tm-hero h1 {
    margin: 1rem 0 0.75rem;
    font-size: clamp(2.5rem, 5vw, 4.7rem);
    line-height: 0.92;
    letter-spacing: -0.08em;
  }

  .tm-hero h1 span {
    color: ${THEME.textMuted};
    font-weight: 500;
  }

  .tm-hero p {
    margin: 0;
    max-width: 520px;
    color: ${THEME.textSoft};
    line-height: 1.55;
    font-size: 1rem;
  }

  .tm-control-panel {
    border: 1px solid ${THEME.border};
    background:
      linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025));
    border-radius: 28px;
    padding: 1.25rem;
    box-shadow: 0 24px 70px rgba(0,0,0,0.42);
    backdrop-filter: blur(18px);
    margin-bottom: 1.5rem;
  }

  .tm-nav {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }

  .tm-nav-btn {
    border: 1px solid ${THEME.border};
    background: rgba(0,0,0,0.35);
    color: ${THEME.textMuted};
    border-radius: 14px;
    padding: 0.75rem 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    cursor: pointer;
    font-size: 0.88rem;
    font-weight: 700;
    transition: 0.2s ease;
  }

  .tm-nav-btn:hover {
    color: ${THEME.textMain};
    border-color: ${THEME.borderStrong};
    transform: translateY(-1px);
  }

  .tm-nav-btn.active {
    color: #fff;
    border-color: rgba(255,255,255,0.78);
    background: rgba(255,255,255,0.06);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.04) inset;
  }

  .tm-search-heading {
    margin-bottom: 1rem;
  }

  .tm-search-heading h2 {
    margin: 0;
    font-size: clamp(1.8rem, 4vw, 2.65rem);
    letter-spacing: -0.065em;
    font-weight: 600;
  }

  .tm-search-heading h2 span {
    color: ${THEME.textMuted};
    font-weight: 400;
  }

  .tm-search-heading p {
    margin: 0.35rem 0 0;
    color: ${THEME.textMuted};
    font-size: 0.92rem;
  }

  .tm-search-bar {
    display: flex;
    align-items: stretch;
    overflow: hidden;
    border: 1px solid ${THEME.border};
    border-radius: 18px;
    background: rgba(0,0,0,0.42);
  }

  .tm-search-bar input {
    background: transparent;
    border: 0;
    color: #fff;
    outline: 0;
    padding: 1rem 1rem;
    font-size: 0.98rem;
    min-width: 0;
  }

  .tm-search-bar input:first-child {
    flex: 1;
  }

  .tm-postcode-input {
    width: 130px;
  }

  .tm-search-bar input::placeholder {
    color: #8b8b94;
  }

  .tm-divider {
    width: 1px;
    background: ${THEME.border};
    margin: 0.75rem 0;
  }

  .tm-search-bar button {
    background: #fff;
    color: #000;
    border: 0;
    padding: 0 1.35rem;
    font-weight: 900;
    cursor: pointer;
  }

  .tm-filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }

  .tm-filter-block label {
    display: flex;
    justify-content: space-between;
    color: ${THEME.textMuted};
    font-size: 0.85rem;
    margin-bottom: 0.55rem;
  }

  .tm-filter-block label strong {
    color: ${THEME.silent};
  }

  .tm-filter-block input[type="range"] {
    width: 100%;
    accent-color: ${THEME.silent};
  }

  .tm-filter-block select {
    width: 100%;
    padding: 0.72rem;
    border-radius: 12px;
    border: 1px solid ${THEME.border};
    background: rgba(0,0,0,0.55);
    color: #fff;
    outline: 0;
  }

  .tm-filter-block option {
    background: #000;
    color: #fff;
  }

  .tm-micro-stats {
    display: flex;
    gap: 0.65rem;
    flex-wrap: wrap;
    margin-top: 1rem;
  }

  .tm-micro-stats span {
    border: 1px solid ${THEME.border};
    background: rgba(255,255,255,0.035);
    color: ${THEME.textMuted};
    border-radius: 999px;
    padding: 0.45rem 0.7rem;
    font-size: 0.76rem;
  }

  .tm-micro-stats strong {
    color: #fff;
  }

  .tm-status-card,
  .tm-error-card,
  .tm-empty-card {
    border-radius: 18px;
    padding: 1rem;
    margin: 1rem 0;
    border: 1px solid ${THEME.border};
    color: ${THEME.textMuted};
    background: rgba(255,255,255,0.035);
  }

  .tm-error-card {
    border-color: rgba(239,68,68,0.75);
    color: ${THEME.danger};
  }

  .tm-map-wrap {
    height: 520px;
    width: 100%;
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid ${THEME.border};
    box-shadow: 0 22px 60px rgba(0,0,0,0.38);
  }

  .tm-results {
    margin-top: 1.5rem;
  }

  .tm-results-topline {
    display: flex;
    justify-content: space-between;
    color: ${THEME.textMuted};
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.12rem;
    font-weight: 800;
    margin-bottom: 0.75rem;
  }

  .tm-card-list {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }

  .tm-shop-card {
    position: relative;
    display: grid;
    grid-template-columns: 78px 1fr auto;
    gap: 1rem;
    align-items: center;
    border: 1px solid ${THEME.border};
    background:
      linear-gradient(135deg, rgba(255,255,255,0.065), rgba(255,255,255,0.018));
    border-radius: 24px;
    padding: 1rem;
    cursor: pointer;
    overflow: hidden;
    transition: 0.22s ease;
    box-shadow: 0 18px 50px rgba(0,0,0,0.24);
  }

  .tm-shop-card:hover {
    border-color: rgba(255,255,255,0.26);
    transform: translateY(-2px);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.025));
  }

  .tm-shop-card.partner {
    border-color: rgba(212,175,55,0.26);
  }

  .tm-shop-glow {
    position: absolute;
    inset: auto auto -40px -60px;
    width: 160px;
    height: 160px;
    border-radius: 999px;
    background: rgba(94,234,212,0.07);
    filter: blur(40px);
    pointer-events: none;
  }

  .tm-shop-card.partner .tm-shop-glow {
    background: rgba(212,175,55,0.075);
  }

  .tm-shop-image {
    width: 78px;
    height: 78px;
    border-radius: 18px;
    overflow: hidden;
    background: #121212;
    border: 1px solid ${THEME.border};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${THEME.textMuted};
    font-size: 1.25rem;
    z-index: 1;
  }

  .tm-shop-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .tm-shop-main {
    min-width: 0;
    z-index: 1;
  }

  .tm-shop-title-row h3 {
    margin: 0;
    font-size: 1.12rem;
    line-height: 1.18;
    letter-spacing: -0.03em;
    color: #fff;
  }

  .tm-shop-title-row p {
    margin: 0.38rem 0 0;
    color: ${THEME.textMuted};
    font-size: 0.9rem;
    line-height: 1.38;
  }

  .tm-deal-badge {
    margin-top: 0.6rem;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: rgba(34,197,94,0.13);
    border: 1px solid rgba(34,197,94,0.38);
    color: #4ade80;
    font-size: 0.72rem;
    font-weight: 800;
    padding: 0.3rem 0.55rem;
    border-radius: 999px;
  }

  .tm-distance {
    margin-top: 0.55rem;
    color: ${THEME.silent};
    font-size: 0.82rem;
    font-weight: 800;
  }

  .tm-community-note {
    margin-top: 0.7rem;
    max-width: 560px;
    padding: 0.55rem 0.65rem;
    background: rgba(234,179,8,0.09);
    border: 1px solid rgba(234,179,8,0.25);
    border-radius: 12px;
    color: #fde047;
    font-size: 0.74rem;
    line-height: 1.35;
  }

  .tm-badge-row {
    margin-top: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: nowrap;
    white-space: nowrap;
  }

  .tm-badge {
    min-height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 7px;
    padding: 0.22rem 0.55rem;
    font-size: 0.72rem;
    font-weight: 900;
    line-height: 1;
  }

  .tm-badge-silent {
    gap: 0.38rem;
    color: ${THEME.silent};
    background: ${THEME.silentBg};
    border: 1px solid rgba(45,212,191,0.36);
  }

  .tm-badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: ${THEME.silent};
    flex-shrink: 0;
  }

  .tm-badge-verified {
    gap: 0.3rem;
    color: #fff3b0;
    border: 1px solid rgba(255,215,100,0.5);
    background: linear-gradient(135deg, #2b2108 0%, #6f5413 42%, #caa84a 100%);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.2),
      0 8px 28px rgba(212,175,55,0.12);
    text-shadow: 0 1px 1px rgba(0,0,0,0.65);
  }

  .tm-shop-action {
    min-width: 92px;
    z-index: 1;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-areas:
      "price heart"
      "chev chev";
    gap: 0.4rem 0.65rem;
    justify-items: end;
    align-items: center;
  }

  .tm-price {
    grid-area: price;
    font-size: 0.98rem;
    font-weight: 800;
    color: #fff;
  }

  .tm-heart {
    grid-area: heart;
    background: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
    font-size: 1.35rem;
    line-height: 1;
    transition: transform 0.12s ease;
  }

  .tm-heart:hover {
    transform: scale(1.12);
  }

  .tm-chevron {
    grid-area: chev;
    color: rgba(255,255,255,0.22);
    font-size: 2rem;
    line-height: 1;
  }

  @media (max-width: 760px) {
    .tm-inner {
      padding: 1.1rem;
    }

    .tm-auth {
      top: 1rem;
      right: 1rem;
    }

    .tm-signin-btn {
      padding: 0.72rem 1.05rem;
      border-radius: 13px;
      font-size: 0.9rem;
    }

    .tm-hero {
      min-height: auto;
      display: block;
      padding: 4.5rem 0 1.1rem;
    }

    .tm-logo {
  height: 60px;
}

    .tm-tagline {
      font-size: 0.72rem;
      letter-spacing: 0.22rem;
    }

    .tm-hero-copy {
      margin-top: 2rem;
      padding: 1.1rem;
      border-radius: 22px;
    }

    .tm-hero h1 {
      font-size: 3.35rem;
    }

    .tm-hero p {
      font-size: 0.93rem;
    }

    .tm-control-panel {
      padding: 1rem;
      border-radius: 24px;
    }

    .tm-nav {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 0.55rem;
    }

    .tm-nav-btn {
      justify-content: center;
      padding: 0.82rem 0.55rem;
      font-size: 0.82rem;
      border-radius: 15px;
    }

    .tm-search-heading h2 {
      font-size: 2.15rem;
    }

    .tm-search-heading p {
      display: none;
    }

    .tm-search-bar {
      border-radius: 18px;
    }

    .tm-search-bar input {
      padding: 0.95rem 0.8rem;
      font-size: 0.92rem;
    }

    .tm-postcode-input {
      width: 112px;
    }

    .tm-search-bar button {
      padding: 0 1rem;
    }

    .tm-filters {
      grid-template-columns: 1fr 1fr;
      gap: 0.8rem;
    }

    .tm-micro-stats {
      display: none;
    }

    .tm-results-topline {
      padding: 0 0.15rem;
      font-size: 0.67rem;
      letter-spacing: 0.08rem;
    }

    .tm-card-list {
      gap: 0.85rem;
    }

    .tm-shop-card {
      grid-template-columns: 72px 1fr 72px;
      gap: 0.85rem;
      padding: 0.92rem;
      border-radius: 22px;
      align-items: center;
    }

    .tm-shop-image {
      width: 72px;
      height: 72px;
      border-radius: 17px;
    }

    .tm-shop-title-row h3 {
      font-size: 1rem;
    }

    .tm-shop-title-row p {
      font-size: 0.83rem;
    }

    .tm-badge-row {
      gap: 0.32rem;
      margin-top: 0.65rem;
    }

    .tm-badge {
      min-height: 24px;
      padding: 0.22rem 0.5rem;
      font-size: 0.68rem;
      border-radius: 7px;
    }

    .tm-shop-action {
      min-width: 66px;
      gap: 0.35rem;
    }

    .tm-price {
      font-size: 0.9rem;
    }

    .tm-heart {
      font-size: 1.45rem;
    }

    .tm-chevron {
      font-size: 1.6rem;
    }

    .tm-map-wrap {
      height: 440px;
      border-radius: 22px;
    }
  }

  @media (max-width: 430px) {
    .tm-inner {
      padding: 0.95rem;
    }

    .tm-hero h1 {
      font-size: 2.9rem;
    }

    .tm-nav-btn span:last-child {
      display: inline;
    }

    .tm-search-bar input:first-child {
      width: 48%;
    }

    .tm-postcode-input {
      width: 94px;
    }

    .tm-filters {
      grid-template-columns: 1fr;
    }

    .tm-shop-card {
      grid-template-columns: 64px 1fr 58px;
      gap: 0.75rem;
      padding: 0.85rem;
    }

    .tm-shop-image {
      width: 64px;
      height: 64px;
      border-radius: 15px;
    }

    .tm-shop-title-row h3 {
      font-size: 0.96rem;
    }

    .tm-shop-title-row p {
      font-size: 0.8rem;
    }

    .tm-badge {
      font-size: 0.64rem;
      padding: 0.2rem 0.44rem;
    }

    .tm-shop-action {
      min-width: 54px;
      grid-template-columns: 1fr;
      grid-template-areas:
        "price"
        "heart"
        "chev";
      justify-items: end;
    }

    .tm-price {
      font-size: 0.86rem;
    }

    .tm-chevron {
      display: none;
    }
  }
`;