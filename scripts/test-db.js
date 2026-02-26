const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    console.log("Checking Admin users...");
    const admins = await prisma.admin.findMany();
    console.log("Admins:", admins);

    console.log("\nChecking Beneficiarios...");
    const bens = await prisma.beneficiario.findMany();
    console.log(bens);
    await prisma.$disconnect();
}

run();
