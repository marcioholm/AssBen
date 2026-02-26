import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PartnersService } from './partners.service';
import { CreatePartnerDto, UpdatePartnerDto } from './dto/partner.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Parceiros')
@Controller('partners')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PartnersController {
    constructor(private readonly partnersService: PartnersService) { }

    @Post()
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Cria um novo parceiro (Admin)' })
    create(@Body() createPartnerDto: CreatePartnerDto) {
        return this.partnersService.create(createPartnerDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lista todos os parceiros' })
    findAll() {
        return this.partnersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca um parceiro por ID' })
    findOne(@Param('id') id: string) {
        return this.partnersService.findOne(id);
    }

    @Patch(':id')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Atualiza um parceiro (Admin)' })
    update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
        return this.partnersService.update(id, updatePartnerDto);
    }

    @Delete(':id')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Remove um parceiro (Admin)' })
    remove(@Param('id') id: string) {
        return this.partnersService.remove(id);
    }
}
