import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('adminpassword123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kitchenrota.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@kitchenrota.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Clear existing tasks to avoid conflicts with IDs or names if necessary
  // For this seed, we use upsert with specific IDs matching the new list.
  
  const tasks = await Promise.all([
    prisma.cleaningTask.upsert({
      where: { id: 'task-restmull' },
      update: {},
      create: {
        id: 'task-restmull',
        name: 'restmull',
        description: 'Take out the general waste (Restmüll) twice a week',
        frequency: 'TWICE_WEEKLY',
        priority: 'HIGH',
        active: true,
        createdById: admin.id,
      },
    }),
    prisma.cleaningTask.upsert({
      where: { id: 'task-trash' },
      update: {},
      create: {
        id: 'task-trash',
        name: 'Throw out the trash',
        description: 'Empty all trash bins in the kitchen',
        frequency: 'WEEKLY',
        priority: 'MEDIUM',
        active: true,
        createdById: admin.id,
      },
    }),
    prisma.cleaningTask.upsert({
      where: { id: 'task-stove' },
      update: {},
      create: {
        id: 'task-stove',
        name: 'clean the stove',
        description: 'Wipe down and scrub the stovetop',
        frequency: 'WEEKLY',
        priority: 'MEDIUM',
        active: true,
        createdById: admin.id,
      },
    }),
    prisma.cleaningTask.upsert({
      where: { id: 'task-oven' },
      update: {},
      create: {
        id: 'task-oven',
        name: 'clean the oven',
        description: 'Clean inside the oven and glass door',
        frequency: 'WEEKLY',
        priority: 'LOW',
        active: true,
        createdById: admin.id,
      },
    }),
    prisma.cleaningTask.upsert({
      where: { id: 'task-table' },
      update: {},
      create: {
        id: 'task-table',
        name: 'clean the dining table',
        description: 'Wipe down the dining table and chairs',
        frequency: 'WEEKLY',
        priority: 'MEDIUM',
        active: true,
        createdById: admin.id,
      },
    }),
    prisma.cleaningTask.upsert({
      where: { id: 'task-supplies' },
      update: {},
      create: {
        id: 'task-supplies',
        name: 'restock kitchen supplies',
        description: 'Check and refill soap, paper towels, and other supplies',
        frequency: 'WEEKLY',
        priority: 'MEDIUM',
        active: true,
        createdById: admin.id,
      },
    }),
  ]);

  console.log({ admin, tasks });
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
