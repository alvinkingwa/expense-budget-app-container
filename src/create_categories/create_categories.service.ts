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
import { Receiver } from './entities/receiver.entity';

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
    @InjectRepository(Receiver)
    private readonly receiverRepository: Repository<Receiver>,
  ) {}

  // category for the user
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

    const categoryId = uuidv4();

    const user = await this.userRepository.findOne({ where: { userId } });

    const category = this.categoryRepository.create({
      categoryId,
      name,
      user,
      userId,
      amountSpent: 0,
    });

    return this.categoryRepository.save(category);
  }
  // update name for the category
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

    category.name = newName;

    return this.categoryRepository.save(category);
  }

  // delete category
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

  // category spending
  async spendAmountOnCategory(
    userId: string,
    categoryId: string,
    amount: number,
    receiverId: number,
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
    account.balance -= amount;
    category.amountSpent += amount;
    category.timeSpent = new Date();

    const totalAmountSpent = account.amountSpent + amount;
    account.amountSpent = totalAmountSpent;

    const receiver = await this.receiverRepository.findOne({
      where: { id: receiverId },
    });
    if (!receiver) {
      throw new NotFoundException('receiver not found');
    }

    // Create a new transaction for spending on the category
    const categoryTransaction = new Transaction();
    categoryTransaction.amount = amount;
    categoryTransaction.user = await this.userRepository.findOne({
      where: { userId },
    });

    categoryTransaction.category = category;

    // Set the type to 'category'
    categoryTransaction.timestamp = new Date();
    categoryTransaction.type = 'category';
    categoryTransaction.receiver = receiver;

    await this.transactionRepository.save(categoryTransaction);
    await this.accountRepository.save(account);
    await this.categoryRepository.save(category);

    return category;
  }

  // transactions made by user
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

  async getAllTransactionsForUser(userId: string): Promise<Transaction[]> {
    const user = await this.userRepository.findOne({
      where: { userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const transactions = await this.transactionRepository.find({
      where: { user: { userId } },
      relations: ['category', 'receiver'], // Load the category relationship
    });

    return transactions;
  }

  // list user's category with no amountSpent
  async getCategoriesWithoutAmountSpent(
    userId: string,
  ): Promise<CreateCategory[]> {
    return this.categoryRepository.find({
      where: { userId, amountSpent: 0 },
    });
  }

  // fetch category list with amountSpent
  async getCategoriesWithSpentAmount(
    userId: string,
  ): Promise<CreateCategory[]> {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['categories', 'categories.transactions'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const categoriesWithSpentAmount = user.categories.filter(
      (category) => category.transactions.length > 0,
    );

    return categoriesWithSpentAmount;
  }
}
