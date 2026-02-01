// backend/server.js

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

console.log("RUNNING FILE:", __filename);

const express = require("express");
const cors = require("cors");

const pool = require("./db");

const app = express();

// ---------------- ENV FLAGS ----------------
const IS_PROD = process.env.NODE_ENV === "production";
const ENABLE_DB_TEST =
  String(process.env.ENABLE_DB_TEST || "").toLowerCase() === "true";

// /debug & /bookings-db-test should NOT be public unless you allow it explicitly
const ALLOW_DEBUG = !IS_PROD || String(process.env.ALLOW_DEBUG || "").toLowerCase() === "true";

console.log("IS_PROD =", IS_PROD);
console.log("ENABLE_DB_TEST =", ENABLE_DB_TEST);
console.log("ALLOW_DEBUG =", ALLOW_DEBUG);
console.log("Has DATABASE_URL =", !!process.env.DATABASE_URL);

// ---------------- CORS ----------------

const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.FRONTEND_URLS
    ? process.env.FRONTEND_URLS.split(",").map(s => s.trim())
    : []),
].filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow curl/postman
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], // ✅ FIX
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // ✅ works reliably (preflight)


app.use(express.json());

// ---------------- BASIC ROUTES ----------------
app.get("/", (req, res) => {
  res.send("Trimmute backend is running 🔥");
});

// ---------------- DB TEST ROUTE (OPTIONAL) ----------------
if (ENABLE_DB_TEST) {
  app.get("/db-test", async (req, res) => {
    try {
      const result = await pool.query("select 1 as ok");
      res.json({ connected: true, ok: result.rows[0].ok });
    } catch (err) {
      console.error("DB TEST ERROR:", err);
      res.status(500).json({ connected: false, error: err.message });
    }
  });
}

// ---------------- DEBUG ROUTES (OPTIONAL) ----------------
if (ALLOW_DEBUG) {
  app.get("/debug", (req, res) => {
    res.json({
      ok: true,
      env: {
        IS_PROD,
        ENABLE_DB_TEST,
        ALLOW_DEBUG,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        allowedOrigins,
      },
      routes: [
        "GET /",
        "GET /barbers",
        "GET /barbers/near",
        "GET /bookings",
        "POST /bookings",
        "DELETE /bookings/:id",
        ENABLE_DB_TEST ? "GET /db-test" : "(db-test disabled)",
        "GET /bookings-db-test",
      ],
      time: new Date().toISOString(),
    });
  });

  app.get("/bookings-db-test", async (req, res) => {
    try {
      const result = await pool.query(
        `select
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
         order by id desc
         limit 10`
      );
      res.json({ ok: true, rows: result.rows });
    } catch (err) {
      console.error("BOOKINGS DB TEST ERROR:", err);
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
// ----------- BARBER ROUTES (DB-backed) -----------

app.get("/barbers", async (req, res) => {
  try {
    const result = await pool.query(`
      select
        id,
        name,
        address,
        postcode,
        image_url as "imageUrl",
        base_price_pence as "basePricePence",
        supports_silent as "supportsSilent",
        lat,
        lng,
        styles
      from public.shops
      order by id asc
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("GET /barbers error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

app.get("/barbers/near", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (lat == null || lng == null) {
      return res.status(400).json({ error: "Query parameters 'lat' and 'lng' are required" });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    if (Number.isNaN(userLat) || Number.isNaN(userLng)) {
      return res.status(400).json({ error: "Invalid 'lat' or 'lng'" });
    }

    // pull all shops, then compute distance in JS
    const result = await pool.query(`
      select
        id,
        name,
        address,
        postcode,
        image_url as "imageUrl",
        base_price_pence as "basePricePence",
        supports_silent as "supportsSilent",
        lat,
        lng,
        styles
      from public.shops
      where lat is not null and lng is not null
      order by id asc
    `);

    const withDistance = result.rows
      .map((s) => ({
        ...s,
        distanceKm: distanceKm(userLat, userLng, Number(s.lat), Number(s.lng)),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json(withDistance);
  } catch (err) {
    console.error("GET /barbers/near error:", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});


// Public: returns booked time slots for a barber on a date (NO personal data)
app.get("/availability", async (req, res) => {
  try {
    const { barberId, date } = req.query;
    if (!barberId || !date) {
      return res.status(400).json({ error: "barberId and date are required" });
    }

    const result = await pool.query(
      `SELECT time
       FROM bookings
       WHERE barber_id = $1 AND date = $2
       ORDER BY time ASC`,
      [barberId, date]
    );

    const bookedTimes = result.rows.map(r => r.time);

    res.json({ barberId, date, bookedTimes });
  } catch (e) {
    console.error("availability error:", e);
    res.status(500).json({ error: "server error" });
  }
});


// ---------------- BOOKINGS (SUPABASE / POSTGRES) ----------------

const crypto = require("crypto");

// helper to read Bearer token
function getBearerToken(req) {
  const h = req.headers.authorization || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : "";
}

// =====================
// CREATE BOOKING
// =====================
app.post("/bookings", async (req, res) => {
  try {
    const {
      barberId,
      barberName,
      customerName,
      date,
      time,
      isSilent = false,
      requirements = null,
      customerToken,
    } = req.body || {};

    
// determine if barber supports silent cuts (authoritative from DB)
const shopResult = await pool.query(
  `select supports_silent from public.shops where id = $1 limit 1`,
  [Number(barberId)]
);

const supportsSilent = !!shopResult.rows[0]?.supports_silent;

// force silent off if not supported
const finalIsSilent = supportsSilent ? !!isSilent : false;
const finalRequirements = supportsSilent ? requirements : null;


    if (!barberId || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const token =
      (typeof customerToken === "string" && customerToken.trim()) ||
      crypto.randomUUID();

    // prevent double booking
    const existing = await pool.query(
      `select id from public.bookings
       where barber_id=$1 and date=$2 and time=$3
       limit 1`,
      [String(barberId), date, time]
    );

    if (existing.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "That time slot is already booked" });
    }

    const result = await pool.query(
      `insert into public.bookings
        (barber_id, barber_name, customer_name, date, time, is_silent, requirements, customer_token)
       values
        ($1,$2,$3,$4,$5,$6,$7,$8)
       returning
        id,
        barber_id as "barberId",
        barber_name as "barberName",
        customer_name as "customerName",
        date::text as "date",
        time::text as "time",
        created_at as "createdAt",
        customer_token as "customerToken"`,
      [
        String(barberId),
        barberName ?? null,
        customerName ?? null,
        date,
        time,
        finalIsSilent,
        finalRequirements,
        token,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("POST /bookings error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =====================
// CUSTOMER: MY BOOKINGS
// =====================
app.get("/my-bookings", async (req, res) => {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(
      `select
         id,
         barber_id as "barberId",
         barber_name as "barberName",
         customer_name as "customerName",
         date::text as "date",
         time::text as "time",
         created_at as "createdAt"
       from public.bookings
       where customer_token=$1
       order by date desc, time desc`,
      [token]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET /my-bookings error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =====================
// BARBER: LIST BOOKINGS (TEMP MVP – API KEY)
// =====================
app.get("/bookings", async (req, res) => {
  try {
    const token = getBearerToken(req);
    if (token !== process.env.BARBER_API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { date } = req.query;

    let query = `
      select
        id,
        barber_id as "barberId",
        barber_name as "barberName",
        customer_name as "customerName",
        date::text as "date",
        time::text as "time",
        created_at as "createdAt"
      from public.bookings
    `;
    const params = [];

    if (date) {
      query += " where date=$1";
      params.push(date);
    }

    query += " order by time asc";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("GET /bookings error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =====================
// BARBER: CANCEL BOOKING
// =====================
app.delete("/bookings/:id", async (req, res) => {
  try {
    const token = getBearerToken(req);
    if (token !== process.env.BARBER_API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    await pool.query(`delete from public.bookings where id=$1`, [id]);
    res.status(204).end();
  } catch (err) {
    console.error("DELETE /bookings error:", err);
    res.status(500).json({ error: err.message });
  }
});


// ---------- START SERVER ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
