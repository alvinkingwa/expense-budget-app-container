import { IsNumber, Min } from 'class-validator';

export class CreateAccountDto {
  @IsNumber()
  @Min(0)
  balance: number;
}
