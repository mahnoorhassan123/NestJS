import { Test, TestingModule } from '@nestjs/testing';
import { RmaController } from './rma.controller';

describe('RmaController', () => {
  let controller: RmaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RmaController],
    }).compile();

    controller = module.get<RmaController>(RmaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
