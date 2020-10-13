import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Votes } from './Votes';

@Entity()
export class Movies extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  sinopsys: string;

  @Column()
  director: string;

  @Column()
  genre: string;

  @Column()
  casts: string;

  @Column()
  delete: boolean;
}
