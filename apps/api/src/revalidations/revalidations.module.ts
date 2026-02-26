import { Module } from '@nestjs/common';
import { RevalidationsService } from './revalidations.service';
import { RevalidationsController } from './revalidations.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RevalidationsController],
  providers: [RevalidationsService],
})
export class RevalidationsModule { }
