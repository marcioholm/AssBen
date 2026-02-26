import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RevalidationsService } from './revalidations.service';
import { BulkRevalidationDto, BulkInactivateDto } from './dto/revalidation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Revalidações')
@Controller('revalidations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RevalidationsController {
    constructor(private readonly revalidationsService: RevalidationsService) { }

    @Get('pending')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Lista beneficiários pendentes de revalidação' })
    getPending() {
        return this.revalidationsService.getPendingRevalidations();
    }

    @Post('bulk-revalidate')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Revalida múltiplos beneficiários' })
    bulkRevalidate(@Body() dto: BulkRevalidationDto, @Request() req) {
        // req.user contains the decoded JWT. For this MVP, we pass admin ID as name.
        const adminName = req.user?.sub || 'Admin Desconhecido';
        return this.revalidationsService.bulkRevalidate(dto, adminName);
    }

    @Post('bulk-inactivate')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Inativa múltiplos beneficiários' })
    bulkInactivate(@Body() dto: BulkInactivateDto) {
        return this.revalidationsService.bulkInactivate(dto);
    }
}
