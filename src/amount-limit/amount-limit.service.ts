import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AmountLimit } from './entities/amount-limit.entity';

@Injectable()
export class AmountLimitService {
  constructor(
    @InjectRepository(AmountLimit)
    private readonly amountLimitRepository: Repository<AmountLimit>,
  ) {}

  // set budget limit for the category
  async createAmountLimit(
    categoryId: string,
    limitAmount: number,
  ): Promise<AmountLimit> {
    const amountLimit = this.amountLimitRepository.create({
      category: { categoryId },
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
    const amountLimit = await this.getAmountLimitByCategoryId(categoryId);
    if (!amountLimit) {
      throw new NotFoundException('Amount limit not found');
    }
    amountLimit.limitAmount = limitAmount;
    return this.amountLimitRepository.save(amountLimit);
  }
  async deleteAmountLimit(categoryId: string): Promise<void> {
    const amountLimit = await this.getAmountLimitByCategoryId(categoryId);
    if (amountLimit) {
      await this.amountLimitRepository.remove(amountLimit);
    }
  }
}
