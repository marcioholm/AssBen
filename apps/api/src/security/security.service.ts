import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as security from 'common';

@Injectable()
export class SecurityService {
    private readonly encryptionKey: string;
    private readonly hmacKey: string;

    constructor(private configService: ConfigService) {
        const encKey = this.configService.get<string>('ENCRYPTION_KEY');
        const hKey = this.configService.get<string>('HMAC_KEY');

        if (!encKey || !hKey) {
            throw new Error('ENCRYPTION_KEY or HMAC_KEY is not defined');
        }

        this.encryptionKey = encKey;
        this.hmacKey = hKey;

        if (!this.encryptionKey || !this.hmacKey) {
            throw new Error('ENCRYPTION_KEY or HMAC_KEY not defined in environment variables');
        }
    }

    encryptCpf(cpf: string): string {
        return security.encryptCpf(cpf, this.encryptionKey);
    }

    decryptCpf(encryptedCpf: string): string {
        return security.decryptCpf(encryptedCpf, this.encryptionKey);
    }

    hashCpfForSearch(cpf: string): string {
        return security.hashCpfForSearch(cpf, this.hmacKey);
    }

    async hashPin(pin: string): Promise<string> {
        return security.hashPin(pin);
    }

    async verifyPin(pin: string, hash: string): Promise<boolean> {
        return security.verifyPin(pin, hash);
    }
}
