import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateCategory } from 'src/create_categories/entities/create_category.entity';
import { Account } from 'src/account/account.entity';
import { Transaction } from 'src/account/transaction.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn({ length: 36 })
  userId: string;

  @Column()
  firstName: string;

  @Column()
  secondName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  otpExpiresAt: Date;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => CreateCategory, (category) => category.user)
  categories: CreateCategory[];

  @OneToOne(() => Account, (account) => account.user)
  account: Account;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
