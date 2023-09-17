import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Transaction } from './transaction.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // user deposit amount
  async depositAmount(userId: string, amount: number): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { user: { userId } },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const depositTransaction = new Transaction();
    depositTransaction.amount = amount;
    depositTransaction.user = await this.userRepository.findOne({
      where: { userId },
    });
    depositTransaction.timestamp = new Date();
    depositTransaction.type = 'deposit';

    await this.transactionRepository.save(depositTransaction);

    account.balance += amount;

    return this.accountRepository.save(account);
  }
}
