import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GenerateQrDto {
    // No body needed for now, as it uses the authenticated beneficiary ID
}

export class ValidateQrDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    @IsNotEmpty()
    @IsString()
    token: string;

    @ApiProperty({ example: 'uuid-do-parceiro-token' })
    @IsNotEmpty()
    @IsString()
    parceiroToken: string;
}

export class ValidateCpfPinDto {
    @ApiProperty({ example: '12345678901' })
    @IsNotEmpty()
    @IsString()
    cpf: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    @IsString()
    pin: string;

    @ApiProperty({ example: 'uuid-do-parceiro-token' })
    @IsNotEmpty()
    @IsString()
    parceiroToken: string;
}
