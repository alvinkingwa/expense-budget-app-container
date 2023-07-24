import { PartialType } from '@nestjs/mapped-types';
import { CreateAmountLimitDto } from './create-amount-limit.dto';

export class UpdateAmountLimitDto extends PartialType(CreateAmountLimitDto) {
  amountLimit: number;
}
