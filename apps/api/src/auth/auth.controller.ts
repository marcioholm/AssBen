import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AdminLoginDto, BeneficiaryLoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('admin/login')
    @ApiOperation({ summary: 'Login do Administrador' })
    @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
    @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
    adminLogin(@Body() dto: AdminLoginDto) {
        return this.authService.adminLogin(dto);
    }

    @Post('beneficiary/login')
    @ApiOperation({ summary: 'Login do Beneficiário' })
    @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
    @ApiResponse({ status: 401, description: 'Credenciais ou PIN inválidos' })
    beneficiaryLogin(@Body() dto: BeneficiaryLoginDto) {
        return this.authService.beneficiaryLogin(dto);
    }
}
