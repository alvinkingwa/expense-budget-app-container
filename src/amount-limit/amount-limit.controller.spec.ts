import { Test, TestingModule } from '@nestjs/testing';
import { AmountLimitController } from './amount-limit.controller';
import { AmountLimitService } from './amount-limit.service';

describe('AmountLimitController', () => {
  let controller: AmountLimitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmountLimitController],
      providers: [AmountLimitService],
    }).compile();

    controller = module.get<AmountLimitController>(AmountLimitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
