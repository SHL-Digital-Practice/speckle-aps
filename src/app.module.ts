import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApsModule } from './aps/aps.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ApsModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
