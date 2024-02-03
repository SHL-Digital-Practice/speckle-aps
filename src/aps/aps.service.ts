import { Injectable } from '@nestjs/common';

@Injectable()
export class ApsService {
  getHello(): string {
    throw new Error('Method not implemented.');
  }
}
