import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Account } from 'src/account/account.entity';
import { CreateUserResponse } from './create-user-response.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
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
  async findUserWithAccountAndCategories(userId: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['account', 'categories', 'categories.limit'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

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

    return result;
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
