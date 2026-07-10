const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const app = await prisma.jobApplication.create({
      data: {
        fullName: "Test",
        email: "test@test.com",
        phone: "123",
        message: "test",
        cvUrl: "https://url.com"
      }
    });
    console.log("Success:", app);
  } catch (e) {
    console.error("Error Prisma:", e);
  }
}
test();
