import { Module, forwardRef } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { Account } from './account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { CreateCategory } from 'src/create_categories/entities/create_category.entity';
import { CreateCategoriesService } from 'src/create_categories/create_categories.service';
import { AmountLimit } from 'src/amount-limit/entities/amount-limit.entity';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { Receiver } from 'src/create_categories/entities/receiver.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      Transaction,
      CreateCategory,
      AmountLimit,
      User,
      Receiver,
    ]),
    // forwardRef(() => UsersModule),
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    CreateCategoriesService,
    JwtService,
    UsersService,
  ],
  exports: [AccountService],
})
export class AccountModule {}
