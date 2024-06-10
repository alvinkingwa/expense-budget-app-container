import {
  Column,
  Entity,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AmountLimit } from 'src/amount-limit/entities/amount-limit.entity';
import { Transaction } from 'src/account/transaction.entity';
import { User } from 'src/users/user.entity';
@Entity()
export class CreateCategory {
  @PrimaryColumn({ length: 36 })
  categoryId: string;

  @Column()
  name: string;

  @Column()
  userId: string;

  @Column({ default: 0 })
  amountSpent: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timeSpent: Date;

  @OneToOne(() => AmountLimit, (amountLimit) => amountLimit.category, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  limit: AmountLimit;

  @ManyToOne(() => User, (user) => user.categories)
  @JoinColumn()
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];
  amountLimit: any;

}
