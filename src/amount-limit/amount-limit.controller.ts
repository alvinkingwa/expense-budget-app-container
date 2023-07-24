import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { AmountLimitService } from './amount-limit.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateAmountLimitDto } from './dto/create-amount-limit.dto';

@Controller('amountLimit')
@UseGuards(AuthGuard('jwt'))
export class AmountLimitController {
  constructor(private readonly amountLimitService: AmountLimitService) {}

  @Post(':categoryId/create')
  async createAmountLimit(
    @Param('categoryId') categoryId: string,
    @Body() createAmountLimitDto: CreateAmountLimitDto,
  ) {
    const { limitAmount } = createAmountLimitDto;
    const amountLimit = await this.amountLimitService.createAmountLimit(
      categoryId,
      limitAmount,
    );
    return amountLimit;
  }

  @Patch(':categoryId/update')
  async updateAmountLimit(
    @Param('categoryId') categoryId: string,
    @Body() createAmountLimitDto: CreateAmountLimitDto,
  ) {
    const { limitAmount } = createAmountLimitDto;
    const updatedAmountLimit = await this.amountLimitService.updateAmountLimit(
      categoryId,
      limitAmount,
    );
    return updatedAmountLimit;
  }
  @Delete(':categoryId/delete')
  async deleteAmountLimit(@Param('categoryId') categoryId: string) {
    await this.amountLimitService.deleteAmountLimit(categoryId);
    return { message: 'Amount limit deleted successfully' };
  }
}
