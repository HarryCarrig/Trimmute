// index.js (backend)
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// ── SHOPS / BARBERS ─────────────────────────────────

// Math formula to calculate the distance between two GPS coordinates in miles
function getDistanceInMiles(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  const R = 3958.8; // Radius of the earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Shared handler for /shops and /barbers
async function getShops(req, res) {
  try {
    const userLat = parseFloat(req.query.lat);
    const userLng = parseFloat(req.query.lng);

    const shops = await prisma.shops.findMany();

    let formattedShops = shops.map((shop) => {
      let distance = null;

      if (!isNaN(userLat) && !isNaN(userLng) && shop.lat && shop.lng) {
        distance = getDistanceInMiles(userLat, userLng, shop.lat, shop.lng);
      }

      return {
        ...shop,
        basePrice: shop.base_price_pence ?? shop.basePrice ?? 2000,
        isPartner: shop.is_partner ?? false,
        imageUrl: shop.image_url ?? shop.imageUrl ?? null,
        cover_url: shop.cover_url ?? shop.image_url ?? shop.imageUrl ?? null,
        externalUrl: shop.external_url ?? null,
        supportsSilent: shop.supports_silent ?? false,
        walk_ins_only: shop.walk_ins_only ?? false,
walkInsOnly: shop.walk_ins_only ?? false,
        distance,
      };
    });

    if (!isNaN(userLat) && !isNaN(userLng)) {
      formattedShops.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    } else {
      formattedShops.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.json(formattedShops);
  } catch (error) {
    console.error("GET shops/barbers error:", error);
    res.status(500).json({ error: "Failed to fetch shops" });
  }
}

// Main current route
app.get("/shops", getShops);

// Old/fallback route, so cached frontend bundles do not break
app.get("/barbers", getShops);

// Nearby route
app.get("/barbers/near", async (req, res) => {
  try {
    const userLat = parseFloat(req.query.lat);
    const userLng = parseFloat(req.query.lng);

    if (isNaN(userLat) || isNaN(userLng)) {
      return res.status(400).json({ error: "lat and lng required" });
    }

    const shops = await prisma.shops.findMany();

    const formatted = shops.map((shop) => {
      let distance = null;

      if (shop.lat && shop.lng) {
        distance = getDistanceInMiles(userLat, userLng, shop.lat, shop.lng);
      }

      return {
        ...shop,
        basePrice: shop.base_price_pence ?? shop.basePrice ?? 2000,
        isPartner: shop.is_partner ?? false,
        imageUrl: shop.image_url ?? shop.imageUrl ?? null,
        cover_url: shop.cover_url ?? shop.image_url ?? shop.imageUrl ?? null,
        externalUrl: shop.external_url ?? null,
        supportsSilent: shop.supports_silent ?? false,
        walk_ins_only: shop.walk_ins_only ?? false,
walkInsOnly: shop.walk_ins_only ?? false,
        distance,
      };
    });

    formatted.sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });

    res.json(formatted);
  } catch (error) {
    console.error("GET /barbers/near error:", error);
    res.status(500).json({ error: "Failed to fetch nearby barbers" });
  }
});

// ── CREATE / DELETE SHOPS ───────────────────────────

app.post("/shops", async (req, res) => {
  try {
    const { name, address, imageUrl, basePrice, styles } = req.body || {};

    if (!name || !address || typeof basePrice !== "number") {
      return res
        .status(400)
        .json({ error: "name, address, basePrice (number) required" });
    }

    const shop = await prisma.shops.create({
      data: {
        name,
        address,
        image_url: imageUrl ?? null,
        base_price_pence: basePrice,
        styles: styles ?? [],
      },
    });

    res.status(201).json(shop);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create shop" });
  }
});

app.delete("/shops/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid shop id" });
    }

    const result = await prisma.shops.delete({
      where: { id },
    });

    res.json({ removed: result.id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to delete shop" });
  }
});

// ── BOOKINGS / SLOTS PLACEHOLDER ROUTES ─────────────

app.get("/slots", async (req, res) => {
  res.status(501).json({ error: "Slots route not currently active" });
});

app.post("/bookings", async (req, res) => {
  res.status(501).json({ error: "Bookings route not currently active" });
});

// ── START SERVER ────────────────────────────────────

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`✅ API running on port ${port}`);
});