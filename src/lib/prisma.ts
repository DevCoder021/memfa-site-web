import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaAdapter?: PrismaPg;
};

function getAdapter(): PrismaPg {
  if (!globalForPrisma.prismaAdapter) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL n'est pas defini dans les variables d'environnement.");
    }
    globalForPrisma.prismaAdapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
  }
  return globalForPrisma.prismaAdapter;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: getAdapter(),
    log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

