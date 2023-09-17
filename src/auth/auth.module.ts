import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { TokenService } from './token.service';
// import { MailgunService } from '@nextnm/nestjs-mailgun';
import { ForgotPasswordController } from './forgot-password.controller';
import { UpdatePasswordController } from './update-password.controller';
import { VerifyOtpController } from './verify-otp/verify-otp/verify-otp.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth-guard/auth-guard.guard';
import { AccountService } from 'src/account/account.service';
import { AmountLimit } from 'src/amount-limit/entities/amount-limit.entity';
import { Account } from 'src/account/account.entity';
import { CreateCategory } from 'src/create_categories/entities/create_category.entity';
import { Transaction } from 'src/account/transaction.entity';
import { CreateCategoriesService } from 'src/create_categories/create_categories.service';
import { AccountModule } from 'src/account/account.module';
import { UsersService } from 'src/users/users.service';
import { Receiver } from 'src/create_categories/entities/receiver.entity';

@Module({
  imports: [
    AccountModule,
    PassportModule,
    // ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }), // Make sure Passport is registered with 'jwt' strategy
    JwtModule.registerAsync({
      // imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '1d',
        },
      }),
      // inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      AmountLimit,
      Account,
      CreateCategory,
      Transaction,
      Receiver,
    ]),
  ],
  controllers: [
    AuthController,
    ForgotPasswordController,
    UpdatePasswordController,
    VerifyOtpController,
  ],
  providers: [
    UsersService,
    CreateCategoriesService,
    AccountService,
    AuthService,
    jwtStrategy,
    TokenService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // {
    //   provide: 'MAILGUN_CLIENT',
    //   // eslint-disable-next-line @typescript-eslint/no-var-requires
    //   useValue: require('mailgun-js')({
    //     apiKey: process.env.MAILGUN_API_KEY,
    //     domain: process.env.MAILGUN_DOMAIN,
    //   }),
    // },
  ],
  exports: [AuthService],
})
export class AuthModule {}
