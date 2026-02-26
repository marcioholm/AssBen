import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum, Length, IsDateString } from 'class-validator';

export enum BeneficiaryType {
    ASSOCIADO = 'ASSOCIADO',
    FUNCIONARIO = 'FUNCIONARIO',
    DEPENDENTE = 'DEPENDENTE'
}

export class CreateBeneficiaryDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nome: string;

    @ApiProperty({ example: '12345678901' })
    @IsNotEmpty()
    @IsString()
    @Length(11, 11)
    cpf: string;

    @ApiProperty({ enum: BeneficiaryType })
    @IsEnum(BeneficiaryType)
    tipoVinculo: BeneficiaryType;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    validade?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    associadoEmpresaId?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    titularId?: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    @IsString()
    @Length(4, 8)
    pinInitial: string;
}

export class UpdateBeneficiaryDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    nome?: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(BeneficiaryType)
    tipoVinculo?: BeneficiaryType;

    @ApiProperty()
    @IsOptional()
    @IsString()
    status?: string;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    validade?: string;
}

export class ResetPinDto {
    @ApiProperty({ example: '888888' })
    @IsNotEmpty()
    @IsString()
    @Length(4, 8)
    newPin: string;
}

import { IsArray, ValidateNested, IsBoolean, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class BulkCreateItemDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nome: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(11, 11)
    cpf: string;

    @ApiProperty({ enum: BeneficiaryType })
    @IsEnum(BeneficiaryType)
    tipoVinculo: BeneficiaryType;

    @ApiProperty()
    @IsOptional()
    @IsString()
    nomeDependente?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    titularCpf?: string; // para ligar dependente ao titular dps
}

export class BulkCreateBeneficiariesDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    associadoEmpresaId: string;

    @ApiProperty({ type: [BulkCreateItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BulkCreateItemDto)
    @ArrayMinSize(1)
    beneficiaries: BulkCreateItemDto[];

    @ApiProperty({ description: 'Termo de responsabilidade aceito' })
    @IsBoolean()
    termoAceito: boolean;
}

