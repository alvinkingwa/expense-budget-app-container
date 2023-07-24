import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CreateCategory } from 'src/create_categories/entities/create_category.entity';

@Entity()
export class AmountLimit {
  @PrimaryGeneratedColumn()
  amountLimitId: string;

  @Column({ default: 0 })
  limitAmount: number;

  @OneToOne(() => CreateCategory, (category) => category.limit)
  @JoinColumn({ name: 'categoryId' })
  category: CreateCategory;
}
