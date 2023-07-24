import {
  Body,
  Controller,
  NotFoundException,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

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
}
