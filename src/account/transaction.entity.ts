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
import { Receiver } from 'src/create_categories/entities/receiver.entity';

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

  @ManyToOne(() => CreateCategory, (category) => category.transactions, {
    nullable: true,
  })
  category: CreateCategory; // Allow the category to be nullable

  @ManyToOne(() => Receiver, { eager: true })
  @JoinColumn({ name: 'receiverId' })
  receiver: Receiver;

  // Add a type field to distinguish between deposit and category transactions
  @Column()
  type: 'deposit' | 'category';
  receivedFrom: string;
}
