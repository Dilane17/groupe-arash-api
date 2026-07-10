"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
    connectionTimeoutMillis: 30000,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const admin = await prisma.adminUser.findFirst();
    if (!admin) {
        console.log("Aucun admin trouvé, impossible de lier les articles.");
        return;
    }
    await prisma.jobOffer.upsert({
        where: { slug: 'ingenieur-recyclage-textile' },
        update: {},
        create: {
            title: 'Ingénieur en Recyclage Textile',
            slug: 'ingenieur-recyclage-textile',
            department: 'Production',
            location: 'Cotonou, Bénin',
            type: 'CDI',
            description: 'Nous recherchons un ingénieur passionné pour développer de nouveaux processus de valorisation textile.',
            requirements: '- Bac+5 en ingénierie des matériaux\n- 3 ans d\'expérience\n- Passion pour l\'écologie',
            isActive: true,
        }
    });
    await prisma.newsArticle.upsert({
        where: { slug: 'lancement-nouvelle-usine' },
        update: {},
        create: {
            title: 'Lancement de notre nouvelle usine de tri',
            slug: 'lancement-nouvelle-usine',
            excerpt: 'Une étape majeure pour l\'économie circulaire au Bénin.',
            content: 'Nous sommes fiers d\'annoncer l\'ouverture de notre nouvelle usine à Cotonou, capable de trier 50 tonnes de textiles par mois...',
            category: 'ACTUALITE',
            isPublished: true,
            publishedAt: new Date(),
            authorId: admin.id,
        }
    });
    console.log("Données de test injectées !");
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=test-data.js.map