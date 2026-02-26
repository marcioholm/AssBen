import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BulkRevalidationDto, BulkInactivateDto } from './dto/revalidation.dto';

@Injectable()
export class RevalidationsService {
    constructor(private prisma: PrismaService) { }

    async getPendingRevalidations() {
        const trintaDiasFrente = new Date();
        trintaDiasFrente.setDate(trintaDiasFrente.getDate() + 30);

        const beneficiaries = await this.prisma.beneficiario.findMany({
            where: {
                tenantId: 'acebraz',
                status: 'ATIVO',
                validade: {
                    lte: trintaDiasFrente
                }
            },
            include: { associadoEmpresa: true },
            orderBy: { validade: 'asc' }
        });

        return beneficiaries.map(b => ({
            id: b.id,
            nome: b.nome,
            cpfHmac: '***.***.***-**',
            tipoVinculo: b.tipoVinculo,
            validade: b.validade,
            empresaNome: b.associadoEmpresa?.nomeFantasia || 'Sem Empresa'
        }));
    }

    async bulkRevalidate(dto: BulkRevalidationDto, adminName: string) {
        if (!dto.beneficiaryIds || dto.beneficiaryIds.length === 0) {
            throw new BadRequestException('Nenhum beneficiário selecionado para revalidação');
        }

        const novaValidade = new Date();
        novaValidade.setFullYear(novaValidade.getFullYear() + 1); // +12 months

        // Execute sequentially or via transaction
        let count = 0;
        for (const bid of dto.beneficiaryIds) {
            await this.prisma.$transaction(async (tx) => {
                await tx.beneficiario.update({
                    where: { id: bid },
                    data: { validade: novaValidade }
                });

                await tx.revalidacaoHistorico.create({
                    data: {
                        beneficiarioId: bid,
                        novaValidade,
                        responsavel: adminName,
                        tenantId: 'acebraz'
                    }
                });
            });
            count++;
        }

        return { message: `Revalidados ${count} beneficiários com sucesso`, novaValidade };
    }

    async bulkInactivate(dto: BulkInactivateDto) {
        if (!dto.beneficiaryIds || dto.beneficiaryIds.length === 0) {
            throw new BadRequestException('Nenhum beneficiário selecionado para inativação');
        }

        const count = await this.prisma.beneficiario.updateMany({
            where: {
                id: { in: dto.beneficiaryIds },
                tenantId: 'acebraz'
            },
            data: {
                status: 'INATIVO'
            }
        });

        return { message: `Inativados ${count.count} beneficiários com sucesso` };
    }
}
