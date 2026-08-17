import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizStatus } from 'src/enum';
import { Quiz } from './entities/quiz.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Injectable()
export class QuizService {
  constructor( @InjectRepository(Quiz) private readonly quizRepository: Repository<Quiz>) {}

  async create(dto: CreateQuizDto) {
    const quiz = this.quizRepository.create(dto);
    return this.quizRepository.save(quiz);
  }

  async findAll() {
    return this.quizRepository.find({
      relations: {questions: true}
    });
  }

  async findOne(id: string) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: {questions: true}
    });

    if (!quiz) {throw new NotFoundException(`Quiz with id ${id} not found`);
    }
    return quiz;
  }

  async close(id: string) {
    const quiz = await this.quizRepository.findOne({
      where: { id },
    });

    if (!quiz) {throw new NotFoundException(`Quiz with id ${id} not found`);
    }
    quiz.status = QuizStatus.CLOSED;

    return this.quizRepository.save(quiz);
  }
}