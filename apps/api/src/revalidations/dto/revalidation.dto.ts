import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, IsString } from 'class-validator';

export class BulkRevalidationDto {
    @ApiProperty({ type: [String] })
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    beneficiaryIds: string[];
}

export class BulkInactivateDto {
    @ApiProperty({ type: [String] })
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    beneficiaryIds: string[];
}
