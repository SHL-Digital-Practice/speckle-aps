import { Module } from '@nestjs/common';
import { ApsService } from './aps.service';
import { ApsController } from './aps.controller';

@Module({
  providers: [ApsService],
  controllers: [ApsController],
})
export class ApsModule {}
