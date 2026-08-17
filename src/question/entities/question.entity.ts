import { Quiz } from 'src/quiz/entities/quiz.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'varchar', length: 255 })
  optionA: string;

  @Column({ type: 'varchar', length: 255 })
  optionB: string;

  @Column({ type: 'varchar', length: 255 })
  optionC: string;

  @Column({ type: 'varchar', length: 255 })
  optionD: string;

  @Column({ type: 'varchar', length: 255 })
  answer: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, {
  cascade: true,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
 })
  quiz: Quiz;
}