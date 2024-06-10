import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Account } from 'src/account/account.entity';
import { CreateUserResponse } from './create-user-response.interface';
// import { startOfMonth, endOfMonth } from 'date-fns';
import { Transaction } from 'src/account/transaction.entity';
import { addMinutes, subMinutes, startOfMinute, endOfMinute, startOfDay, endOfDay } from 'date-fns';
import { startOfMonth, endOfMonth, startOfDay as startOfDayDateFn, endOfDay as endOfDayDateFn } from 'date-fns';



@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}
  // create user and account
  async create(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    try {
      const { firstName, secondName, email, password } = createUserDto;
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new ConflictException('User with the same email already exists');
      }
      const user = new User();
      user.userId = uuidv4();
      user.firstName = firstName;
      user.secondName = secondName;
      user.email = email;
      user.password = password;

      const createdUser = await this.userRepository.save(user);

      const account = new Account();
      account.user = createdUser;
      await this.accountRepository.save(account);

      return { user: createdUser, message: 'Signup successful' };
      // return { message: 'Signup successful' };
      // return createdUser;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Signup failed');
    }
  }
  // async findUserWithAccountAndCategories(userId: string): Promise<any> {
  //   const user = await this.userRepository.findOne({
  //     where: { userId },
  //     relations: ['account', 'categories', 'categories.limit'],
  //   });

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  //   const now = new Date();
  //   const start = startOfMonth(now);
  //   const end = endOfMonth(now);

  //   const transactions = await this.transactionRepository.find({
  //     where: {
  //       user: { userId },
  //       type: 'deposit',
  //       timestamp: Between(start, end),
  //     },
  //   });

  //   const monthlyDepositTotal = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

  //   // Exclude specific fields from the user object
  //   const {
  //     firstName,
  //     secondName,
  //     email,
  //     password,
  //     otp,
  //     otpExpiresAt,
  //     createdAt,
  //     ...result
  //   } = user;

  //   return {
  //     ...result,
  //     monthlyDepositTotal
  //   }
  // }

  async findUserWithAccountAndCategories(userId: string,): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['account', 'categories', 'categories.limit'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Calculate deposits for the current "month" (which is now treated as a minute)
     const now = new Date();
   const start = startOfMonth(now);
   const end = endOfMonth(now);
    const transactions = await this.transactionRepository.find({
      where: {
        user: { userId },
        type: 'deposit',
        timestamp: Between(start, end),
      },
    });

    const monthlyDepositTotal = transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0,
    );

    // Fetch expense transactions for the current month
    const expenseTransactions = await this.transactionRepository.find({
      where: {
        user: { userId },
        type: 'category',
        timestamp: Between(start, end),
      },
      relations: ['category'],
    });

    const monthlyExpenseTotal = expenseTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);


    const savings = monthlyDepositTotal - monthlyExpenseTotal;

    // const targetDate = new Date(date);
    // const startOfDayDate = startOfDayDateFn(targetDate);
    // const endOfDayDate = endOfDayDateFn(targetDate);

    // const dailyExpenseTransactions = await this.transactionRepository.find({
    //   where: {
    //     user: { userId },
    //     type:'category',
    //     timestamp: Between(startOfDayDate, endOfDayDate) as unknown as Date,
    //   },
    // });

    // const dailyExpenseTotal = dailyExpenseTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    // Exclude specific fields from the user object
    const {
      firstName,
      secondName,
      email,
      password,
      otp,
      otpExpiresAt,
      createdAt,
      ...result
    } = user;

    return {
      ...result,
      monthlyDepositTotal,
      monthlyExpenseTotal,
      savings,
      // dailyExpenseTotal
    };
  }


  async getDailyExpenseTotal(userId: string, date: string): Promise<number> {
    const startOfDayDate = startOfDay(new Date(date));
    const endOfDayDate = endOfDay(new Date(date));
  
    const transactions = await this.transactionRepository.find({
      where: {
        user: { userId },
        type: 'category', // Assuming 'category' means expense
        timestamp: Between(startOfDayDate, endOfDayDate),
      },
    });
  
    const dailyExpenseTotal = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    return dailyExpenseTotal;
  }


  async findById(userId: string): Promise<User> {
    return await this.userRepository.findOne({ where: { userId } });
  }
  async findByEmail(email: string) {
    return await User.findOne({
      where: {
        email: email,
      },
    });
  }
}

