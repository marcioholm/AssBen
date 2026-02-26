import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityService } from '../security/security.service';
import { CreateBeneficiaryDto, UpdateBeneficiaryDto, ResetPinDto } from './dto/beneficiary.dto';

@Injectable()
export class BeneficiariesService {
    constructor(
        private prisma: PrismaService,
        private security: SecurityService,
    ) { }

    async create(dto: CreateBeneficiaryDto) {
        const cpfHmac = this.security.hashCpfForSearch(dto.cpf);

        // Check if exists
        const existing = await this.prisma.beneficiario.findUnique({
            where: { cpfHmac },
        });
        if (existing) throw new BadRequestException('Beneficiário já cadastrado com este CPF');

        const cpfCrypt = this.security.encryptCpf(dto.cpf);
        const pinHash = await this.security.hashPin(dto.pinInitial);

        return this.prisma.beneficiario.create({
            data: {
                nome: dto.nome,
                cpfCrypt,
                cpfHmac,
                pinHash,
                tipoVinculo: dto.tipoVinculo,
                validade: dto.validade ? new Date(dto.validade) : null,
                associadoEmpresaId: dto.associadoEmpresaId,
                titularId: dto.titularId,
                forcarTrocaPin: true, // Admin generated PIN requires change
                tenantId: 'acebraz'
            }
        });
    }

    async bulkCreate(dto: { associadoEmpresaId: string; termoAceito: boolean; beneficiaries: any[] }) {
        if (!dto.termoAceito) {
            throw new BadRequestException('O termo de responsabilidade deve ser aceito.');
        }

        const validadePadrao = new Date();
        validadePadrao.setFullYear(validadePadrao.getFullYear() + 1); // +12 meses

        const defaultPinHash = await this.security.hashPin('1234'); // Default PIN for bulk import

        let successCount = 0;
        let errors: string[] = [];

        for (const b of dto.beneficiaries) {
            try {
                const cpfHmac = this.security.hashCpfForSearch(b.cpf);
                const existing = await this.prisma.beneficiario.findUnique({ where: { cpfHmac } });

                if (existing) {
                    errors.push(`CPF ${b.cpf} já cadastrado; pulando.`);
                    continue;
                }

                const cpfCrypt = this.security.encryptCpf(b.cpf);

                await this.prisma.beneficiario.create({
                    data: {
                        nome: b.nome,
                        cpfCrypt,
                        cpfHmac,
                        pinHash: defaultPinHash,
                        tipoVinculo: b.tipoVinculo,
                        validade: validadePadrao,
                        status: 'ATIVO',
                        associadoEmpresaId: dto.associadoEmpresaId,
                        forcarTrocaPin: true,
                        tenantId: 'acebraz'
                    }
                });

                successCount++;
            } catch (err) {
                errors.push(`Erro ao processar CPF ${b.cpf}.`);
            }
        }

        return { successCount, errors };
    }

    async findAll() {
        const beneficiaries = await this.prisma.beneficiario.findMany({
            where: { tenantId: 'acebraz' },
            include: { titular: true },
            orderBy: { nome: 'asc' }
        });

        // Mask sensitive data
        return beneficiaries.map(b => ({
            ...b,
            cpfCrypt: undefined, // Never send encrypted raw data
            cpfHmac: '***.***.***-**' // Masked for UI
        }));
    }

    async findOne(id: string) {
        const beneficiary = await this.prisma.beneficiario.findUnique({
            where: { id },
            include: { dependentes: true, titular: true }
        });
        if (!beneficiary) throw new NotFoundException('Beneficiário não encontrado');

        return {
            ...beneficiary,
            cpfCrypt: undefined
        };
    }

    async update(id: string, dto: UpdateBeneficiaryDto) {
        return this.prisma.beneficiario.update({
            where: { id },
            data: {
                ...dto,
                validade: dto.validade ? new Date(dto.validade) : undefined
            }
        });
    }

    async resetPin(id: string, dto: ResetPinDto) {
        const pinHash = await this.security.hashPin(dto.newPin);
        return this.prisma.beneficiario.update({
            where: { id },
            data: {
                pinHash,
                forcarTrocaPin: true,
                tentativasPin: 0,
                bloqueadoAte: null
            }
        });
    }

    async changePin(id: string, newPin: string) {
        const pinHash = await this.security.hashPin(newPin);
        return this.prisma.beneficiario.update({
            where: { id },
            data: {
                pinHash,
                forcarTrocaPin: false,
            },
        });
    }

    async remove(id: string) {
        // LGPD: Anonymization instead of hard delete? 
        // The requirement says "exclusão/anônimização". I'll do a soft-delete/anonymize.
        return this.prisma.beneficiario.update({
            where: { id },
            data: {
                nome: 'USUÁRIO EXCLUÍDO',
                cpfCrypt: 'ANONYMIZED',
                cpfHmac: `DELETED_${Date.now()}`,
                status: 'EXCLUIDO',
                bloqueadoAte: new Date(0)
            }
        });
    }
}
