const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function main() {
    const databaseUrl = "postgresql://neondb_owner:npg_dJNSI8xtTv7k@ep-green-mountain-aid2xzk0-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
    const prisma = new PrismaClient({
        datasources: {
            db: { url: databaseUrl }
        }
    });

    try {
        console.log('Iniciando carga no Neon (MIGRAÇÃO PARA BCRYPT)...');
        const tenantId = 'acebraz';
        const encryptionKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
        const hmacKey = 'hmac_secret_key_random_acebraz_2026_braz';

        const encrypt = (val) => {
            const iv = crypto.randomBytes(12);
            const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'hex'), iv);
            let enc = cipher.update(val, 'utf8', 'hex');
            enc += cipher.final('hex');
            const authTag = cipher.getAuthTag().toString('hex');
            return `${iv.toString('hex')}:${authTag}:${enc}`;
        };

        const hashHmac = (val) => crypto.createHmac('sha256', hmacKey).update(val).digest('hex');

        // 1. Admin
        console.log('Criando Admin...');
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

        // 2. Fictitious Companies
        console.log('Criando Empresas...');
        const companies = [
            { name: "Supermercado São José", cnpj: "11222333000144", cat: "Alimentação" },
            { name: "Posto Avenida", cnpj: "55666777000188", cat: "Combustíveis" },
            { name: "Farmácia Vida", cnpj: "99888777000166", cat: "Saúde" },
            { name: "Padaria Pão de Mel", cnpj: "44333222000111", cat: "Alimentação" },
            { name: "Loja de Roupas Estilo", cnpj: "77666555000133", cat: "Moda" },
        ];

        const pinHash = await bcrypt.hash('1234', 10);

        for (const company of companies) {
            const p = await prisma.parceiro.upsert({
                where: { cnpj: company.cnpj },
                update: { statusWorkFlow: 'ATIVO' },
                create: {
                    cnpj: company.cnpj,
                    nomeFantasia: company.name,
                    categoria: company.cat,
                    regrasDesconto: '10% de desconto',
                    statusWorkFlow: 'ATIVO',
                    tenantId
                }
            });

            for (let i = 1; i <= 2; i++) {
                const titularCpf = (10000000000 + Math.floor(Math.random() * 90000000000)).toString();
                const titular = await prisma.beneficiario.create({
                    data: {
                        nome: `Titular ${i} (${company.name})`,
                        cpfCrypt: encrypt(titularCpf),
                        cpfHmac: hashHmac(titularCpf),
                        pinHash: pinHash,
                        tipoVinculo: 'FUNCIONARIO',
                        status: 'ATIVO',
                        associadoEmpresaId: p.id,
                        forcarTrocaPin: true,
                        tenantId
                    }
                });

                for (let j = 1; j <= 3; j++) {
                    const depCpf = (10000000000 + Math.floor(Math.random() * 90000000000)).toString();
                    await prisma.beneficiario.create({
                        data: {
                            nome: `Dependente ${j} de ${titular.nome}`,
                            cpfCrypt: encrypt(depCpf),
                            cpfHmac: hashHmac(depCpf),
                            pinHash: pinHash,
                            tipoVinculo: 'DEPENDENTE',
                            status: 'ATIVO',
                            associadoEmpresaId: p.id,
                            titularId: titular.id,
                            forcarTrocaPin: true,
                            tenantId
                        }
                    });
                }
            }
        }

        // 3. User Demo from README
        console.log('Criando Usuário Demo (José)...');
        const p1 = await prisma.parceiro.upsert({
            where: { cnpj: '12345678000100' },
            update: {},
            create: {
                cnpj: '12345678000100',
                nomeFantasia: 'Restaurante Central',
                categoria: 'Gastronomia',
                regrasDesconto: '15% de desconto',
                tenantId
            }
        });

        const pinDemo = await bcrypt.hash('1234', 10);
        await prisma.beneficiario.upsert({
            where: { cpfHmac: hashHmac('11122233344') },
            update: { pinHash: pinDemo, forcarTrocaPin: true },
            create: {
                nome: 'José Beneficiário',
                cpfCrypt: encrypt('11122233344'),
                cpfHmac: hashHmac('11122233344'),
                pinHash: pinDemo,
                tipoVinculo: 'ASSOCIADO',
                status: 'ATIVO',
                associadoEmpresaId: p1.id,
                forcarTrocaPin: true,
                tenantId
            }
        });

        console.log('Carga finalizada com sucesso no Neon!');

        const count = await prisma.beneficiario.count();
        console.log('Total de Beneficiários no Banco:', count);

    } catch (e) {
        console.error('Erro na carga:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
