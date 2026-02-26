import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityService } from '../security/security.service';
import { AdminLoginDto, BeneficiaryLoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private security: SecurityService,
        private jwtService: JwtService,
    ) { }

    async adminLogin(dto: AdminLoginDto) {
        const admin = await this.prisma.admin.findUnique({
            where: { email: dto.email },
        });

        if (!admin || !(await this.security.verifyPassword(dto.password, admin.passwordHash))) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        return {
            access_token: this.jwtService.sign({ sub: admin.id, role: 'ADMIN' }),
            user: { id: admin.id, nome: admin.nome, email: admin.email },
        };
    }

    async beneficiaryLogin(dto: BeneficiaryLoginDto) {
        const cpfHmac = this.security.hashCpfForSearch(dto.cpf);
        const beneficiary = await this.prisma.beneficiario.findUnique({
            where: { cpfHmac },
        });

        if (!beneficiary || beneficiary.status !== 'ATIVO') {
            throw new UnauthorizedException('Beneficiário não encontrado ou inativo');
        }

        // Check if blocked
        if (beneficiary.bloqueadoAte && beneficiary.bloqueadoAte > new Date()) {
            throw new UnauthorizedException(`Conta bloqueada até ${beneficiary.bloqueadoAte.toLocaleString()}`);
        }

        const isPinValid = await this.security.verifyPin(dto.pin, beneficiary.pinHash);

        if (!isPinValid) {
            // Increment attempts
            await this.prisma.beneficiario.update({
                where: { id: beneficiary.id },
                data: {
                    tentativasPin: { increment: 1 },
                    bloqueadoAte: beneficiary.tentativasPin + 1 >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null, // 30 mins block
                }
            });
            throw new UnauthorizedException('PIN inválido');
        }

        // Reset attempts on success
        await this.prisma.beneficiario.update({
            where: { id: beneficiary.id },
            data: { tentativasPin: 0, bloqueadoAte: null }
        });

        return {
            access_token: this.jwtService.sign({ sub: beneficiary.id, role: 'BENEFICIARY' }),
            user: {
                id: beneficiary.id,
                nome: beneficiary.nome,
                tipoVinculo: beneficiary.tipoVinculo,
                forcarTrocaPin: beneficiary.forcarTrocaPin
            },
        };
    }
}
