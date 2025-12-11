// prisma/seed.mjs
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Wipe existing (safe for dev)
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.shop.deleteMany();

  // Create a shop
  const shop = await prisma.shop.create({
    data: {
      name: 'Fade Masters',
      address: '12 King St, London',
      imageUrl: 'https://i.pravatar.cc/100?img=12',
      basePrice: 2000,
      styles: ['Skin Fade', 'Buzz Cut', 'Taper'],
    },
  });

  // Create a few slots today/tomorrow
  const now = new Date();
  const slots = Array.from({ length: 6 }).map((_, i) => {
    const start = new Date(now);
    start.setHours(10 + i, 0, 0, 0); // 10:00, 11:00, ...
    return {
      shopId: shop.id,
      startsAt: start,
      mins: 45,
    };
  });

  await prisma.slot.createMany({ data: slots });

  console.log('✅ Seeded:', { shop: shop.name, slots: slots.length });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
