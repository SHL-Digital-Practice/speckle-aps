import { Controller, Post } from '@nestjs/common';
import { ApsService } from './aps.service';

@Controller('aps')
export class ApsController {
  constructor(private readonly apsService: ApsService) {}

  @Post('job')
  startJob(): string {
    // https://developer.api.autodesk.com/modelderivative/v2/designdata/job
    return this.apsService.startJob(
      'dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLnJoVE5NdUthUTFhblVobUs3M0JLb2c_dmVyc2lvbj0z',
    );
  }

  @Post('ifc')
  getIfc(): string {
    return this.apsService.getIfc(
      'dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLnJoVE5NdUthUTFhblVobUs3M0JLb2c_dmVyc2lvbj0z',
    );
  }
}
