import { Test, TestingModule } from '@nestjs/testing';
import { OrderSnapshotService } from './order-snapshot.service';

describe('OrderSnapshotService', () => {
  let service: OrderSnapshotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderSnapshotService],
    }).compile();

    service = module.get<OrderSnapshotService>(OrderSnapshotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
