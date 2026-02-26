import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SecurityModule } from './security/security.module';
import { AuthModule } from './auth/auth.module';
import { PartnersModule } from './partners/partners.module';
import { BeneficiariesModule } from './beneficiaries/beneficiaries.module';
import { ValidationModule } from './validation/validation.module';
import { ReportsModule } from './reports/reports.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LgpdController } from './lgpd/lgpd.controller';
import { RevalidationsModule } from './revalidations/revalidations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    SecurityModule,
    AuthModule,
    PartnersModule,
    BeneficiariesModule,
    ValidationModule,
    ReportsModule,
    RevalidationsModule,
  ],
  controllers: [AppController, LgpdController],
  providers: [AppService],
})
export class AppModule { }
