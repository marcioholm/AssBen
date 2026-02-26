import { Injectable, BadRequestException, UnauthorizedException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityService } from '../security/security.service';
import { ValidateQrDto, ValidateCpfPinDto } from './dto/validation.dto';
import * as crypto from 'crypto';

@Injectable()
export class ValidationService {
    constructor(
        private prisma: PrismaService,
        private security: SecurityService,
        private jwtService: JwtService,
    ) { }

    async generateQrToken(beneficiaryId: string) {
        const nonce = crypto.randomBytes(16).toString('hex');
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

        await this.prisma.nonce.create({
            data: {
                nonce,
                expiresAt,
                tenantId: 'acebraz'
            }
        });

        const token = this.jwtService.sign(
            { sub: beneficiaryId, nonce },
            { expiresIn: '2m' }
        );

        return { token, expiresAt };
    }

    async validateQr(dto: ValidateQrDto) {
        // 1. Find partner
        const partner = await this.prisma.parceiro.findUnique({
            where: { tokenValidacao: dto.parceiroToken },
        });

        if (!partner || !partner.ativo) {
            throw new UnauthorizedException('Parceiro não encontrado ou inativo');
        }

        try {
            // 2. Verify JWT
            const payload = this.jwtService.verify(dto.token);
            const beneficiaryId = payload.sub;
            const nonceValue = payload.nonce;

            // 3. Check anti-replay (nonce)
            const nonce = await this.prisma.nonce.findUnique({
                where: { nonce: nonceValue },
            });

            if (!nonce || nonce.used || nonce.expiresAt < new Date()) {
                await this.logValidation(partner.id, beneficiaryId, 'QR_CODE', 'EXPIRADO');
                throw new BadRequestException('Token expirado ou já utilizado');
            }

            // Mark nonce as used
            await this.prisma.nonce.update({
                where: { id: nonce.id },
                data: { used: true }
            });

            // 4. Check beneficiary
            const beneficiary = await this.prisma.beneficiario.findUnique({
                where: { id: beneficiaryId },
            });

            if (!beneficiary || beneficiary.status !== 'ATIVO') {
                await this.logValidation(partner.id, beneficiaryId, 'QR_CODE', 'NEGADO');
                throw new BadRequestException('Beneficiário inativo ou não encontrado');
            }

            await this.logValidation(partner.id, beneficiaryId, 'QR_CODE', 'APROVADO');

            return {
                resultado: 'APROVADO',
                beneficiario: {
                    nome: beneficiary.nome,
                    tipoVinculo: beneficiary.tipoVinculo,
                    status: beneficiary.status
                },
                partner: partner.nomeFantasia
            };
        } catch (e) {
            if (e instanceof BadRequestException || e instanceof UnauthorizedException) throw e;
            throw new BadRequestException('Token inválido ou expirado');
        }
    }

    async validateCpfPin(dto: ValidateCpfPinDto) {
        const partner = await this.prisma.parceiro.findUnique({
            where: { tokenValidacao: dto.parceiroToken },
        });

        if (!partner || !partner.ativo) {
            throw new UnauthorizedException('Parceiro não encontrado ou inativo');
        }

        const cpfHmac = this.security.hashCpfForSearch(dto.cpf);
        const beneficiary = await this.prisma.beneficiario.findUnique({
            where: { cpfHmac },
        });

        if (!beneficiary || beneficiary.status !== 'ATIVO') {
            await this.logValidation(partner.id, beneficiary?.id || 'unknown', 'CPF_PIN', 'NEGADO');
            throw new BadRequestException('Beneficiário não encontrado ou inativo');
        }

        // Check if blocked (pin lockout)
        if (beneficiary.bloqueadoAte && beneficiary.bloqueadoAte > new Date()) {
            throw new ForbiddenException('Acesso bloqueado temporariamente');
        }

        const isPinValid = await this.security.verifyPin(dto.pin, beneficiary.pinHash);

        if (!isPinValid) {
            await this.prisma.beneficiario.update({
                where: { id: beneficiary.id },
                data: {
                    tentativasPin: { increment: 1 },
                    bloqueadoAte: beneficiary.tentativasPin + 1 >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null
                }
            });
            await this.logValidation(partner.id, beneficiary.id, 'CPF_PIN', 'NEGADO');
            throw new BadRequestException('PIN incorreto');
        }

        // Success
        await this.prisma.beneficiario.update({
            where: { id: beneficiary.id },
            data: { tentativasPin: 0, bloqueadoAte: null }
        });

        await this.logValidation(partner.id, beneficiary.id, 'CPF_PIN', 'APROVADO');

        return {
            resultado: 'APROVADO',
            beneficiario: {
                nome: beneficiary.nome,
                tipoVinculo: beneficiary.tipoVinculo,
                status: beneficiary.status
            },
            partner: partner.nomeFantasia
        };
    }

    private async logValidation(partnerId: string, beneficiaryId: string, metodo: string, resultado: string) {
        if (beneficiaryId === 'unknown') return; // Don't log unknown beneficiary IDs that don't exist
        await this.prisma.validacao.create({
            data: {
                parceiroId: partnerId,
                beneficiarioId: beneficiaryId,
                metodo,
                resultado,
                tenantId: 'acebraz'
            }
        });
    }
}
