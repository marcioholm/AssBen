import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportFilterDto } from './dto/report-filter.dto';
import { createObjectCsvStringifier } from 'csv-writer';

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) { }

    async getValidations(filter: ReportFilterDto) {
        const where: any = { tenantId: 'acebraz' };

        if (filter.parceiroId) where.parceiroId = filter.parceiroId;
        if (filter.beneficiarioId) where.beneficiarioId = filter.beneficiarioId;
        if (filter.metodo) where.metodo = filter.metodo;
        if (filter.resultado) where.resultado = filter.resultado;

        if (filter.startDate || filter.endDate) {
            where.timestamp = {};
            if (filter.startDate) where.timestamp.gte = new Date(filter.startDate);
            if (filter.endDate) where.timestamp.lte = new Date(filter.endDate);
        }

        return this.prisma.validacao.findMany({
            where,
            include: {
                parceiro: { select: { nomeFantasia: true } },
                beneficiario: { select: { nome: true } }
            },
            orderBy: { timestamp: 'desc' }
        });
    }

    async exportCsv(filter: ReportFilterDto) {
        const data = await this.getValidations(filter);

        const csvStringifier = createObjectCsvStringifier({
            header: [
                { id: 'timestamp', title: 'Data/Hora' },
                { id: 'parceiro', title: 'Parceiro' },
                { id: 'beneficiario', title: 'Beneficiário' },
                { id: 'metodo', title: 'Método' },
                { id: 'resultado', title: 'Resultado' },
            ]
        });

        const records = data.map(v => ({
            timestamp: v.timestamp.toISOString(),
            parceiro: v.parceiro?.nomeFantasia || 'N/A',
            beneficiario: v.beneficiario?.nome || 'Descadastrado/Anônimo',
            metodo: v.metodo,
            resultado: v.resultado
        }));

        return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
    }
}
