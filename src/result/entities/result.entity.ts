import { Account } from 'src/account/entities/account.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import {Column,CreateDateColumn,Entity,ManyToOne,PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Result {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, {
    onDelete: 'CASCADE',
  })
  account: Account;

  @ManyToOne(() => Quiz, {
    onDelete: 'CASCADE',
  })
  quiz: Quiz;

  @Column()
  score: number;

  @Column()
  totalQuestions: number;

  @Column({ default: false })
  isWinner: boolean;

  @CreateDateColumn()
  submittedAt: Date;
}