import { Module } from '@nestjs/common';
import { SpeckleService } from './speckle.service';

@Module({
  providers: [SpeckleService],
  exports: [SpeckleService],
})
export class SpeckleModule {}
