import { Module } from '@nestjs/common';
import { CreateCategoriesService } from './create_categories.service';
import { CreateCategoriesController } from './create_categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCategory } from './entities/create_category.entity';
import { AmountLimit } from 'src/amount-limit/entities/amount-limit.entity';
import { AmountLimitService } from 'src/amount-limit/amount-limit.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { TokenService } from 'src/auth/token.service';
import { Account } from 'src/account/account.entity';
import { Transaction } from 'src/account/transaction.entity';
import { Receiver } from './entities/receiver.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreateCategory,
      AmountLimit,
      User,
      Account,
      Transaction,
      Receiver,
    ]),
  ],
  controllers: [CreateCategoriesController],
  providers: [
    CreateCategoriesService,
    AmountLimitService,
    JwtService,
    AuthService,
    UsersService,
    TokenService,
  ],
})
export class CreateCategoriesModule {}
