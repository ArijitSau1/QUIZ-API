import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PermissionAction, UserRole } from 'src/enum';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { CheckPermissions } from 'src/auth/decorators/permissions.decorator';

@Controller('question')
export class QuestionController {
     constructor(private readonly questionService: QuestionService) {}

     @Post()
     @UseGuards(AuthGuard('jwt'), RolesGuard,PermissionsGuard)
     @CheckPermissions([PermissionAction.CREATE,'question'])
     @Roles(UserRole.ADMIN)
     create(@Body() dto:CreateQuestionDto){
        return this.questionService.create(dto);
     }


     @Get(':id')
     @UseGuards(AuthGuard('jwt'))
        findOne(@Param('id',ParseIntPipe) id:string){
            return this.questionService.findOne(id)
        }
     

     @Delete(':id')
      @UseGuards(AuthGuard('jwt'), RolesGuard,PermissionsGuard)
      @CheckPermissions([PermissionAction.DELETE,'question'])
     @Roles(UserRole.ADMIN)
      remove(@Param('id') id: string) {
     return this.questionService.remove(id);
}
  }







