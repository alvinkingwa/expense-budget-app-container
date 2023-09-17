import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { CreateCategoriesModule } from './create_categories/create_categories.module';
import { CreateCategory } from './create_categories/entities/create_category.entity';
import { AmountLimitModule } from './amount-limit/amount-limit.module';
import { AmountLimit } from './amount-limit/entities/amount-limit.entity';
import { AccountModule } from './account/account.module';
import { Account } from './account/account.entity';
import { Transaction } from './account/transaction.entity';
import { JwtModule } from '@nestjs/jwt';
import { Receiver } from './create_categories/entities/receiver.entity';

const entities = [
  User,
  CreateCategory,
  AmountLimit,
  Account,
  Transaction,
  User,
  Receiver,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: entities,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    CreateCategoriesModule,
    AmountLimitModule,
    AccountModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
