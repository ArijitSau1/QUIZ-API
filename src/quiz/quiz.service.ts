import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizStatus } from 'src/enum';
import { Quiz } from './entities/quiz.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Injectable()
export class QuizService {
  private readonly logger = new Logger(QuizService.name);
  constructor( @InjectRepository(Quiz) private readonly quizRepository: Repository<Quiz>) {}

  async create(dto: CreateQuizDto) {
    const quiz = this.quizRepository.create(dto);
    return this.quizRepository.save(quiz);
  }
  
async findAll() {
  const today = new Date().toISOString().split('T')[0];

  return this.quizRepository
    .createQueryBuilder('quiz')
    .leftJoinAndSelect('quiz.questions', 'question')
    .where('quiz.quizDate = :today', {
      today,
    })
    .getMany();
}

  async findOne(id: string) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: {questions: true}
    });

    if (!quiz) {
      this.logger.warn(`Quiz not found: ${id}`);
      throw new NotFoundException('Quiz with id  not found');
    }
    return quiz;
  }

  async close(id: string) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
    });

    if (!quiz) {throw new NotFoundException('Quiz with id  not found');
    }
    quiz.status = QuizStatus.CLOSED;

    this.logger.log(`Quiz closed: ${id}`);

    return this.quizRepository.save(quiz);
  }


async closeYesterdayQuiz() {
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  const date = yesterday.toISOString().split('T')[0];

  const quiz = await this.quizRepository
    .createQueryBuilder('quiz')
    .where('DATE(quiz.quizDate) = :date', { date })
    .andWhere('quiz.status = :status', {
      status: QuizStatus.PUBLISHED,
    })
    .getOne();

  if (!quiz) {
    this.logger.warn('No published quiz found');
    return;
  }

  quiz.status = QuizStatus.CLOSED;

  return this.quizRepository.save(quiz);
}


  async uploadImage(id: string, imagePath: string) {
  const quiz = await this.quizRepository.findOne({
    where: { id },
  });

  if (!quiz) {
    throw new NotFoundException('Quiz not found');
  }

  quiz.image = imagePath;

  return this.quizRepository.save(quiz);
}
}