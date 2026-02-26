import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function run() {
    const bens = await prisma.beneficiario.findMany();
    console.log("All Beneficiarios:");
    for (const b of bens) {
        console.log(`- Nome: ${b.nome}, CPF HMAC: ${b.cpfHmac}, PIN Hash: ${b.pinHash}`);
    }

    const hmacKey = process.env.HMAC_KEY || 'hmac_secret_key_random_acebraz_2026_braz';
    const hmac1 = crypto.createHmac('sha256', hmacKey).update("11122233344").digest('hex');
    const hmac2 = crypto.createHmac('sha256', hmacKey).update("111.222.333-44").digest('hex');

    console.log(`\nHMAC generated for 11122233344: ${hmac1}`);
    console.log(`HMAC generated for 111.222.333-44: ${hmac2}`);

    await prisma.$disconnect();
}

run();
