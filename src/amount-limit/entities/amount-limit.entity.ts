import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { CreateCategory } from 'src/create_categories/entities/create_category.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class AmountLimit {
  @PrimaryGeneratedColumn()
  amountLimitId: string;

  @Column({ default: 0 })
  limitAmount: number;

  @OneToOne(() => CreateCategory, (category) => category.limit)
  @JoinColumn({ name: 'categoryId' })
  category: CreateCategory;

  // @Column()
  // userId:string

  @CreateDateColumn() // This will add a createdAt column to your entity
  createdAt: Date;
}
