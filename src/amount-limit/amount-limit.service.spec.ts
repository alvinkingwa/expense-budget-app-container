import { Test, TestingModule } from '@nestjs/testing';
import { AmountLimitService } from './amount-limit.service';

describe('AmountLimitService', () => {
  let service: AmountLimitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmountLimitService],
    }).compile();

    service = module.get<AmountLimitService>(AmountLimitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
