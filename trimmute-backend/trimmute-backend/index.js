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
app.get('/shops', async (req, res) => {
  const shops = await prisma.shop.findMany({
    orderBy: { name: 'asc' },
  });
  res.json(shops);
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
