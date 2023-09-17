import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Receiver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
