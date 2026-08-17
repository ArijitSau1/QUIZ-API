import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question,Quiz])],
  controllers: [QuestionController],
  providers: [QuestionService]
})
export class QuestionModule {}
