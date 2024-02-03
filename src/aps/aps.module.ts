import { Module } from '@nestjs/common';
import { ApsService } from './aps.service';
import { ApsController } from './aps.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApsJob } from './entities/aps-job.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([ApsJob])],
  providers: [ApsService],
  controllers: [ApsController],
})
export class ApsModule {}
