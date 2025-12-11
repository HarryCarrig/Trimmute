const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());           // allow all origins for now
app.use(express.json());


// ---------- PERSISTENT BOOKINGS SETUP ----------

const BOOKINGS_FILE = path.join(__dirname, "data", "bookings.json");

// Load existing bookings from file (or create file if missing)
let bookings = [];
(async () => {
  try {
    if (await fs.pathExists(BOOKINGS_FILE)) {
      bookings = await fs.readJSON(BOOKINGS_FILE);
      console.log(`Loaded ${bookings.length} bookings from file`);
    } else {
      await fs.writeJSON(BOOKINGS_FILE, []);
      console.log("Created empty bookings file");
    }
  } catch (err) {
    console.error("Failed to load bookings:", err);
  }
})();

async function saveBookings() {
  try {
    await fs.writeJSON(BOOKINGS_FILE, bookings, { spaces: 2 });
  } catch (err) {
    console.error("Failed to save bookings:", err);
  }
}

// ---------- BARBERS DATA ----------

// Real-ish UK coordinates
const barbers = [
 {
  id: 1,
  name: "Silent Snips",
  address: "12 Quiet Lane, London SW1A 1AA",
  postcode: "SW1A 1AA",
  lat: 51.5014,
  lng: -0.1419,
  basePricePence: 2500,
  styles: ["Silent cut available", "Skin fade"],
  silentCutAvailable: true,
imageUrl: "https://images.unsplash.com/photo-1599382103077-fb3a39e30c54?auto=format&fit=crop&w=600&q=80"
},

  {
    id: 2,
    name: "Trim & Chill",
    address: "44 Mute Street, Manchester M1 1AE",
    postcode: "M1 1AE",
    lat: 53.4794,
    lng: -2.2453,
    basePricePence: 2000,
    styles: ["Silent cut available", "Buzz cut"],
    silentCutAvailable: true,
    imageUrl: null,
  },
  {
    id: 3,
    name: "Quiet Cuts",
    address: "8 Whisper Road, Leeds LS1 4HT",
    postcode: "LS1 4HT",
    lat: 53.8008,
    lng: -1.5491,
    basePricePence: 1800,
    styles: ["Standard cut"],
    silentCutAvailable: false,
    imageUrl: null,
  },
  {
    id: 4,
    name: "No-Chatter Clippers",
    address: "3 Stillwater Road, Birmingham B1 1AA",
    postcode: "B1 1AA",
    lat: 52.4797,
    lng: -1.9027,
    basePricePence: 2200,
    styles: ["Silent cut available", "Beard trim"],
    silentCutAvailable: true,
    imageUrl: null,
  },
  {
    id: 5,
    name: "Mute & Fade",
    address: "19 Calm Crescent, Bristol BS1 3LP",
    postcode: "BS1 3LP",
    lat: 51.4545,
    lng: -2.5879,
    basePricePence: 2300,
    styles: ["Skin fade", "Standard cut"],
    silentCutAvailable: false,
    imageUrl: null,
  },
];

// ---------- DISTANCE HELPERS ----------

function toRad(x) {
  return (x * Math.PI) / 180;
}

function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ---------- ROUTES ----------

// All barbers
app.get("/barbers", (req, res) => {
  res.json(barbers);
});

// Barbers near coordinates
app.get("/barbers/near", (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ error: "Query parameters 'lat' and 'lng' are required" });
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);

  if (Number.isNaN(userLat) || Number.isNaN(userLng)) {
    return res
      .status(400)
      .json({ error: "Invalid 'lat' or 'lng' query parameter" });
  }

  const withDistance = barbers.map((b) => {
    const distance = distanceKm(userLat, userLng, b.lat, b.lng);
    return {
      ...b,
      distanceKm: distance,
    };
  });

  withDistance.sort((a, b) => a.distanceKm - b.distanceKm);

  res.json(withDistance);
});

// Create a booking (PERSISTENT)
app.post("/bookings", async (req, res) => {
  const { barberId, barberName, date, time, customerName } = req.body;

  if (!barberId || !date || !time) {
    return res.status(400).json({
      error: "Fields 'barberId', 'date', and 'time' are required",
    });
  }



  const id = bookings.length ? bookings[bookings.length - 1].id + 1 : 1;

  const booking = {
    id,
    barberId,
    barberName: barberName ?? null,
    customerName: customerName ?? null,
    date,
    time,
    createdAt: new Date().toISOString(),
  };

  bookings.push(booking);
  await saveBookings();

  res.status(201).json(booking);
});

// Get bookings (optional filter)
app.get("/bookings", (req, res) => {
  const { barberId, date } = req.query;

  let result = bookings;

  if (barberId) {
    result = result.filter(
      (b) => String(b.barberId) === String(barberId)
    );
  }

  if (date) {
    result = result.filter((b) => b.date === date);
  }

  res.json(result);
});

// Cancel a booking (PERSISTENT)
app.delete("/bookings/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid booking id" });
  }

  const exists = bookings.some((b) => b.id === id);
  if (!exists) {
    return res.status(404).json({ error: "Booking not found" });
  }

  bookings = bookings.filter((b) => b.id !== id);
  await saveBookings();

  res.status(204).send();
});

// ---------- START SERVER ----------

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
