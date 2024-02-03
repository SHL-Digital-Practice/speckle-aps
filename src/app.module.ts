import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApsModule } from './aps/aps.module';

@Module({
  imports: [ApsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
