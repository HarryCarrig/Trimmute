import React, { useState, useEffect } from "react";
import BarberMode from "./BarberMode";
import BarberDetail from "./BarberDetail";
import MyBookings from "./mybookings";
import logo from "./assets/trimmute-logo.png";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

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

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://trimmute.onrender.com";
const BACKEND_URL = `${API_BASE}/barbers`;
const BACKEND_NEAR_URL = `${API_BASE}/barbers/near`;

// ─── Design tokens ────────────────────────────────────────────────────────────
// Warm near-black (not pure #000) for a softer, more trustworthy feel
const T = {
  bg:          "#0d0d0e",
  surface:     "#131315",
  surfaceRaised: "#1a1a1d",
  border:      "rgba(255,255,255,0.09)",
  borderMid:   "rgba(255,255,255,0.15)",
  borderStrong:"rgba(255,255,255,0.24)",
  text:        "#f4f4f5",
  textSoft:    "#c4c4cc",
  textMuted:   "#737380",
  textFaint:   "#45454c",
  teal:        "#4fd1c5",        // slightly softer than the original cyan
  tealBg:      "rgba(79,209,197,0.10)",
  tealBorder:  "rgba(79,209,197,0.28)",
  gold:        "#c8a84b",
  goldBg:      "rgba(200,168,75,0.10)",
  goldBorder:  "rgba(200,168,75,0.28)",
  amber:       "#fbbf24",
  amberBg:     "rgba(251,191,36,0.09)",
  amberBorder: "rgba(251,191,36,0.24)",
  green:       "#4ade80",
  greenBg:     "rgba(74,222,128,0.10)",
  greenBorder: "rgba(74,222,128,0.28)",
  danger:      "#f87171",
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
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem("trimmute_favorites", JSON.stringify(next));
      return next;
    });
  };

  const mapShop = (b: any, index: number): Shop => ({
    id: String(b.id ?? index),
    name: String(b.name ?? ""),
    address: b.address ?? "Unknown area",
    imageUrl: typeof b.imageUrl === "string" ? b.imageUrl : typeof b.image_url === "string" ? b.image_url : null,
    cover_url: b.cover_url ?? null,
    supportsSilent: Boolean(b.supportsSilent ?? b.supports_silent ?? true),
    basePrice: Number(b.basePrice ?? b.base_price_pence ?? 2000),
    styles: Array.isArray(b.styles) ? b.styles : [],
    distanceKm: typeof b.distanceKm === "number" ? b.distanceKm : undefined,
    postcode: b.postcode ?? undefined,
    lat: typeof b.lat === "number" ? b.lat : undefined,
    lng: typeof b.lng === "number" ? b.lng : undefined,
    isPartner: Boolean(b.isPartner ?? b.is_partner ?? false),
    externalUrl: b.externalUrl ?? b.external_url ?? "",
    deal: b.deal ?? undefined,
    distance: typeof b.distance === "number" ? b.distance : undefined,
  });

  async function loadShops() {
    try {
      setError(""); setLoading(true);
      const res = await fetch(BACKEND_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setShops((await res.json()).map(mapShop));
      setView("home");
    } catch (err: any) {
      setError(err.message ?? "Failed to load barbers");
      setShops([]);
    } finally { setLoading(false); }
  }

  async function loadShopsNearCoords(lat: number, lng: number) {
    try {
      setError(""); setLoading(true); setUserLoc([lat, lng]);
      const res = await fetch(`${BACKEND_NEAR_URL}?lat=${lat}&lng=${lng}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setShops((await res.json()).map(mapShop));
      setView("home");
    } catch (err: any) {
      setError(err.message ?? "Failed to load nearby barbers");
      setShops([]);
    } finally { setLoading(false); }
  }

  function loadShopsNearMe() {
    if (!navigator.geolocation) { setError("Geolocation is not supported in this browser."); return; }
    setError(""); setLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => loadShopsNearCoords(coords.latitude, coords.longitude),
      (err) => {
        setLoading(false);
        setError(err.code === 1 ? "Location permission was denied." : "Could not get your location.");
      }
    );
  }

  async function searchByPostcode() {
    if (!postcode.trim()) return;
    try {
      setError(""); setLoading(true);
      const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode.trim().replace(/\s+/g,""))}`);
      const data = await res.json();
      if (data.status !== 200 || !data.result) throw new Error(data.error || "Postcode not found");
      await loadShopsNearCoords(data.result.latitude, data.result.longitude);
    } catch (err: any) {
      setError(err.message ?? "Failed to search by postcode");
    } finally { setLoading(false); }
  }

  useEffect(() => { loadShops(); }, []);

  const visibleShops = [...shops]
    .filter((s) => {
      const q = searchTerm.toLowerCase();
      return (
        (s.name.toLowerCase().includes(q) || (s.address && s.address.toLowerCase().includes(q))) &&
        s.basePrice / 100 <= maxPrice &&
        (showRosterOnly ? favorites.includes(s.id) : true)
      );
    })
    .sort((a, b) => {
      if (sortBy === "price_low") return a.basePrice - b.basePrice;
      if (sortBy === "distance" && a.distance !== undefined && b.distance !== undefined) return a.distance - b.distance;
      if (a.isPartner && !b.isPartner) return -1;
      if (!a.isPartner && b.isPartner) return 1;
      return 0;
    });

  return (
    <div className="tm-shell">
      <style>{styles}</style>

      <div className="tm-app">
        <div className="tm-auth">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="tm-signin-btn">Sign in</button>
            </SignInButton>
          </SignedOut>
          <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
        </div>

        <div className="tm-inner">
          {/* ── Hero ── */}
          <header className="tm-hero">
            <div className="tm-logo-wrap">
              <img src={logo} alt="Trimmute" className="tm-logo" />
              <p className="tm-tagline">Silence speaks volumes</p>
            </div>

            <div className="tm-hero-copy">
              <div className="tm-live-pill">
                <span className="tm-pulse" aria-hidden="true" />
                Canterbury · live
              </div>

              <h1>
                Book the cut.<br />
                <span className="tm-h1-muted">Skip the chat.</span>
              </h1>

              <p className="tm-hero-body">
                Find barbers who are genuinely comfortable with low-chat or silent
                appointments. Verified local shops, calmer visits.
              </p>
            </div>
          </header>

          {/* ── Sub-views ── */}
          {view === "barber" && <BarberMode onBack={() => setView("home")} />}
          {view === "detail" && selectedShop && (
            <BarberDetail shop={selectedShop} onBack={() => { setSelectedShop(null); setView("home"); }} />
          )}
          {view === "bookings" && <MyBookings onBack={() => setView("home")} />}

          {/* ── Home ── */}
          {view === "home" && (
            <>
              {/* Control panel */}
              <section className="tm-panel" aria-label="Search and filters">

                <nav className="tm-nav" aria-label="Main navigation">
                  <NavBtn icon="pin" label="Near me" active={!showRosterOnly}
                    onClick={() => { setShowRosterOnly(false); setSelectedShop(null); setView("home"); loadShopsNearMe(); }} />
                  <NavBtn icon="scissors" label={showRosterOnly ? "All shops" : "My roster"} active={showRosterOnly}
                    onClick={() => setShowRosterOnly(!showRosterOnly)} />
                  <NavBtn icon={showMap ? "list" : "map"} label={showMap ? "List" : "Map"} active={showMap}
                    onClick={() => setShowMap(!showMap)} />
                </nav>

                <div className="tm-search-heading">
                  <h2>Find your quiet place.</h2>
                  <p>Search by shop name, area, or postcode.</p>
                </div>

                <div className="tm-search-bar" role="search">
                  <label htmlFor="tm-search-name" className="tm-sr-only">Search by shop or area</label>
                  <input
                    id="tm-search-name"
                    placeholder="Shop or area…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="tm-divider" aria-hidden="true" />
                  <label htmlFor="tm-postcode" className="tm-sr-only">Search by postcode</label>
                  <input
                    id="tm-postcode"
                    className="tm-postcode-input"
                    placeholder="Postcode…"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchByPostcode()}
                  />
                  <button onClick={searchByPostcode} aria-label="Search by postcode">Go</button>
                </div>

                <div className="tm-filters">
                  <div className="tm-filter-block">
                    <label htmlFor="tm-price-range">
                      Max price <strong>£{maxPrice}</strong>
                    </label>
                    <input
                      id="tm-price-range"
                      type="range" min="10" max="100" step="1"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />
                  </div>
                  <div className="tm-filter-block">
                    <label htmlFor="tm-sort">Sort</label>
                    <select id="tm-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="recommended">Recommended</option>
                      <option value="price_low">Lowest price</option>
                      <option value="distance">Closest first</option>
                    </select>
                  </div>
                </div>

                <div className="tm-stats" aria-live="polite">
                  <span><strong>{visibleShops.length}</strong> shops</span>
                  <span><strong>{shops.filter((s) => s.isPartner).length}</strong> verified</span>
                  <span><strong>{favorites.length}</strong> saved</span>
                </div>
              </section>

              {/* Status states */}
              {loading && (
                <div className="tm-state-card" role="status" aria-live="polite">
                  <span className="tm-spinner" aria-hidden="true" />
                  Looking for quiet-friendly shops near you…
                </div>
              )}

              {error && (
                <div className="tm-state-card tm-state-error" role="alert">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              {!loading && !error && visibleShops.length === 0 && (
                <div className="tm-state-card">
                  {showRosterOnly
                    ? "Your roster is empty. Tap the heart on any shop to save it here."
                    : "No shops match your search. Try a different area or postcode."}
                </div>
              )}

              {showMap ? (
                <MapView visibleShops={visibleShops} userLoc={userLoc}
                  onSelectShop={(s) => { setSelectedShop(s); setView("detail"); }} />
              ) : (
                <section className="tm-results" aria-label="Shop results">
                  <div className="tm-results-meta">
                    <span>Quiet-friendly options</span>
                    <span>{showRosterOnly ? "Roster view" : `${visibleShops.length} results`}</span>
                  </div>
                  <div className="tm-card-list">
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
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Map ──────────────────────────────────────────────────────────────────────

const MapView = ({
  visibleShops, userLoc, onSelectShop,
}: {
  visibleShops: Shop[];
  userLoc: [number, number] | null;
  onSelectShop: (s: Shop) => void;
}) => (
  <div className="tm-map-wrap">
    <MapContainer center={userLoc || [51.28, 1.08]} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="&copy; CARTO" />
      {userLoc && (
        <Marker position={userLoc} icon={userPin}>
          <Popup><strong style={{ color:"#000", fontFamily:"sans-serif", fontSize:"13px" }}>You are here</strong></Popup>
        </Marker>
      )}
      {visibleShops.map((shop) => {
        if (!shop.lat || !shop.lng) return null;
        return (
          <Marker key={shop.id} position={[shop.lat, shop.lng]} icon={shop.isPartner ? goldPin : tealPin}>
            <Popup>
              <div style={{ fontFamily:"sans-serif", minWidth:"160px", textAlign:"center" }}>
                <strong style={{ color:"#000", fontSize:"14px", display:"block", marginBottom:"4px" }}>
                  {shop.isPartner && <span>⭐ </span>}{shop.name}
                </strong>
                {shop.isPartner && (
                  <span style={{ display:"inline-block", fontSize:"11px", fontWeight:700, color:"#fff3b0",
                    background:"linear-gradient(135deg,#2b2108,#caa84a)", padding:"2px 8px",
                    borderRadius:"4px", marginBottom:"6px" }}>
                    ★ Verified
                  </span>
                )}
                <p style={{ color:"#555", fontSize:"12px", margin:"0 0 8px" }}>{shop.address}</p>
                <button
                  onClick={() => shop.isPartner ? onSelectShop(shop) : shop.externalUrl && window.open(shop.externalUrl,"_blank","noopener,noreferrer")}
                  style={{ background: shop.isPartner ? T.gold : T.teal, color:"#000", border:"none",
                    padding:"7px 12px", borderRadius:"8px", fontWeight:700, cursor:"pointer",
                    width:"100%", fontSize:"12px" }}>
                  {shop.isPartner ? "View details" : "Book externally"}
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  </div>
);

const tealPin = L.divIcon({
  className:"", html:`<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22s14-12.667 14-22C28 6.268 21.732 0 14 0z" fill="${T.teal}"/><circle cx="14" cy="14" r="5" fill="#0d0d0e"/></svg>`,
  iconSize:[28,36], iconAnchor:[14,36], popupAnchor:[0,-36],
});

const goldPin = L.divIcon({
  className:"", html:`<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22s14-12.667 14-22C28 6.268 21.732 0 14 0z" fill="${T.gold}"/><circle cx="14" cy="14" r="5" fill="#0d0d0e"/></svg>`,
  iconSize:[28,36], iconAnchor:[14,36], popupAnchor:[0,-36],
});

const userPin = L.divIcon({
  className:"", html:`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" fill="#fff" stroke="${T.teal}" stroke-width="3"/><circle cx="10" cy="10" r="4" fill="${T.teal}"/></svg>`,
  iconSize:[20,20], iconAnchor:[10,10], popupAnchor:[0,-10],
});

// ─── Nav button ───────────────────────────────────────────────────────────────

const NavIcon = ({ name }: { name: string }) => {
  const icons: Record<string, React.ReactNode> = {
    pin: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    scissors: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>,
    map: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>,
    list: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  };
  return icons[name] ?? null;
};

const NavBtn = ({ icon, label, onClick, active }: { icon: string; label: string; onClick: () => void; active?: boolean }) => (
  <button onClick={onClick} className={`tm-nav-btn${active ? " active" : ""}`} aria-pressed={active}>
    <NavIcon name={icon} />
    <span>{label}</span>
  </button>
);

// ─── Shop card ────────────────────────────────────────────────────────────────

const ShopCard = ({
  shop, onClick, isFavorited, onFavorite,
}: {
  shop: Shop; onClick: () => void; isFavorited: boolean; onFavorite: () => void;
}) => {
  const price = `£${(shop.basePrice / 100).toFixed(2).replace(/\.00$/, "")}`;
  const hasDistance = typeof shop.distance === "number" && !Number.isNaN(shop.distance);

  const handleClick = () => {
    if (shop.isPartner) onClick();
    else if (shop.externalUrl) window.open(shop.externalUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      className={`tm-card${shop.isPartner ? " tm-card--partner" : ""}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
      aria-label={`${shop.name}, ${shop.address}, from ${price}`}
    >
      {/* Thumbnail */}
      <div className="tm-card-img" aria-hidden="true">
        {shop.imageUrl
          ? <img src={shop.imageUrl} alt="" />
          : <span className="tm-card-img-fallback">✂</span>}
      </div>

      {/* Body */}
      <div className="tm-card-body">
        <h3 className="tm-card-name">{shop.name}</h3>
        <p className="tm-card-addr">{shop.address}</p>

        {hasDistance && (
          <p className="tm-card-dist">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {shop.distance?.toFixed(1)} miles away
          </p>
        )}

        {shop.deal && (
          <p className="tm-card-deal">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            {shop.deal}
          </p>
        )}

        {!shop.isPartner && (
          <p className="tm-card-notice">
            Community listing · add "Silent Cut Please" to your booking notes
          </p>
        )}

        <div className="tm-badge-row">
          {shop.supportsSilent && (
            <span className="tm-badge tm-badge--quiet">
              <span className="tm-badge-dot" aria-hidden="true" />
              Quiet-friendly
            </span>
          )}
          {shop.isPartner && (
            <span className="tm-badge tm-badge--verified">★ Verified</span>
          )}
        </div>
      </div>

      {/* Action column */}
      <div className="tm-card-action">
        <span className="tm-card-price">{price}</span>

        <button
          className={`tm-fav${isFavorited ? " saved" : ""}`}
          onClick={(e) => { e.stopPropagation(); onFavorite(); }}
          aria-label={isFavorited ? `Remove ${shop.name} from roster` : `Save ${shop.name} to roster`}
          aria-pressed={isFavorited}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorited ? T.teal : "none"} stroke={isFavorited ? T.teal : T.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>

        <span className="tm-card-arrow" aria-hidden="true">
          {shop.isPartner
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>}
        </span>
      </div>
    </article>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = `
  *, *::before, *::after { box-sizing: border-box; }

  html, body {
    margin: 0;
    background: ${T.bg};
    -webkit-font-smoothing: antialiased;
  }

  .tm-sr-only {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border: 0;
  }

  /* ── Shell ─────────────────────────────────────────────────────────────── */
  .tm-shell {
    min-height: 100vh;
    background:
      radial-gradient(ellipse 70% 40% at 50% -5%, rgba(79,209,197,0.09) 0%, transparent 60%),
      radial-gradient(ellipse 50% 30% at 95% 15%, rgba(200,168,75,0.07) 0%, transparent 55%),
      ${T.bg};
    display: flex;
    justify-content: center;
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: ${T.text};
    overflow-x: hidden;
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

  /* ── Auth ───────────────────────────────────────────────────────────────── */
  .tm-auth {
    position: absolute;
    top: 1.5rem; right: 1.5rem;
    z-index: 50;
  }

  .tm-signin-btn {
    padding: 0.6rem 1.1rem;
    border-radius: 10px;
    background: ${T.teal};
    color: #0a1a18;
    border: 0;
    font-size: 0.88rem;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.01em;
    transition: opacity 0.15s;
  }
  .tm-signin-btn:hover { opacity: 0.88; }

  /* ── Hero ───────────────────────────────────────────────────────────────── */
  .tm-hero {
    display: grid;
    grid-template-columns: 0.85fr 1.15fr;
    gap: 2rem;
    align-items: center;
    padding: 3.25rem 0 2.5rem;
  }

  .tm-logo-wrap { text-align: center; }

  .tm-logo {
    height: 64px;
    display: block;
    margin: 0 auto 0.8rem;
    filter: brightness(0) invert(1);
  }

  .tm-tagline {
    margin: 0;
    font-size: 0.72rem;
    letter-spacing: 0.28em;
    color: ${T.textMuted};
    text-transform: uppercase;
    font-weight: 600;
  }

  .tm-hero-copy {
    padding: 1.5rem;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 24px;
    background: ${T.surface};
  }

  .tm-live-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${T.teal};
    background: ${T.tealBg};
    border: 1px solid ${T.tealBorder};
    border-radius: 999px;
    padding: 0.4rem 0.7rem;
  }

  .tm-pulse {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: ${T.teal};
    box-shadow: 0 0 0 0 ${T.teal};
    animation: tm-pulse 2s ease-out infinite;
    flex-shrink: 0;
  }

  @keyframes tm-pulse {
    0%   { box-shadow: 0 0 0 0 rgba(79,209,197,0.55); }
    70%  { box-shadow: 0 0 0 7px rgba(79,209,197,0); }
    100% { box-shadow: 0 0 0 0 rgba(79,209,197,0); }
  }

  .tm-hero h1 {
    margin: 1rem 0 0.75rem;
    font-size: clamp(2.4rem, 4.8vw, 4.4rem);
    line-height: 0.94;
    letter-spacing: -0.06em;
    font-weight: 800;
  }

  .tm-h1-muted {
    color: ${T.textMuted};
    font-weight: 500;
  }

  .tm-hero-body {
    margin: 0;
    color: ${T.textSoft};
    font-size: 0.97rem;
    line-height: 1.6;
  }

  /* ── Control panel ─────────────────────────────────────────────────────── */
  .tm-panel {
    border: 1px solid ${T.border};
    background: ${T.surface};
    border-radius: 24px;
    padding: 1.35rem;
    margin-bottom: 1.25rem;
  }

  /* ── Nav ────────────────────────────────────────────────────────────────── */
  .tm-nav {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }

  .tm-nav-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 1rem;
    border: 1px solid ${T.border};
    border-radius: 12px;
    background: transparent;
    color: ${T.textMuted};
    font-size: 0.86rem;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s, background 0.15s;
  }
  .tm-nav-btn:hover {
    color: ${T.text};
    border-color: ${T.borderMid};
    background: rgba(255,255,255,0.04);
  }
  .tm-nav-btn.active {
    color: ${T.text};
    border-color: ${T.borderStrong};
    background: rgba(255,255,255,0.06);
  }
  .tm-nav-btn:focus-visible {
    outline: 2px solid ${T.teal};
    outline-offset: 2px;
  }

  /* ── Search ─────────────────────────────────────────────────────────────── */
  .tm-search-heading { margin-bottom: 1rem; }

  .tm-search-heading h2 {
    margin: 0 0 0.3rem;
    font-size: clamp(1.6rem, 3.5vw, 2.4rem);
    font-weight: 700;
    letter-spacing: -0.05em;
    color: ${T.text};
  }

  .tm-search-heading p {
    margin: 0;
    font-size: 0.88rem;
    color: ${T.textMuted};
  }

  .tm-search-bar {
    display: flex;
    align-items: stretch;
    border: 1px solid ${T.border};
    border-radius: 14px;
    background: ${T.bg};
    overflow: hidden;
    transition: border-color 0.15s;
  }
  .tm-search-bar:focus-within { border-color: ${T.borderMid}; }

  .tm-search-bar input {
    background: transparent;
    border: 0;
    color: ${T.text};
    outline: 0;
    padding: 0.95rem 1rem;
    font-size: 0.95rem;
    min-width: 0;
    font-family: inherit;
  }
  .tm-search-bar input:first-of-type { flex: 1; }
  .tm-search-bar input::placeholder { color: ${T.textFaint}; }

  .tm-postcode-input { width: 126px; }

  .tm-divider {
    width: 1px;
    background: ${T.border};
    margin: 0.7rem 0;
    flex-shrink: 0;
  }

  .tm-search-bar button {
    background: ${T.text};
    color: #0d0d0e;
    border: 0;
    padding: 0 1.25rem;
    font-size: 0.88rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.15s;
  }
  .tm-search-bar button:hover { opacity: 0.88; }

  /* ── Filters ─────────────────────────────────────────────────────────────── */
  .tm-filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1.1rem;
  }

  .tm-filter-block label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.82rem;
    color: ${T.textMuted};
    margin-bottom: 0.5rem;
  }

  .tm-filter-block label strong { color: ${T.teal}; font-weight: 700; }

  .tm-filter-block input[type="range"] {
    width: 100%;
    accent-color: ${T.teal};
    cursor: pointer;
  }

  .tm-filter-block select {
    width: 100%;
    padding: 0.65rem 0.75rem;
    border-radius: 10px;
    border: 1px solid ${T.border};
    background: ${T.bg};
    color: ${T.text};
    font-size: 0.88rem;
    font-family: inherit;
    outline: 0;
    cursor: pointer;
    transition: border-color 0.15s;
  }
  .tm-filter-block select:focus { border-color: ${T.borderMid}; }
  .tm-filter-block option { background: #0d0d0e; color: ${T.text}; }

  /* ── Stats ───────────────────────────────────────────────────────────────── */
  .tm-stats {
    display: flex;
    gap: 0.55rem;
    flex-wrap: wrap;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid ${T.border};
  }

  .tm-stats span {
    font-size: 0.76rem;
    color: ${T.textMuted};
    border: 1px solid ${T.border};
    background: rgba(255,255,255,0.03);
    border-radius: 999px;
    padding: 0.38rem 0.65rem;
  }

  .tm-stats strong { color: ${T.text}; font-weight: 700; }

  /* ── State cards ─────────────────────────────────────────────────────────── */
  .tm-state-card {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    border-radius: 14px;
    padding: 1rem 1.1rem;
    margin: 0.75rem 0;
    border: 1px solid ${T.border};
    background: ${T.surface};
    color: ${T.textMuted};
    font-size: 0.92rem;
    line-height: 1.5;
  }

  .tm-state-error {
    border-color: rgba(248,113,113,0.35);
    color: ${T.danger};
  }

  .tm-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(79,209,197,0.2);
    border-top-color: ${T.teal};
    border-radius: 50%;
    animation: tm-spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes tm-spin { to { transform: rotate(360deg); } }

  /* ── Map ─────────────────────────────────────────────────────────────────── */
  .tm-map-wrap {
    height: 500px;
    width: 100%;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid ${T.border};
    margin-top: 0.5rem;
  }

  /* ── Results ─────────────────────────────────────────────────────────────── */
  .tm-results { margin-top: 0.5rem; }

  .tm-results-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.74rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${T.textMuted};
    padding: 0 0.2rem;
    margin-bottom: 0.75rem;
  }

  .tm-card-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  /* ── Shop card ───────────────────────────────────────────────────────────── */
  .tm-card {
    position: relative;
    display: grid;
    grid-template-columns: 80px 1fr auto;
    gap: 1rem;
    align-items: center;
    border: 1px solid ${T.border};
    background: ${T.surface};
    border-radius: 20px;
    padding: 1rem;
    cursor: pointer;
    transition: border-color 0.18s, background 0.18s, transform 0.15s;
    outline: 0;
  }

  .tm-card:hover, .tm-card:focus-visible {
    border-color: ${T.borderMid};
    background: ${T.surfaceRaised};
    transform: translateY(-1px);
  }

  .tm-card:focus-visible {
    box-shadow: 0 0 0 3px rgba(79,209,197,0.35);
  }

  .tm-card--partner {
    border-color: ${T.goldBorder};
  }

  /* Thumbnail */
  .tm-card-img {
    width: 80px; height: 80px;
    border-radius: 14px;
    overflow: hidden;
    background: ${T.bg};
    border: 1px solid ${T.border};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .tm-card-img img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
  }

  .tm-card-img-fallback {
    font-size: 1.4rem;
    color: ${T.textFaint};
  }

  /* Body */
  .tm-card-body { min-width: 0; }

  .tm-card-name {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: ${T.text};
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tm-card-addr {
    margin: 0.3rem 0 0;
    font-size: 0.86rem;
    color: ${T.textMuted};
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tm-card-dist {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    margin: 0.45rem 0 0;
    font-size: 0.8rem;
    font-weight: 600;
    color: ${T.teal};
  }

  .tm-card-deal {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    margin: 0.45rem 0 0;
    font-size: 0.78rem;
    font-weight: 700;
    color: ${T.green};
    background: ${T.greenBg};
    border: 1px solid ${T.greenBorder};
    border-radius: 999px;
    padding: 0.25rem 0.55rem;
  }

  .tm-card-notice {
    margin: 0.55rem 0 0;
    font-size: 0.75rem;
    color: ${T.amber};
    background: ${T.amberBg};
    border: 1px solid ${T.amberBorder};
    border-radius: 8px;
    padding: 0.4rem 0.55rem;
    line-height: 1.4;
  }

  /* Badges */
  .tm-badge-row {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
    margin-top: 0.65rem;
  }

  .tm-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    padding: 0.22rem 0.5rem;
    border-radius: 6px;
    line-height: 1;
  }

  .tm-badge--quiet {
    color: ${T.teal};
    background: ${T.tealBg};
    border: 1px solid ${T.tealBorder};
  }

  .tm-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: ${T.teal};
    flex-shrink: 0;
  }

  .tm-badge--verified {
    color: #f5e4a8;
    background: ${T.goldBg};
    border: 1px solid ${T.goldBorder};
    font-size: 0.7rem;
  }

  /* Action column */
  .tm-card-action {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
    min-width: 56px;
    flex-shrink: 0;
  }

  .tm-card-price {
    font-size: 1rem;
    font-weight: 800;
    color: ${T.text};
    white-space: nowrap;
  }

  .tm-fav {
    background: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.12s;
    border-radius: 6px;
  }
  .tm-fav:hover { transform: scale(1.15); }
  .tm-fav:focus-visible { outline: 2px solid ${T.teal}; outline-offset: 2px; }

  .tm-card-arrow {
    color: ${T.textFaint};
    display: flex;
    align-items: center;
  }

  /* ── Responsive ─────────────────────────────────────────────────────────── */
  @media (max-width: 760px) {
    .tm-inner { padding: 1rem; }

    .tm-auth { top: 0.9rem; right: 0.9rem; }

    .tm-hero {
      display: block;
      padding: 4.5rem 0 1.25rem;
    }

    .tm-logo { height: 54px; }

    .tm-hero-copy {
      margin-top: 1.5rem;
      padding: 1.1rem;
      border-radius: 20px;
    }

    .tm-hero h1 { font-size: 3.1rem; }

    .tm-hero-body { font-size: 0.9rem; }

    .tm-panel {
      padding: 1rem;
      border-radius: 20px;
    }

    .tm-nav {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }

    .tm-nav-btn {
      justify-content: center;
      padding: 0.75rem 0.4rem;
      font-size: 0.8rem;
      border-radius: 11px;
    }

    .tm-search-heading h2 { font-size: 1.85rem; }
    .tm-search-heading p { display: none; }

    .tm-search-bar input { padding: 0.88rem 0.75rem; font-size: 0.9rem; }
    .tm-postcode-input { width: 108px; }
    .tm-search-bar button { padding: 0 0.9rem; }

    .tm-filters { gap: 0.75rem; }

    .tm-stats { display: none; }

    .tm-card {
      grid-template-columns: 72px 1fr 52px;
      gap: 0.75rem;
      padding: 0.85rem;
      border-radius: 18px;
    }

    .tm-card-img {
      width: 72px; height: 72px;
      border-radius: 12px;
    }

    .tm-card-name { font-size: 0.97rem; }
    .tm-card-addr { font-size: 0.82rem; }

    .tm-card-action { min-width: 48px; gap: 0.4rem; }
    .tm-card-price { font-size: 0.92rem; }

    .tm-map-wrap { height: 420px; border-radius: 18px; }
  }

  @media (max-width: 430px) {
    .tm-inner { padding: 0.85rem; }

    .tm-hero h1 { font-size: 2.65rem; }

    .tm-filters { grid-template-columns: 1fr; }

    .tm-card {
      grid-template-columns: 64px 1fr 46px;
      gap: 0.65rem;
      padding: 0.8rem;
    }

    .tm-card-img {
      width: 64px; height: 64px;
      border-radius: 11px;
    }

    .tm-card-name { font-size: 0.92rem; }
    .tm-card-addr { font-size: 0.79rem; }

    .tm-card-action {
      min-width: 42px;
      gap: 0.35rem;
    }

    .tm-card-price { font-size: 0.88rem; }

    .tm-card-arrow { display: none; }

    .tm-badge { font-size: 0.65rem; padding: 0.2rem 0.42rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    .tm-pulse { animation: none; }
    .tm-spinner { animation: none; border-top-color: ${T.teal}; }
    .tm-card { transition: none; }
    .tm-fav { transition: none; }
  }
`;
