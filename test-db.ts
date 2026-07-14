import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  try {
    const c = await prisma.contactMessage.count();
    console.log("Contact count:", c);
  } catch (e) {
    console.error("DB Error:", e);
  }
}
main();
