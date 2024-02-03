import { Controller, Get } from '@nestjs/common';
import { ApsService } from './aps.service';

@Controller('aps')
export class ApsController {
  constructor(private readonly apsService: ApsService) {}

  @Get()
  getHello(): string {
    // https://developer.api.autodesk.com/modelderivative/v2/designdata/job
    return this.apsService.getHello();
  }
}
