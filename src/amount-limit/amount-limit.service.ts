import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AmountLimit } from './entities/amount-limit.entity';
import { CreateCategory } from 'src/create_categories/entities/create_category.entity';
import { User } from 'src/users/user.entity';
import {  EntityManager } from 'typeorm';
import { startOfMonth, endOfMonth } from 'date-fns';



@Injectable()
export class AmountLimitService {
  constructor(
    @InjectRepository(AmountLimit)
    private readonly amountLimitRepository: Repository<AmountLimit>,
    @InjectRepository(CreateCategory)
    private readonly categoryRepository: Repository<CreateCategory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,

  ) {}

  // set budget limit for the category
  async createAmountLimit(
    categoryId: string,
    limitAmount: number,
  ): Promise<AmountLimit> {
    const category = await this.categoryRepository.findOne({
      where: { categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const amountLimit = this.amountLimitRepository.create({
      category,
      limitAmount,
    });

    return this.amountLimitRepository.save(amountLimit);
  }

  // get amountLimit by id for update and delete
  async getAmountLimitByCategoryId(categoryId: string): Promise<AmountLimit> {
    return this.amountLimitRepository.findOne({
      where: {
        category: {
          categoryId,
        },
      },
    });
  }

  async updateAmountLimit(
    categoryId: string,
    limitAmount: number,
  ): Promise<AmountLimit> {
    let amountLimit = await this.getAmountLimitByCategoryId(categoryId);

    if (!amountLimit) {
      const category = await this.categoryRepository.findOne({
        where: { categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      amountLimit = this.amountLimitRepository.create({
        category,
        limitAmount,
      });
    } else {
      amountLimit.limitAmount = limitAmount;
    }

    return this.amountLimitRepository.save(amountLimit);
  }

  async deleteAmountLimit(categoryId: string): Promise<void> {
    const amountLimit = await this.getAmountLimitByCategoryId(categoryId);
    if (amountLimit) {
      await this.amountLimitRepository.remove(amountLimit);
    }
  }

  async getTotalAmountLimitMonthly(userId: string): Promise<number> {
    const currentDate = new Date();
    const startOfMonthDate = startOfMonth(currentDate);
    const endOfMonthDate = endOfMonth(currentDate);
    
    const result = await this.entityManager
      .createQueryBuilder(AmountLimit, 'amountLimit')
      .select('SUM(amountLimit.limitAmount)', 'total')
      .innerJoin('amountLimit.category', 'category')
      .where('category.userId = :userId', { userId })
      .andWhere('amountLimit.createdAt BETWEEN :startOfMonth AND :endOfMonth', {
        startOfMonth: startOfMonthDate,
        endOfMonth: endOfMonthDate,
      })
      .getRawOne();
    
    return result ? parseFloat(result.total) : 0;
  }
  
}
