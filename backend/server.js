console.log("RUNNING FILE:", __filename);

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

const IS_PROD = process.env.NODE_ENV === "production";
// If you want /db-test & /debug available on Render, set ALLOW_DEBUG=true in Render env vars
const ALLOW_DEBUG = !IS_PROD || process.env.ALLOW_DEBUG === "true";

const pool = require("./db");

const app = express();

// ---------------- CORS ----------------
const allowedOrigins = [
  "http://localhost:5173", // Vite dev
  "http://localhost:3000", // local backend direct
  process.env.FRONTEND_URL, // e.g. https://trimmute.vercel.app
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow curl/postman/no-origin requests
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Not allowed by CORS: ${origin}`));
    },
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// IMPORTANT: avoid "/*" (it can crash path-to-regexp on some setups)
app.options(/.*/, cors());

app.use(express.json());

// ---------------- Basic routes ----------------
app.get("/", (req, res) => {
  res.send("Trimmute backend is running 🔥");
});

if (ALLOW_DEBUG) {
  app.get("/debug", (req, res) => {
    res.json({
      ok: true,
      env: { IS_PROD, ALLOW_DEBUG, hasDatabaseUrl: !!process.env.DATABASE_URL },
      routes: [
        "GET /",
        "GET /barbers",
        "GET /barbers/near",
        "GET /bookings",
        "POST /bookings",
        "DELETE /bookings/:id",
        "GET /db-test (debug)",
        "GET /bookings-db-test (debug)",
      ],
      time: new Date().toISOString(),
    });
  });

  app.get("/db-test", async (req, res) => {
    try {
      const result = await pool.query("select 1 as ok");
      res.json({ connected: true, ok: result.rows[0].ok });
    } catch (err) {
      console.error(err);
      res.status(500).json({ connected: false, error: err.message });
    }
  });

  app.get("/bookings-db-test", async (req, res) => {
    try {
      const result = await pool.query(
        "select * from public.bookings order by id desc limit 5"
      );
      res.json({ ok: true, rows: result.rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false, error: err.message });
    }
  });
}

// ---------- BARBERS DATA ----------
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
    imageUrl: "https://placehold.co/600x400?text=Trimmute+Barbers",
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
  const R = 6371;
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

// ---------- BARBER ROUTES ----------
app.get("/barbers", (req, res) => {
  res.json(barbers);
});

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
    return res.status(400).json({ error: "Invalid 'lat' or 'lng'" });
  }

  const withDistance = barbers
    .map((b) => ({
      ...b,
      distanceKm: distanceKm(userLat, userLng, b.lat, b.lng),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  res.json(withDistance);
});

// ---------------- BOOKINGS (SUPABASE / POSTGRES) ----------------

// Create booking (supports isSilent + requirements)
app.post("/bookings", async (req, res) => {
  const {
    barberId,
    barberName,
    date,
    time,
    customerName,
    isSilent = false,
    requirements = null,
  } = req.body;

  if (!barberId || !date || !time || !customerName) {
    return res.status(400).json({
      error:
        "Fields 'barberId', 'date', 'time', and 'customerName' are required",
    });
  }

  const cleanName =
    typeof customerName === "string" ? customerName.trim() : "";
  if (!cleanName) {
    return res.status(400).json({ error: "customerName cannot be empty" });
  }

  const cleanRequirements =
    typeof requirements === "string" && requirements.trim()
      ? requirements.trim()
      : null;

  try {
    const result = await pool.query(
      `
      insert into public.bookings
        (barber_id, barber_name, customer_name, date, time, is_silent, requirements)
      values
        ($1, $2, $3, $4, $5, $6, $7)
      returning
        id,
        barber_id as "barberId",
        barber_name as "barberName",
        customer_name as "customerName",
        date::text as "date",
        time::text as "time",
        is_silent as "isSilent",
        requirements as "requirements",
        created_at as "createdAt"
      `,
      [
        barberId,
        barberName ?? null,
        cleanName,
        date,
        time,
        Boolean(isSilent),
        cleanRequirements,
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err && err.code === "23505") {
      return res.status(409).json({ error: "That time slot is already booked" });
    }
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

// List bookings (optional filters)
app.get("/bookings", async (req, res) => {
  const { barberId, date } = req.query;

  try {
    let sql = `
      select
        id,
        barber_id as "barberId",
        barber_name as "barberName",
        customer_name as "customerName",
        date::text as "date",
        time::text as "time",
        is_silent as "isSilent",
        requirements,
        created_at as "createdAt"
      from public.bookings
    `;

    const params = [];
    const where = [];

    if (barberId) {
      params.push(barberId);
      where.push(`barber_id = $${params.length}`);
    }

    if (date) {
      params.push(date);
      where.push(`date = $${params.length}`);
    }

    if (where.length) sql += ` where ` + where.join(" and ");
    sql += ` order by created_at desc`;

    const result = await pool.query(sql, params);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

// Cancel booking
app.delete("/bookings/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid booking id" });
  }

  try {
    const result = await pool.query(
      `delete from public.bookings where id = $1 returning id`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
