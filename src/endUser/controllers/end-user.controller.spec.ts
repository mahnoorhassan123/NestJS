import { Test, TestingModule } from '@nestjs/testing';
import { EndUserController } from './end-user.controller';

describe('EndUserController', () => {
  let controller: EndUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EndUserController],
    }).compile();

    controller = module.get<EndUserController>(EndUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
