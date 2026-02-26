import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { ReportFilterDto } from './dto/report-filter.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Response } from 'express';
import type { Response as ExpressResponse } from 'express';

@ApiTags('Relatórios')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('validations')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Lista logs de validação (Admin)' })
    getValidations(@Query() filter: ReportFilterDto) {
        return this.reportsService.getValidations(filter);
    }

    @Get('validations/csv')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Exporta logs de validação em CSV (Admin)' })
    async exportCsv(@Query() filter: ReportFilterDto, @Res() res: ExpressResponse) {
        const csv = await this.reportsService.exportCsv(filter);
        res.header('Content-Type', 'text/csv');
        res.attachment(`relatorio_validacoes_${Date.now()}.csv`);
        return res.send(csv);
    }
}
