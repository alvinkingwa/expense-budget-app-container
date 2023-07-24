import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { CreateCategory } from 'src/create_categories/entities/create_category.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @CreateDateColumn({ type: 'timestamp' })
  timestamp: Date;

  @ManyToOne(() => Account, (account) => account.transactions)
  account: Account;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn()
  user: User;

  @JoinColumn({ name: 'categoryId' })
  @ManyToOne(() => CreateCategory, (category) => category.transactions)
  category: CreateCategory;
}
