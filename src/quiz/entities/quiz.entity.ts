import {Column,CreateDateColumn,Entity,OneToMany,PrimaryGeneratedColumn} from 'typeorm';
import { QuizStatus } from 'src/enum';
import { Question } from 'src/question/entities/question.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;
  
  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date', unique: true })
  quizDate: Date;

  @Column({ type: 'enum',enum: QuizStatus,default: QuizStatus.PUBLISHED})
  status: QuizStatus;
  
  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Question, (question) => question.quiz)
  questions: Question[];
}