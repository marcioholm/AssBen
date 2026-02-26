import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class ReportFilterDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    parceiroId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    beneficiarioId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    metodo?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    resultado?: string;
}
