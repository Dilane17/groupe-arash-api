import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ 
  connectionString: process.env.DIRECT_URL,
  ssl: true 
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('SEED_ADMIN_EMAIL et SEED_ADMIN_PASSWORD doivent être définis.');
    process.exit(1);
  }

  const existingUser = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`L'utilisateur admin avec l'email ${email} existe déjà.`);
    return;
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const admin = await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
      name: 'Administrateur Principal',
      role: 'ADMIN',
    },
  });

  console.log(`Utilisateur admin créé avec succès : ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
