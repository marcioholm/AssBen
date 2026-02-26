import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreatePartnerDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    cnpj: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nomeFantasia: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    categoria: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    subcategoria?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    endereco?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    contato?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    logoUrl?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    regrasDesconto?: string;

    // Vendas e Workflow
    @ApiProperty()
    @IsOptional()
    @IsString()
    statusWorkFlow?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    anotacoes?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    responsavel?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    descontoAssociado?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    descontoFuncionario?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    descontoDependente?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    restricoes?: string;
}

export class UpdatePartnerDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    nomeFantasia?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    categoria?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    subcategoria?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    endereco?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    contato?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    logoUrl?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    regrasDesconto?: string;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    ativo?: boolean;

    // Vendas e Workflow
    @ApiProperty()
    @IsOptional()
    @IsString()
    statusWorkFlow?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    anotacoes?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    responsavel?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    descontoAssociado?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    descontoFuncionario?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    descontoDependente?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    restricoes?: string;
}
