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
  async depositAmount(@Request() req, @Body('amount') amount: number) {
    const userId = req.user.userId; // Get the userId from the request user (set by AuthGuard)
    const updatedAccount = await this.accountService.depositAmount(
      userId,
      amount,
    );

    if (!updatedAccount) {
      throw new NotFoundException('Account not found');
    }

    return updatedAccount;
  }

  @Get('all-transaction/:userId')
  async getTransactionsForUser(@Param('userId') userId: string) {
    try {
      // Call the service method to retrieve all transactions for the user
      const transactions = await this.createCategory.getAllTransactionsForUser(
        userId,
      );

      // Return the transactions as a response
      return transactions;
    } catch (error) {
      // Handle any errors or exceptions and return an appropriate response
      throw error;
    }
  }
}
