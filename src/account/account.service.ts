import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  // method for creating account for the user
  async createAccount(user: User): Promise<Account> {
    const account = this.accountRepository.create({ user });
    return this.accountRepository.save(account);
  }

  // user deposit amount
  async depositAmount(userId: string, amount: number): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { user: { userId } },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    account.balance += amount;

    return this.accountRepository.save(account);
  }
}
