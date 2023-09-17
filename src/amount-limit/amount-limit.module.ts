import { Module } from '@nestjs/common';
import { AmountLimitService } from './amount-limit.service';
import { AmountLimitController } from './amount-limit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmountLimit } from './entities/amount-limit.entity';
import { CreateCategoriesService } from 'src/create_categories/create_categories.service';
import { CreateCategory } from 'src/create_categories/entities/create_category.entity';
import { JwtService } from '@nestjs/jwt';
import { Account } from 'src/account/account.entity';
import { User } from 'src/users/user.entity';
import { Transaction } from 'src/account/transaction.entity';
import { Receiver } from 'src/create_categories/entities/receiver.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AmountLimit,
      CreateCategory,
      Account,
      User,
      Transaction,
      Receiver,
    ]),
  ],
  controllers: [AmountLimitController],
  providers: [AmountLimitService, CreateCategoriesService, JwtService],
})
export class AmountLimitModule {}
