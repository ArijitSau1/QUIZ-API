import { Module } from '@nestjs/common';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { Question } from 'src/question/entities/question.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { NodeMailerModule } from 'src/node-mailer/node-mailer.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([Result,Question,Quiz]),
  NodeMailerModule,AuthModule],
  controllers: [ResultController],
  providers: [ResultService]
})
export class ResultModule {}
