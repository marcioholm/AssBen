const { PrismaClient } = require('./packages/db/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function run() {
    const bens = await prisma.beneficiario.findMany();
    console.log(bens);
    await prisma.$disconnect();
}

run();
