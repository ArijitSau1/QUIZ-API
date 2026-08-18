import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from './entities/result.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { Question } from 'src/question/entities/question.entity';
import { SubmitResultDto } from './dto/submit-result.dto';
import { NodeMailerService } from 'src/node-mailer/node-mailer.service';

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(Result)
    private readonly resultRepository: Repository<Result>,
    @InjectRepository(Quiz) private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly nodeMailerService: NodeMailerService
  ) {}

  async submit(accountId: string, dto: SubmitResultDto) {
    const quiz = await this.quizRepository.findOne({
      where: { id: dto.quizId },
      relations: { questions: true },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    const today = new Date();
    const todayDate = today.toISOString().split('T')[0];
    const quizDate = quiz.quizDate.toString();

    if (todayDate !== quizDate) {
      throw new BadRequestException('You cannot submit this quiz today');
    }

    const existingResult = await this.resultRepository.findOne({
      where: {
        account: { id: accountId },
        quiz: { id: dto.quizId },
      },
    });

    if (existingResult) {
      throw new BadRequestException('You have already submitted this quiz');
    }

    if (dto.answers.length !== quiz.questions.length) {
      throw new BadRequestException(
        `You must answer all ${quiz.questions.length} questions`,
      );
    }

    let score = 0;
    for (const userAnswer of dto.answers) {
      const question = quiz.questions.find(
        (q) => q.id === userAnswer.questionId,
      );
      if (question && question.answer === userAnswer.answer) {
        score++;
      }
    }

    const result = this.resultRepository.create({
      account: {
        id: accountId,
      },
      quiz: {
        id: dto.quizId,
      },
      score,
      totalQuestions: quiz.questions.length,
    });

    const savedResult = await this.resultRepository.save(result);
       this.nodeMailerService.sendEmail(
       accountId,
       score,
       quiz.questions.length,
    );

return savedResult;
  }

  async myResult(accountId: string) {
    const result = await this.resultRepository.findOne({
      where: {
        account: { id: accountId },
      },
      relations: { quiz: true },
    });

    if (!result) {
      throw new NotFoundException('Result not found');
    }

    return result;
  }

  async findAllResults() {
     const today = new Date().toISOString().split('T')[0];
    return this.resultRepository.find({
    //   where: {
    //   quiz: {quizDate: today}
    // },
      relations: { account: true, quiz: true },
      order: { score: 'DESC' },
    });
  }

  async publishWinner(id: string) {
    const result = await this.resultRepository.findOne({
      where: { id },
      relations: { account: true, quiz: true },
    });

    if (!result) {
      throw new NotFoundException('Result not found');
    }

    result.isWinner = true;
    return this.resultRepository.save(result);
  }

  async getWinner(quizId: string) {
    const winner = await this.resultRepository.findOne({
      where: { quiz: { id: quizId }, isWinner: true },
      relations: {
        account: true,
        quiz: true,
      },
    });

    if (!winner) {
      throw new NotFoundException('Winner has not been published yet');
    }

    return winner;
  }
}
