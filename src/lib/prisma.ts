import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  // Check if we are running in a Cloudflare environment with D1 binding
  // In Next.js on Cloudflare, the 'DB' binding is often available as process.env.DB
  const runtimeDB = (process.env as any).DB;

  if (runtimeDB) {
    const adapter = new PrismaD1(runtimeDB);
    return new PrismaClient({ adapter });
  }

  return new PrismaClient();
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
