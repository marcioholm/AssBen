import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerDto, UpdatePartnerDto } from './dto/partner.dto';

@Injectable()
export class PartnersService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreatePartnerDto) {
        return this.prisma.parceiro.create({
            data: {
                ...dto,
                tenantId: 'acebraz'
            }
        });
    }

    async findAll() {
        return this.prisma.parceiro.findMany({
            where: { tenantId: 'acebraz' },
            orderBy: { nomeFantasia: 'asc' }
        });
    }

    async findOne(id: string) {
        const partner = await this.prisma.parceiro.findUnique({
            where: { id },
        });
        if (!partner) throw new NotFoundException('Parceiro não encontrado');
        return partner;
    }

    async update(id: string, dto: UpdatePartnerDto) {
        return this.prisma.parceiro.update({
            where: { id },
            data: dto
        });
    }

    async remove(id: string) {
        return this.prisma.parceiro.delete({
            where: { id },
        });
    }
}
