import { Test, TestingModule } from '@nestjs/testing';
import { RmaService } from './rma.service';

describe('RmaService', () => {
  let service: RmaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RmaService],
    }).compile();

    service = module.get<RmaService>(RmaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
