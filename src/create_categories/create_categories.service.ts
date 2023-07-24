import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategory } from './entities/create_category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Account } from 'src/account/account.entity';
import { User } from 'src/users/user.entity';
import { Transaction } from 'src/account/transaction.entity';

@Injectable()
export class CreateCategoriesService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(CreateCategory)
    private readonly categoryRepository: Repository<CreateCategory>,
  ) {}

  async createCategoryForUser(
    userId: string,
    name: string,
  ): Promise<CreateCategory> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { userId, name },
    });

    if (existingCategory && existingCategory.userId === userId) {
      throw new BadRequestException(
        'You already have a category with this name',
      );
    }

    const categoryId = uuidv4(); // Generate a UUID for the categoryId

    const user = await this.userRepository.findOne({ where: { userId } }); // Fetch the user entity

    const category = this.categoryRepository.create({
      categoryId,
      name,
      user,
      userId, // Assign the user entity to the `user` property of the category
      amountSpent: 0,
    });

    return this.categoryRepository.save(category);
  }

  async updateCategoryForUser(
    userId: string,
    categoryId: string,
    newName: string,
  ): Promise<CreateCategory> {
    const category = await this.categoryRepository.findOne({
      where: { categoryId, userId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Update the name of the category
    category.name = newName;

    return this.categoryRepository.save(category);
  }
  async deleteCategoryForUser(
    userId: string,
    categoryId: string,
  ): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { categoryId, userId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepository.remove(category);
  }

  async spendAmountOnCategory(
    userId: string,
    categoryId: string,
    amount: number,
  ): Promise<CreateCategory> {
    const account = await this.accountRepository.findOne({
      where: { user: { userId } },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.balance < amount) {
      throw new BadRequestException('Insufficient account balance');
    }

    const category = await this.categoryRepository.findOne({
      where: { categoryId, user: { userId } },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // if (category.amountSpent + amount > category.limit.limitAmount) {
    //   throw new BadRequestException('Exceeds category limit');
    // }

    account.balance -= amount;
    category.amountSpent += amount;
    category.timeSpent = new Date();

    const totalAmountSpent = account.amountSpent + amount;
    account.amountSpent = totalAmountSpent;

    await this.accountRepository.save(account);
    await this.categoryRepository.save(category);

    const user = await this.userRepository.findOne({ where: { userId } });
    await this.createTransaction(user, category, amount);

    return category;
  }

  async getCategoriesWithoutAmountSpent(
    userId: string,
  ): Promise<CreateCategory[]> {
    return this.categoryRepository.find({
      where: { userId, amountSpent: 0 },
    });
  }

  async getCategoriesWithSpentAmount(
    userId: string,
  ): Promise<CreateCategory[]> {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['categories', 'categories.transactions'], // Include the 'categories' and 'transactions' relations
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const categoriesWithSpentAmount = user.categories.filter(
      (category) => category.transactions.length > 0,
    );

    return categoriesWithSpentAmount;
  }
  // transactions

  async createTransaction(
    user: User,
    category: CreateCategory,
    amount: number,
  ): Promise<Transaction> {
    const transaction = new Transaction();
    transaction.amount = amount;
    transaction.category = category;
    transaction.user = user;
    return this.transactionRepository.save(transaction);
  }
}
