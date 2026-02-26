import { Controller, Delete, Param, UseGuards, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { BeneficiariesService } from '../beneficiaries/beneficiaries.service';

@ApiTags('LGPD')
@Controller('lgpd')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class LgpdController {
    constructor(private beneficiariesService: BeneficiariesService) { }

    @Delete('beneficiary/:id')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Exclui/Anonimiza dados de um beneficiário conforme LGPD (Admin)' })
    async anonymize(@Param('id') id: string) {
        return this.beneficiariesService.remove(id);
    }
}
