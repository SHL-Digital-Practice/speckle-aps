import { Test, TestingModule } from '@nestjs/testing';
import { SpeckleService } from './speckle.service';

describe('SpeckleService', () => {
  let service: SpeckleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpeckleService],
    }).compile();

    service = module.get<SpeckleService>(SpeckleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
