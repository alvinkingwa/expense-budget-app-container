import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmountLimit } from 'src/amount-limit/entities/amount-limit.entity';
import { Account } from 'src/account/account.entity';
import { CreateCategory } from 'src/create_categories/entities/create_category.entity';
import { Transaction } from 'src/account/transaction.entity';
import { CreateCategoriesService } from 'src/create_categories/create_categories.service';
import { UsersService } from './users.service';
import { AccountService } from 'src/account/account.service';
import { AccountModule } from 'src/account/account.module';
import { Receiver } from 'src/create_categories/entities/receiver.entity';
// import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      AmountLimit,
      Account,
      CreateCategory,
      Transaction,
      Receiver
    ]),
    // forwardRef(() => AccountModule),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateCategoriesService,
    AccountService,
    JwtService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
