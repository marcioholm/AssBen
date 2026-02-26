import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('db-check')
  async checkDb() {
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      const count = await prisma.beneficiario.count();
      return {
        status: 'ok',
        count,
        env: {
          hasDbUrl: !!process.env.DATABASE_URL,
          hasEncKey: !!process.env.ENCRYPTION_KEY,
          hasHmacKey: !!process.env.HMAC_KEY,
          encKeyLength: process.env.ENCRYPTION_KEY?.length
        }
      };
    } catch (e: any) {
      return { status: 'error', message: e.message };
    }
  }
}
