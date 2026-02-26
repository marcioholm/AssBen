import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

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

    // 2. Create Fictitious Companies
    const fictitiousCompanies = [
        { name: "Supermercado São José", cnpj: "11222333000144", cat: "Alimentação" },
        { name: "Posto Avenida", cnpj: "55666777000188", cat: "Combustíveis" },
        { name: "Farmácia Vida", cnpj: "99888777000166", cat: "Saúde" },
        { name: "Padaria Pão de Mel", cnpj: "44333222000111", cat: "Alimentação" },
        { name: "Loja de Roupas Estilo", cnpj: "77666555000133", cat: "Moda" },
    ];

    const pinAssociado = await bcrypt.hash('1234', 10);
    const dependentsSuffixes = ["Filho(a)", "Cônjuge", "Enteado(a)"];

    for (const company of fictitiousCompanies) {
        const p = await prisma.parceiro.upsert({
            where: { cnpj: company.cnpj },
            update: {
                nomeFantasia: company.name,
                categoria: company.cat,
                regrasDesconto: '10% de desconto em produtos selecionados',
                statusWorkFlow: 'ATIVO'
            },
            create: {
                cnpj: company.cnpj,
                nomeFantasia: company.name,
                categoria: company.cat,
                regrasDesconto: '10% de desconto em produtos selecionados',
                statusWorkFlow: 'ATIVO',
                tenantId
            }
        });

        // 2 Employees per company
        for (let i = 1; i <= 2; i++) {
            const titularCpf = (Math.floor(Math.random() * 90000000000) + 10000000000).toString();
            const titularName = `Funcionario ${i} da ${company.name}`;

            const titular = await prisma.beneficiario.upsert({
                where: { cpfHmac: hashHmac(titularCpf) },
                update: {},
                create: {
                    nome: titularName,
                    cpfCrypt: encrypt(titularCpf),
                    cpfHmac: hashHmac(titularCpf),
                    pinHash: pinAssociado,
                    tipoVinculo: 'FUNCIONARIO',
                    status: 'ATIVO',
                    associadoEmpresaId: p.id,
                    forcarTrocaPin: true,
                    tenantId
                }
            });

            // 3 Dependents per employee
            for (let j = 0; j < 3; j++) {
                const depCpf = (Math.floor(Math.random() * 90000000000) + 10000000000).toString();
                const depName = `Dependente ${j + 1} (${dependentsSuffixes[j]}) de ${titularName}`;

                await prisma.beneficiario.upsert({
                    where: { cpfHmac: hashHmac(depCpf) },
                    update: {},
                    create: {
                        nome: depName,
                        cpfCrypt: encrypt(depCpf),
                        cpfHmac: hashHmac(depCpf),
                        pinHash: pinAssociado,
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

    // 3. Create Specific Test Users (Legacy/README)
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

    const pin = await bcrypt.hash('1234', 10);

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
    const pinFinal = await bcrypt.hash('4321', 10);
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
