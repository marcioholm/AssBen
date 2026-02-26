const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

async function main() {
    const databaseUrl = "postgresql://neondb_owner:npg_dJNSI8xtTv7k@ep-green-mountain-aid2xzk0-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
    const hmacKey = 'hmac_secret_key_random_acebraz_2026_braz';

    const prisma = new PrismaClient({
        datasources: { db: { url: databaseUrl } }
    });

    try {
        console.log('--- DIAGNÓSTICO DE PRODUÇÃO ---');

        // 1. Teste de Conexão
        console.log('1. Testando conexão com o Banco...');
        const count = await prisma.beneficiario.count();
        console.log('   Conexão OK! Total de beneficiários:', count);

        // 2. Procurar o José
        console.log('2. Buscando Beneficiário Demo (José)...');
        const joseCpf = '11122233344';
        const joseHmac = crypto.createHmac('sha256', hmacKey).update(joseCpf).digest('hex');

        console.log('   HMAC calculado para José:', joseHmac);

        const jose = await prisma.beneficiario.findUnique({
            where: { cpfHmac: joseHmac }
        });

        if (jose) {
            console.log('   José encontrado! ID:', jose.id);
            console.log('   Status:', jose.status);
            console.log('   Tem PIN Hash?', !!jose.pinHash);
        } else {
            console.log('   ERRO: José não encontrado no banco com este HMAC.');

            // Listar um qualquer para ver o HMAC
            const any = await prisma.beneficiario.findFirst();
            if (any) {
                console.log('   Exemplo de HMAC no banco:', any.cpfHmac);
            }
        }

        console.log('--- FIM DO DIAGNÓSTICO ---');
    } catch (e) {
        console.error('ERRO NO DIAGNÓSTICO:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
