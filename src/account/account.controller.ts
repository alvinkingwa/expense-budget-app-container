import {
  Body,
  Controller,
  NotFoundException,
  Patch,
  Request,
  UseGuards,
  Param,
  Get,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCategoriesService } from 'src/create_categories/create_categories.service';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly createCategory: CreateCategoriesService,
  ) {}

  // deposit
  @Patch('deposit')
  @UseGuards(AuthGuard('jwt'))
  async depositAmount(
    @Request() req,
    @Body() depositInput: { amount: number; recievedFrom:string; receiverName: string }, // Include receiverName in the request body
  ) {
    const userId = req.user.userId;
    const { amount, receiverName} = depositInput;

    const response = await this.accountService.depositAmount(
      userId,
      amount,
   
      receiverName, // Pass receiverName to the service method
    );

    return response;
  }

  @Get('all-transaction/:userId')
  async getTransactionsForUser(@Param('userId') userId: string) {
    try {
      // Call the service method to retrieve all transactions for the user
      const transactions = await this.createCategory.getAllTransactionsForUser(
        userId,
      );

      return transactions;
    } catch (error) {
      throw error;
    }
  }
}
