import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ValidationService } from './validation.service';
import { ValidateQrDto, ValidateCpfPinDto } from './dto/validation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Validacao')
@Controller('validation')
export class ValidationController {
    constructor(private validationService: ValidationService) { }

    @Post('qr/generate')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Gera um token QR Code (Expira em 2 min)' })
    generateQr(@Req() req) {
        return this.validationService.generateQrToken(req.user.userId);
    }

    @Post('qr/validate')
    @ApiOperation({ summary: 'Valida um token QR Code (Balcão do Parceiro)' })
    @ApiResponse({ status: 200, description: 'Validação processada' })
    validateQr(@Body() dto: ValidateQrDto) {
        return this.validationService.validateQr(dto);
    }

    @Post('cpf-pin/validate')
    @ApiOperation({ summary: 'Valida via CPF+PIN (Fallback)' })
    @ApiResponse({ status: 200, description: 'Validação processada' })
    validateCpfPin(@Body() dto: ValidateCpfPinDto) {
        return this.validationService.validateCpfPin(dto);
    }
}
