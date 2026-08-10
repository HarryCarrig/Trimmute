import React, { useState } from "react";
import { MapContainer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import CopySilentCutButton from "./components/CopySilentCutButton";
import type { Shop } from "./App";
import OpenFreeMapLayer from "./OpenFreeMapLayer";

// DARK MODE THEME 🌑
const THEME = {
  bg: "#1a1a1a",
  cardBg: "#262626",
  textMain: "#ffffff",
  textMuted: "#a3a3a3",
  accent: "#3b82f6",
  danger: "#ef4444",
  border: "#404040",
  success: "#22c55e",
  silent: "#4ade80",
  silentBg: "rgba(34, 197, 94, 0.15)",
};

type BarberDetailProps = {
  shop: Shop;
  onBack: () => void;
};

// 📌 CUSTOM PINS
const cyanPin = L.divIcon({
  className: "custom-cyan-pin",
  html: `<svg width="28" height="28" viewBox="0 0 24 24" fill="${THEME.silent}" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#000"></circle></svg>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

const goldPin = L.divIcon({
  className: "custom-gold-pin",
  html: `<svg width="28" height="28" viewBox="0 0 24 24" fill="#FFC107" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#000"></circle></svg>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

const BarberDetail: React.FC<BarberDetailProps> = ({ shop, onBack }) => {
  const [silentAcknowledged, setSilentAcknowledged] = useState(false);

  const supportsSilent = shop.supportsSilent ?? false;
  const isWalkInOnly = Boolean(shop.walkInsOnly);
  const hasExternalBooking = Boolean(shop.externalUrl);

  const openLocation = () => {
    if (shop.lat && shop.lng) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lng}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <div
      style={{
        paddingBottom: "2rem",
        color: THEME.textMain,
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: `1px solid ${THEME.border}`,
            color: THEME.textMain,
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.9rem",
            marginRight: "1rem",
          }}
        >
          ← Back
        </button>

        <h2
          style={{
            fontSize: "1.1rem",
            margin: 0,
            fontWeight: 600,
          }}
        >
          Shop Details
        </h2>
      </div>

      {/* SHOP CARD */}
      <div
        style={{
          backgroundColor: THEME.cardBg,
          borderRadius: "16px",
          overflow: "hidden",
          border: `1px solid ${THEME.border}`,
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            height: "160px",
            backgroundColor: "#333",
            position: "relative",
          }}
        >
          {shop.cover_url || shop.imageUrl ? (
            <img
              src={shop.cover_url || shop.imageUrl || undefined}
              alt={`${shop.name} shop`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "#444",
              }}
            />
          )}

          {shop.deal && (
            <div
              style={{
                position: "absolute",
                bottom: "12px",
                left: "12px",
                backgroundColor: "#dcfce7",
                color: "#166534",
                fontSize: "0.8rem",
                fontWeight: "700",
                padding: "6px 12px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>💳</span> {shop.deal}
            </div>
          )}
        </div>

        <div style={{ padding: "1.25rem" }}>
          <h2
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "1.5rem",
            }}
          >
            {shop.name}
          </h2>

          <p
            style={{
              margin: "0 0 1rem 0",
              color: THEME.textMuted,
              fontSize: "0.95rem",
            }}
          >
            📍 {shop.address}
          </p>

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                color: "#60a5fa",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              £{(shop.basePrice / 100).toFixed(0)} Cut
            </span>

            {supportsSilent && (
              <span
                style={{
                  backgroundColor: THEME.silentBg,
                  color: THEME.silent,
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                🤫 Silent Friendly
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 🗺️ MAP SECTION */}
      {shop.lat && shop.lng ? (
        <div
          style={{
            borderRadius: "16px",
            overflow: "hidden",
            border: `1px solid ${THEME.border}`,
            marginBottom: "1.5rem",
            height: "200px",
            zIndex: 0,
            position: "relative",
          }}
        >
          <MapContainer
            center={[shop.lat, shop.lng]}
            zoom={15}
            style={{
              height: "100%",
              width: "100%",
            }}
            zoomControl={false}
          >
            <OpenFreeMapLayer />

            <Marker
              position={[shop.lat, shop.lng]}
              icon={shop.isPartner ? goldPin : cyanPin}
            >
              <Popup>
                <strong
                  style={{
                    color: "#000",
                    fontSize: "14px",
                    fontFamily: "sans-serif",
                  }}
                >
                  {shop.name}
                </strong>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      ) : null}

      {/* WALK-IN ONLY */}
      {isWalkInOnly ? (
        <div
          style={{
            textAlign: "center",
            padding: "2rem 1rem",
            backgroundColor: THEME.cardBg,
            borderRadius: "16px",
            border: `1px solid ${THEME.border}`,
          }}
        >
          <h3
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "1.2rem",
            }}
          >
            Walk-ins welcome
          </h3>

          <p
            style={{
              color: THEME.textMuted,
              fontSize: "0.95rem",
              lineHeight: 1.5,
              marginBottom: "1.25rem",
            }}
          >
            <b>{shop.name}</b> is walk-in only, so no booking is needed.
            <br />
            Visit the shop directly and ask for a quieter appointment if
            preferred.
          </p>

          <div
            style={{
              background: "rgba(94, 234, 212, 0.08)",
              border: "1px solid rgba(94, 234, 212, 0.45)",
              borderRadius: "14px",
              padding: "14px",
              marginBottom: "14px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 800,
                color: "#5eead4",
                marginBottom: "8px",
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              Quiet appointment reminder
            </div>

            <div
              style={{
                background: "rgba(0, 0, 0, 0.35)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "10px",
                padding: "10px",
                color: "#ffffff",
                fontSize: "0.95rem",
                fontWeight: 700,
                lineHeight: 1.4,
              }}
            >
              “I’d like a quieter cut today please — no small talk.”
            </div>
          </div>

          {shop.lat && shop.lng ? (
            <button
              onClick={openLocation}
              style={{
                width: "100%",
                padding: "1rem",
                backgroundColor: "#ffffff",
                color: "#000000",
                fontWeight: "700",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              View location ↗
            </button>
          ) : null}
        </div>
      ) : hasExternalBooking ? (
        /* EXTERNAL BOOKING ONLY */
        <div
          style={{
            textAlign: "center",
            padding: "2rem 1rem",
            backgroundColor: THEME.cardBg,
            borderRadius: "16px",
            border: `1px solid ${THEME.border}`,
          }}
        >
          <h3
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "1.2rem",
            }}
          >
            Ready to book?
          </h3>

          <p
            style={{
              color: THEME.textMuted,
              fontSize: "0.95rem",
              lineHeight: 1.5,
              marginBottom: "1.25rem",
            }}
          >
            Booking takes place directly with <b>{shop.name}</b> on their
            external booking service.
          </p>

          <div
            style={{
              background: "rgba(94, 234, 212, 0.08)",
              border: "1px solid rgba(94, 234, 212, 0.45)",
              borderRadius: "14px",
              padding: "14px",
              marginBottom: "14px",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 800,
                color: "#5eead4",
                marginBottom: "8px",
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              Quiet appointment reminder
            </div>

            <p
              style={{
                margin: "0 0 10px 0",
                color: THEME.textMuted,
                fontSize: "0.95rem",
                lineHeight: 1.5,
                textAlign: "center",
              }}
            >
              When booking or when you arrive, request:
            </p>

            <div
              style={{
                background: "rgba(0, 0, 0, 0.35)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "10px",
                padding: "10px",
                color: "#ffffff",
                fontSize: "0.95rem",
                fontWeight: 700,
                lineHeight: 1.4,
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              “Requesting a Silent Cut please.”
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              <CopySilentCutButton />
            </div>

            <button
              type="button"
              onClick={() => setSilentAcknowledged(true)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                border: silentAcknowledged
                  ? "1px solid rgba(94, 234, 212, 0.8)"
                  : "1px solid rgba(255, 255, 255, 0.18)",
                background: silentAcknowledged
                  ? "rgba(94, 234, 212, 0.18)"
                  : "rgba(255, 255, 255, 0.06)",
                color: silentAcknowledged ? "#5eead4" : "#ffffff",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {silentAcknowledged
                ? "✓ Got it"
                : "I'll remember to request this"}
            </button>
          </div>

          <a
            href={silentAcknowledged ? shop.externalUrl : undefined}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!silentAcknowledged) {
                e.preventDefault();
                alert(
                  "Please confirm the quiet appointment reminder before continuing."
                );
              }
            }}
            style={{
              display: "block",
              width: "100%",
              maxWidth: "300px",
              boxSizing: "border-box",
              margin: "0 auto",
              backgroundColor: "#000000",
              color: "white",
              textDecoration: "none",
              fontSize: "1.1rem",
              fontWeight: "bold",
              padding: "1rem",
              borderRadius: "12px",
              border: "1px solid #333",
              cursor: "pointer",
            }}
          >
            Continue to External Booking ↗
          </a>
        </div>
      ) : (
        /* NO BOOKING LINK AVAILABLE */
        <div
          style={{
            textAlign: "center",
            padding: "2rem 1rem",
            backgroundColor: THEME.cardBg,
            borderRadius: "16px",
            border: `1px solid ${THEME.border}`,
          }}
        >
          <h3
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "1.2rem",
            }}
          >
            Booking link unavailable
          </h3>

          <p
            style={{
              color: THEME.textMuted,
              fontSize: "0.95rem",
              lineHeight: 1.5,
              marginBottom: "1.25rem",
            }}
          >
            Trimmute does not currently have an external booking link for{" "}
            <b>{shop.name}</b>.
          </p>

          <div
            style={{
              background: "rgba(94, 234, 212, 0.08)",
              border: "1px solid rgba(94, 234, 212, 0.45)",
              borderRadius: "14px",
              padding: "14px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 800,
                color: "#5eead4",
                marginBottom: "8px",
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              Quiet appointment reminder
            </div>

            <div
              style={{
                background: "rgba(0, 0, 0, 0.35)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "10px",
                padding: "10px",
                color: "#ffffff",
                fontSize: "0.95rem",
                fontWeight: 700,
                lineHeight: 1.4,
              }}
            >
              “Requesting a Silent Cut please.”
            </div>
          </div>

          {shop.lat && shop.lng ? (
            <button
              onClick={openLocation}
              style={{
                width: "100%",
                padding: "1rem",
                backgroundColor: "#ffffff",
                color: "#000000",
                fontWeight: "700",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              View location ↗
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default BarberDetail;