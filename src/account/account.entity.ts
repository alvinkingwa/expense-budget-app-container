import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  accountId: number;

  @Column({ default: 0 })
  balance: number;

  @Column({ default: 0 })
  amountSpent: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => User, (user) => user.account)
  @JoinColumn()
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];
}
