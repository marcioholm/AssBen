import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AdminLoginDto {
    @ApiProperty({ example: 'admin@acebraz.com.br' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsNotEmpty()
    @IsString()
    password: string;
}

export class BeneficiaryLoginDto {
    @ApiProperty({ example: '12345678901' })
    @IsNotEmpty()
    @IsString()
    @Length(11, 11)
    cpf: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    @IsString()
    @Length(4, 8)
    pin: string;
}
