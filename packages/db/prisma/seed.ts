import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
    const tenantId = 'acebraz';
    const encryptionKey = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const hmacKey = process.env.HMAC_KEY || 'hmac_secret_key_random_acebraz_2026_braz';

    const encrypt = (val: string) => {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'hex'), iv);
        let enc = cipher.update(val, 'utf8', 'hex');
        enc += cipher.final('hex');
        const authTag = cipher.getAuthTag().toString('hex');
        return `${iv.toString('hex')}:${authTag}:${enc}`;
    };

    const hashHmac = (val: string) => crypto.createHmac('sha256', hmacKey).update(val).digest('hex');

    // 1. Create Admin
    const adminHash = await bcrypt.hash('adminpassword', 10);
    await prisma.admin.upsert({
        where: { email: 'admin@acebraz.com.br' },
        update: { passwordHash: adminHash },
        create: {
            nome: 'Admin ACEBRAZ',
            email: 'admin@acebraz.com.br',
            passwordHash: adminHash,
            tenantId
        }
    });

    // 2. Create Companies
    const p1 = await prisma.parceiro.upsert({
        where: { cnpj: '12345678000100' },
        update: {},
        create: {
            cnpj: '12345678000100',
            nomeFantasia: 'Restaurante Central',
            categoria: 'Gastronomia',
            regrasDesconto: '15% de desconto no almoço',
            tenantId
        }
    });

    // 3. Create Beneficiaries
    const pin = await argon2.hash('1234', { type: argon2.argon2id });

    // ASSOCIADO (Test User from README)
    await prisma.beneficiario.upsert({
        where: { cpfHmac: hashHmac('11122233344') },
        update: { pinHash: pin, forcarTrocaPin: true },
        create: {
            nome: 'José Beneficiário',
            cpfCrypt: encrypt('11122233344'),
            cpfHmac: hashHmac('11122233344'),
            pinHash: pin,
            tipoVinculo: 'ASSOCIADO',
            status: 'ATIVO',
            associadoEmpresaId: p1.id,
            forcarTrocaPin: true,
            tenantId
        }
    });

    // Another one without forced change for reference
    const pinFinal = await argon2.hash('4321', { type: argon2.argon2id });
    await prisma.beneficiario.upsert({
        where: { cpfHmac: hashHmac('55566677788') },
        update: {},
        create: {
            nome: 'Maria Estável',
            cpfCrypt: encrypt('55566677788'),
            cpfHmac: hashHmac('55566677788'),
            pinHash: pinFinal,
            tipoVinculo: 'ASSOCIADO',
            status: 'ATIVO',
            associadoEmpresaId: p1.id,
            forcarTrocaPin: false,
            tenantId
        }
    });

    console.log('Seed completed successfully');
}

main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
