import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { QuizService } from './quiz.service';

@Injectable()
export class QuizScheduler {
  private readonly logger = new Logger(QuizScheduler.name);

  constructor(
    private readonly quizService: QuizService,
  ) {}

  @Cron('0 0 * * *')
  async closeDailyQuiz() {

    await this.quizService.closeYesterdayQuiz();

    this.logger.log('Daily quiz closing task completed');
  }
}