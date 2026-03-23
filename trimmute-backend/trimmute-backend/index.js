// index.js (backend)
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// ── SHOPS ───────────────────────────────────────────
// Math formula to calculate the distance between two GPS coordinates in miles
function getDistanceInMiles(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 3958.8; // Radius of the earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

app.get('/shops', async (req, res) => {
  try {
    // 1. Check if the frontend sent GPS coordinates in the URL
    const userLat = parseFloat(req.query.lat);
    const userLng = parseFloat(req.query.lng);

    // 2. Fetch all shops from Supabase
    const shops = await prisma.shops.findMany();

    // 3. Format the shops and calculate distance if coordinates exist
    let formattedShops = shops.map(shop => {
      let distance = null;

      // Make sure we have user coords AND the shop has coords in the DB
      if (!isNaN(userLat) && !isNaN(userLng) && shop.lat && shop.lng) {
        // Use shop.lat and shop.lng to match your Supabase column names!
        distance = getDistanceInMiles(userLat, userLng, shop.lat, shop.lng);
      }

      return {
        ...shop,
        basePrice: shop.base_price_pence ?? shop.basePrice ?? 2000,
        isPartner: shop.is_partner ?? false,
        imageUrl: shop.image_url ?? shop.imageUrl ?? null,
        externalUrl: shop.external_url ?? null,
        supportsSilent: shop.supports_silent ?? false,
        distance: distance // Send the exact distance back to the frontend!
      };
    });

    // 4. If we have a user location, sort the array (closest shops at the top)
    if (!isNaN(userLat) && !isNaN(userLng)) {
      formattedShops.sort((a, b) => {
        if (a.distance === null) return 1; // Push shops with no location to the bottom
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    } else {
      // Fallback: If no location sent, sort alphabetically
      formattedShops.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.json(formattedShops);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch shops" });
  }
  app.get('/barbers', async (req, res) => {
  try {
    const shops = await prisma.shops.findMany();

    const formatted = shops.map(shop => ({
      ...shop,
      basePrice: shop.base_price_pence ?? shop.basePrice ?? 2000,
      isPartner: shop.is_partner ?? false,
      imageUrl: shop.image_url ?? shop.imageUrl ?? null,
      coverurl: shop.cover_url ?? null,
      externalUrl: shop.external_url ?? null,
      supportsSilent: shop.supports_silent ?? false,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("GET /barbers error:", error);
    res.status(500).json({ error: "Failed to fetch barbers" });
  }
});

app.get('/barbers/near', async (req, res) => {
  try {
    const userLat = parseFloat(req.query.lat);
    const userLng = parseFloat(req.query.lng);

    if (isNaN(userLat) || isNaN(userLng)) {
      return res.status(400).json({ error: "lat and lng required" });
    }

    const shops = await prisma.shops.findMany();

    const formatted = shops.map(shop => {
      let distance = null;

      if (shop.lat && shop.lng) {
        distance = getDistanceInMiles(userLat, userLng, shop.lat, shop.lng);
      }

      return {
        ...shop,
        basePrice: shop.base_price_pence ?? shop.basePrice ?? 2000,
        isPartner: shop.is_partner ?? false,
        imageUrl: shop.image_url ?? shop.imageUrl ?? null,
        externalUrl: shop.external_url ?? null,
        supportsSilent: shop.supports_silent ?? false,
        distance
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
});

app.post('/shops', async (req, res) => {
  try {
    const { name, address, imageUrl, basePrice, styles } = req.body || {};
    if (!name || !address || typeof basePrice !== 'number') {
      return res.status(400).json({ error: 'name, address, basePrice (number) required' });
    }
    const shop = await prisma.shop.create({
      data: { name, address, imageUrl: imageUrl ?? null, basePrice, styles: styles ?? [] },
    });
    res.status(201).json(shop);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create shop' });
  }
});

app.delete('/shops/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.booking.deleteMany({ where: { shopId: id } });
  await prisma.slot.deleteMany({ where: { shopId: id } });
  const result = await prisma.shop.delete({ where: { id } });
  res.json({ removed: result.id });
});

// ── SLOTS (read only for now) ───────────────────────
app.get('/slots', async (req, res) => {
  const { shopId } = req.query;
  if (!shopId) return res.status(400).json({ error: 'shopId required' });
  const slots = await prisma.slot.findMany({
    where: { shopId, isBooked: false },
    orderBy: { startsAt: 'asc' },
  });
  res.json(slots);
});

// ── BOOKINGS (simple create) ────────────────────────
app.post('/bookings', async (req, res) => {
  const { shopId, slotId, customer } = req.body || {};
  if (!shopId || !slotId) return res.status(400).json({ error: 'shopId and slotId required' });

  try {
    const booking = await prisma.booking.create({
      data: { shopId, slotId, customer: customer ?? null },
    });
    await prisma.slot.update({ where: { id: slotId }, data: { isBooked: true } });
    res.status(201).json(booking);
  } catch (e) {
    // Unique constraint on slotId prevents double-book
    return res.status(400).json({ error: 'Slot is already booked' });
  }
});

const port = 3001;
app.listen(port, () => console.log(`✅ API running on port ${port}`));
