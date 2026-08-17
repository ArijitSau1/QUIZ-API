import {Body,Controller,Get,Param,Patch,Post,UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResultService } from './result.service';
import { SubmitResultDto } from './dto/submit-result.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Account } from 'src/account/entities/account.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('result')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post('submit')
  @UseGuards(AuthGuard('jwt'))
  submit(@CurrentUser() user: Account, @Body() dto: SubmitResultDto) {
    return this.resultService.submit(user.id, dto);
  }

  @Get('my-result')
  @UseGuards(AuthGuard('jwt'))
  myResult(@CurrentUser() user: Account) {
  return this.resultService.myResult(user.id);
}

@Get('all')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
findAllResults() {
  return this.resultService.findAllResults();
}

@Patch(':id/winner')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
publishWinner(@Param('id') id: string) {
  return this.resultService.publishWinner(id);
}

@Get('winner/:quizId')
getWinner(@Param('quizId') quizId: string) {
  return this.resultService.getWinner(quizId);
}
}
