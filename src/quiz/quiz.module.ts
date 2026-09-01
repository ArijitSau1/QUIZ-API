import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { Quiz } from './entities/quiz.entity';
import { AuthModule } from 'src/auth/auth.module';
import { QuizScheduler } from './quiz.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz]),
AuthModule],
  controllers: [QuizController],
  providers: [QuizService,QuizScheduler],
})
export class QuizModule {}
