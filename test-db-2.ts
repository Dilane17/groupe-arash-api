import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
      connectionTimeoutMillis: 30000,
    });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter } as any);
    const c = await prisma.contactMessage.count();
    console.log("Contact count:", c);
  } catch (e) {
    console.error("DB Error:", e);
  }
}
main();
