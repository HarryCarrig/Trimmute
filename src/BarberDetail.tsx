import React, { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://trimmute.onrender.com";

const BOOKINGS_URL = `${API_BASE_URL}/bookings`;
const AVAILABILITY_URL = `${API_BASE_URL}/availability`;

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
  silentBg: "rgba(34, 197, 94, 0.15)"
};

type BarberDetailProps = {
  shop: {
    id: string | number;
    name: string;
    address: string;
    imageUrl?: string | null;
    basePrice: number;
    styles: string[];
    supportsSilent?: boolean;
    distanceKm?: number;
    deal?: string;         
    bookingUrl?: string; 
    lat?: number;
    lng?: number;  
  };
  onBack?: () => void;
};

const BarberDetail: React.FC<BarberDetailProps> = ({ shop, onBack }) => {
  const [bookingDate, setBookingDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isSilentRequest, setIsSilentRequest] = useState(false);

  const supportsSilent = shop.supportsSilent ?? false;
  const isExternal = !!shop.bookingUrl;

  // 🛠️ FIXED: Secure HTTPS Google Maps Embed (No API Key needed)
  const mapUrl = (shop.lat && shop.lng) 
    ? `https://maps.google.com/maps?q=${shop.lat},${shop.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    : null;

  const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"];
  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (isExternal) return; 
    async function loadBooked() {
      if (!bookingDate) { setBookedTimes([]); return; }
      try {
        setLoadingTimes(true);
        const url = `${AVAILABILITY_URL}?barberId=${encodeURIComponent(shop.id)}&date=${encodeURIComponent(bookingDate)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        const times = Array.isArray(data?.bookedTimes) ? data.bookedTimes.map((t: any) => String(t || "").slice(0, 5)).filter(Boolean) : [];
        setBookedTimes(times);
        if (times.includes(selectedTime)) setSelectedTime("");
      } catch (e) { console.error(e); setBookedTimes([]); } finally { setLoadingTimes(false); }
    }
    loadBooked();
  }, [bookingDate, shop.id, selectedTime, isExternal]);

  async function handleConfirmBooking() {
    setError(""); setMessage("");
    if (!customerName.trim() || !bookingDate || !selectedTime) {
      setError("Please fill in all fields."); return;
    }

    setIsBooking(true);
    try {
      const res = await fetch(BOOKINGS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barberId: shop.id,
          barberName: shop.name,
          customerName,
          date: bookingDate,
          time: selectedTime,
          isSilent: isSilentRequest,
        })
      });

      if (res.status === 409) { setError("Time slot taken."); return; }
      if (!res.ok) throw new Error("Booking failed");

      setMessage(`✅ Booked! See you at ${selectedTime}.`);
      setBookedTimes(prev => [...prev, selectedTime]); 
    } catch (err: any) {
      setError("Failed to book. Try again.");
    } finally {
      setIsBooking(false);
    }
  }

  return (
    <div style={{ paddingBottom: "2rem", color: THEME.textMain, maxWidth: "600px", margin: "0 auto" }}>
      
      <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{ background: "transparent", border: `1px solid ${THEME.border}`, color: THEME.textMain, padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem", marginRight: "1rem" }}
          >
            ← Back
          </button>
        )}
        <h2 style={{ fontSize: "1.1rem", margin: 0, fontWeight: 600 }}>Shop Details</h2>
      </div>

      <div style={{ backgroundColor: THEME.cardBg, borderRadius: "16px", overflow: "hidden", border: `1px solid ${THEME.border}`, marginBottom: "1.5rem" }}>
        <div style={{ height: "160px", backgroundColor: "#333", position: "relative" }}>
           {shop.imageUrl ? (
               <img src={shop.imageUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
           ) : <div style={{width:"100%", height:"100%", background:"#444"}} />}
           
           {shop.deal && (
             <div style={{ position: "absolute", bottom: "12px", left: "12px", backgroundColor: "#dcfce7", color: "#166534", fontSize: "0.8rem", fontWeight: "700", padding: "6px 12px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
               <span>💳</span> {shop.deal}
             </div>
           )}
        </div>

        <div style={{ padding: "1.25rem" }}>
           <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.5rem" }}>{shop.name}</h2>
           <p style={{ margin: "0 0 1rem 0", color: THEME.textMuted, fontSize: "0.95rem" }}>📍 {shop.address}</p>
           <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
             <span style={{ backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", padding: "4px 10px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600 }}>£{(shop.basePrice / 100).toFixed(0)} Cut</span>
             {supportsSilent && (
                <span style={{ backgroundColor: THEME.silentBg, color: THEME.silent, padding: "4px 10px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600 }}>🤫 Silent Friendly</span>
             )}
           </div>
        </div>
      </div>

      {/* 🗺️ MAP SECTION */}
      {mapUrl && (
        <div style={{ borderRadius: "16px", overflow: "hidden", border: `1px solid ${THEME.border}`, marginBottom: "1.5rem", height: "200px" }}>
          <iframe 
            src={mapUrl} 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            loading="lazy" 
            title="Shop Location"
          />
        </div>
      )}

      {isExternal ? (
        <div style={{ textAlign: "center", padding: "2rem 1rem", backgroundColor: THEME.cardBg, borderRadius: "16px", border: `1px solid ${THEME.border}` }}>
           <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem" }}>Ready to book?</h3>
           <p style={{ color: THEME.textMuted, marginBottom: "1.5rem", fontSize: "0.95rem" }}>This shop uses Fresha for appointments.</p>
           <a href={shop.bookingUrl} target="_blank" rel="noreferrer" style={{ display: "block", width: "100%", maxWidth: "300px", margin: "0 auto", backgroundColor: "#22c55e", color: "white", textDecoration: "none", fontSize: "1.1rem", fontWeight: "bold", padding: "1rem", borderRadius: "12px" }}>
             Book on Fresha ↗
           </a>
        </div>
      ) : (
        <div style={{ backgroundColor: THEME.cardBg, padding: "1.5rem", borderRadius: "16px", border: `1px solid ${THEME.border}` }}>
          <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.2rem", borderBottom: `1px solid ${THEME.border}`, paddingBottom: "1rem" }}>Book a Silent Cut</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
               <label style={{ color: THEME.textMuted, fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Your Name</label>
               <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid ${THEME.border}`, background: "#111", color: "white", fontSize: "1rem" }} placeholder="e.g. Harry" />
            </div>

            {supportsSilent && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "8px", border: `1px solid ${THEME.border}` }}>
                <input 
                  type="checkbox" 
                  checked={isSilentRequest} 
                  onChange={(e) => setIsSilentRequest(e.target.checked)}
                  style={{ width: "20px", height: "20px", accentColor: THEME.silent }}
                />
                <label style={{ fontSize: "0.95rem", color: "white" }}>Request Silent Service 🤫</label>
              </div>
            )}

            <div>
               <label style={{ color: THEME.textMuted, fontSize: "0.85rem", display: "block", marginBottom: "6px" }}>Date</label>
               <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={todayStr} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid ${THEME.border}`, background: "#111", color: "white", fontSize: "1rem" }} />
            </div>

            <div>
              <label style={{ color: THEME.textMuted, fontSize: "0.85rem", display: "block", marginBottom: "8px" }}>Select Time {loadingTimes && "(Loading...)"}</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {timeSlots.map(slot => {
                   const isTaken = bookedTimes.includes(slot);
                   const isSelected = selectedTime === slot;
                   return (
                     <button key={slot} onClick={() => setSelectedTime(slot)} disabled={isTaken} style={{ padding: "8px 14px", borderRadius: "8px", border: isSelected ? "1px solid #3b82f6" : `1px solid ${THEME.border}`, background: isSelected ? "rgba(59, 130, 246, 0.2)" : (isTaken ? "#333" : "#111"), color: isTaken ? "#555" : (isSelected ? "#60a5fa" : "white"), cursor: isTaken ? "not-allowed" : "pointer", fontWeight: isSelected ? "bold" : "normal", opacity: isTaken ? 0.5 : 1 }}>
                       {slot}
                     </button>
                   );
                })}
              </div>
            </div>

            <button onClick={handleConfirmBooking} disabled={isBooking || !selectedTime || !bookingDate || !customerName} style={{ width: "100%", marginTop: "1rem", padding: "14px", borderRadius: "10px", background: "white", color: "black", fontWeight: "800", fontSize: "1rem", border: "none", cursor: (isBooking || !selectedTime) ? "not-allowed" : "pointer", opacity: (isBooking || !selectedTime) ? 0.7 : 1 }}>
               {isBooking ? "Booking..." : "Confirm Booking"}
            </button>
            
            {message && <p style={{ color: THEME.success, textAlign: "center", marginTop: "1rem", fontWeight: "bold" }}>{message}</p>}
            {error && <p style={{ color: THEME.danger, textAlign: "center", marginTop: "1rem" }}>{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default BarberDetail;