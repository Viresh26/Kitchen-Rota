import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kitchenrota.com' },
    update: {},
    create: {
      email: 'admin@kitchenrota.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'user@kitchenrota.com' },
    update: {},
    create: {
      email: 'user@kitchenrota.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  });

  // Create cleaning tasks
  const tasks = await Promise.all([
    prisma.cleaningTask.upsert({
      where: { id: 'task1' },
      update: {},
      create: {
        id: 'task1',
        name: 'Clean Countertops',
        description: 'Wipe down all kitchen countertops and backsplash',
        frequency: 'DAILY',
        duration: 15,
        priority: 'HIGH',
        active: true,
        createdById: admin.id,
      },
    }),
    prisma.cleaningTask.upsert({
      where: { id: 'task2' },
      update: {},
      create: {
        id: 'task2',
        name: 'Clean Sink',
        description: 'Scrub sink and faucet, polish to shine',
        frequency: 'DAILY',
        duration: 10,
        priority: 'HIGH',
        active: true,
        createdById: admin.id,
      },
    }),
    prisma.cleaningTask.upsert({
      where: { id: 'task3' },
      update: {},
      create: {
        id: 'task3',
        name: 'Sweep Floor',
        description: 'Sweep kitchen floor to remove crumbs and debris',
        frequency: 'DAILY',
        duration: 10,
        priority: 'MEDIUM',
        active: true,
        createdById: admin.id,
      },
    }),
    prisma.cleaningTask.upsert({
      where: { id: 'task4' },
      update: {},
      create: {
        id: 'task4',
        name: 'Mop Floor',
        description: 'Mop kitchen floor with cleaning solution',
        frequency: 'WEEKLY',
        duration: 20,
        priority: 'MEDIUM',
        active: true,
        createdById: admin.id,
      },
    }),
    prisma.cleaningTask.upsert({
      where: { id: 'task5' },
      update: {},
      create: {
        id: 'task5',
        name: 'Clean Microwave',
        description: 'Clean inside and outside of microwave',
        frequency: 'WEEKLY',
        duration: 15,
        priority: 'MEDIUM',
        active: true,
        createdById: admin.id,
      },
    }),
    prisma.cleaningTask.upsert({
      where: { id: 'task6' },
      update: {},
      create: {
        id: 'task6',
        name: 'Clean Refrigerator',
        description: 'Remove expired items, wipe shelves and drawers',
        frequency: 'MONTHLY',
        duration: 30,
        priority: 'LOW',
        active: true,
        createdById: admin.id,
      },
    }),
  ]);

  // Create schedule
  const schedule = await prisma.schedule.upsert({
    where: { id: 'schedule1' },
    update: {},
    create: {
      id: 'schedule1',
      name: 'Weekly Kitchen Rotation',
      description: 'Regular weekly cleaning schedule for all kitchen tasks',
      startDate: new Date(),
      rotationType: 'WEEKLY',
      active: true,
    },
  });

  console.log({ admin, user, tasks, schedule });
  console.log('Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
