import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Transaction } from './transaction.entity';
import { Receiver } from 'src/create_categories/entities/receiver.entity';
import { DepositResponse } from './depositResponse.interface';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Receiver)
    private readonly receiverRepository: Repository<Receiver>,
  ) {}

  // user deposit amount
  async depositAmount(
    userId: string,
    amount: number, 
    receiverName: string,
  ): Promise<DepositResponse> {
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

    let receiver = await this.receiverRepository.findOne({
      where: { name: receiverName },
    });
    if (!receiver) {
      receiver = new Receiver();
      receiver.name = receiverName;
      receiver = await this.receiverRepository.save(receiver);
    }

    depositTransaction.receiver = receiver;

    await this.transactionRepository.save(depositTransaction);

    account.balance += amount;
    await this.accountRepository.save(account);

    const response: DepositResponse = {
      account,
      receiverName: receiverName,
    };

    return response;
  }
}
