"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    try {
        const c = await prisma.contactMessage.count();
        console.log("Contact count:", c);
    }
    catch (e) {
        console.error("DB Error:", e);
    }
}
main();
//# sourceMappingURL=test-db.js.map