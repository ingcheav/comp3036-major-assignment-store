import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

/**
 * Singleton Prisma client for the admin dashboard.
 * Attaches to globalThis in non-production environments to prevent
 * exhausting database connections during Next.js hot-module reloading.
 * Enables query logging in development for debugging.
 */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ log: process.env.NODE_ENV === "development" ? ["query"] : [] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
