import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApsService } from './aps.service';

@Controller('aps')
export class ApsController {
  constructor(private readonly apsService: ApsService) {}

  @Post('job')
  startApsJob(
    @Query('urn')
    urn: string,
  ) {
    return this.apsService.startApsJob(urn);
  }

  @Get('job')
  getIfcDerivativeUrn(
    @Query('urn')
    urn: string,
  ) {
    return this.apsService.getIfcDerivativeUrn(urn);
  }

  @Post('ifc-to-speckle')
  ifcToSpeckle(
    @Query('projectName') projectName: string,
    @Query('derivativeUrn') derivativeUrn: string,
    @Query('modelUrn') modelUrn: string,
  ) {
    return this.apsService.ifcToSpeckle(modelUrn, derivativeUrn, projectName);
  }
}
