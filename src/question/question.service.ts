import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Quiz) private readonly quizRepository: Repository<Quiz>,
  ) {}

  async create(dto: CreateQuestionDto) {
    if (!dto.quizId) {
      throw new BadRequestException('Quiz ID is required');
    }
    const findQuiz = await this.quizRepository.findOne({
      where: { id: dto.quizId },
    });

    if (!findQuiz) {
      throw new NotFoundException(`Quiz not found`);
    }

    const today = new Date().toISOString().split('T')[0];

    const quizDate = String(findQuiz.quizDate);

    if (quizDate !== today) {
      throw new BadRequestException(
        "Questions can only be added to today's quiz",
      );
    }

    const existingQuestion = await this.questionRepository.findOne({
      where: {
        question: dto.question,
        quiz: { id: dto.quizId },
      },
    });

    if (existingQuestion) {
      throw new ConflictException('This question already exists in this quiz');
    }

    const uniqueOptions = new Set(dto.options);

    if (uniqueOptions.size !== dto.options.length) {
      throw new ConflictException('Options cannot be duplicated');
    }

    if (!dto.options.includes(dto.answer)) {
      throw new BadRequestException('Answer must match one of the options');
    }

    const question = this.questionRepository.create({
      question: dto.question,
      options: dto.options,
      answer: dto.answer,
      quiz: findQuiz,
    });

    return this.questionRepository.save(question);
  }

  async findOne(id: string) {
    const question = await this.questionRepository.findOne({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException(`Question with id ${id} not found`);
    }

    return question;
  }

  async remove(id: string) {
    const question = await this.findOne(id);
    if (!question) {
      throw new NotFoundException(`Question with id ${id} not found`);
    }
    await this.questionRepository.remove(question);

    return {
      message: 'Question deleted successfully',
    };
  }
}
