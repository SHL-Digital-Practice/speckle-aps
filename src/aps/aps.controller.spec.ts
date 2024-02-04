import { Test, TestingModule } from '@nestjs/testing';
import { ApsController } from './aps.controller';

describe('ApsController', () => {
  let controller: ApsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApsController],
    }).compile();

    controller = module.get<ApsController>(ApsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
