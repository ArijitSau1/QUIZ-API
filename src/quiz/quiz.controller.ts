import {Body,Controller,Get,Param,Post,Put,UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UserRole } from 'src/enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';


@Controller('quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateQuizDto) {
    return this.quizService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.quizService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }

  @Put(':id/close')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  close(@Param('id') id: string) {
    return this.quizService.close(id);
  }
}
