import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BeneficiariesService } from './beneficiaries.service';
import { CreateBeneficiaryDto, UpdateBeneficiaryDto, ResetPinDto, BulkCreateBeneficiariesDto } from './dto/beneficiary.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Beneficiários')
@Controller('beneficiaries')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BeneficiariesController {
    constructor(private readonly beneficiariesService: BeneficiariesService) { }

    @Post()
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Cadastra um beneficiário (Admin)' })
    create(@Body() dto: CreateBeneficiaryDto) {
        return this.beneficiariesService.create(dto);
    }

    @Post('bulk')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Cadastra múltiplos beneficiários (Em lote / CSV)' })
    bulkCreate(@Body() dto: BulkCreateBeneficiariesDto) {
        return this.beneficiariesService.bulkCreate(dto);
    }

    @Get()
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Lista todos os beneficiários (Admin)' })
    findAll() {
        return this.beneficiariesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca detalhes de um beneficiário' })
    findOne(@Param('id') id: string) {
        return this.beneficiariesService.findOne(id);
    }

    @Patch(':id')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Atualiza dados do beneficiário (Admin)' })
    update(@Param('id') id: string, @Body() dto: UpdateBeneficiaryDto) {
        return this.beneficiariesService.update(id, dto);
    }

    @Post(':id/reset-pin')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Reseta o PIN de um beneficiário (Admin)' })
    resetPin(@Param('id') id: string, @Body() dto: ResetPinDto) {
        return this.beneficiariesService.resetPin(id, dto);
    }

    @Post('change-pin')
    @Roles('ADMIN', 'BENEFICIARY')
    @ApiOperation({ summary: 'Troca o PIN do próprio beneficiário' })
    changePin(@Body() dto: { id: string, newPin: string }) {
        return this.beneficiariesService.changePin(dto.id, dto.newPin);
    }

    @Delete(':id')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Anonimiza/Exclui um beneficiário (Admin/LGPD)' })
    remove(@Param('id') id: string) {
        return this.beneficiariesService.remove(id);
    }
}
