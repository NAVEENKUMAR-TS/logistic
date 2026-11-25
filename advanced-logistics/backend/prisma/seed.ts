import { prisma } from '../src/database/client.js';

export async function seed(): Promise<void> {
  console.log('[Seed] Starting idempotent database seed...');

  // 1. Seed Users (idempotent via unique email upsert)
  const users = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Carol White',
      email: 'carol.white@example.com',
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name },
      create: u,
    });
  }
  console.log(`[Seed] Successfully seeded/verified ${users.length} users.`);

  // 2. Seed Items (idempotent via id upsert)
  const items = [
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      title: 'Heavy Duty Warehouse Pallet',
    },
    {
      id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      title: 'Autonomous Delivery Drone X1',
    },
    {
      id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      title: 'Cellular Fleet GPS Tracker',
    },
  ];

  for (const item of items) {
    await prisma.item.upsert({
      where: { id: item.id },
      update: { title: item.title },
      create: item,
    });
  }
  console.log(`[Seed] Successfully seeded/verified ${items.length} items.`);

  // 3. Seed Ratings (idempotent via compound unique [userId, itemId] upsert)
  const ratings = [
    {
      id: '99999999-9999-9999-9999-999999999901',
      userId: users[0].id,
      itemId: items[0].id,
      score: 5,
    },
    {
      id: '99999999-9999-9999-9999-999999999902',
      userId: users[1].id,
      itemId: items[0].id,
      score: 4,
    },
    {
      id: '99999999-9999-9999-9999-999999999903',
      userId: users[0].id,
      itemId: items[1].id,
      score: 4,
    },
    {
      id: '99999999-9999-9999-9999-999999999904',
      userId: users[2].id,
      itemId: items[1].id,
      score: 5,
    },
    {
      id: '99999999-9999-9999-9999-999999999905',
      userId: users[1].id,
      itemId: items[2].id,
      score: 3,
    },
  ];

  for (const r of ratings) {
    await prisma.rating.upsert({
      where: {
        userId_itemId: {
          userId: r.userId,
          itemId: r.itemId,
        },
      },
      update: { score: r.score },
      create: r,
    });
  }
  console.log(`[Seed] Successfully seeded/verified ${ratings.length} ratings.`);
  console.log('[Seed] Seeding finished successfully.');
}

if (process.env.NODE_ENV !== 'test') {
  seed()
    .catch((err) => {
      console.error('[Seed Error]:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

