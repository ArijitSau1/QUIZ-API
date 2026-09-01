import {Body,Controller,FileTypeValidator,Get,MaxFileSizeValidator,Param,ParseFilePipe,Post,Put,UploadedFile,UseGuards, UseInterceptors,} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { PermissionAction, UserRole } from 'src/enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { CheckPermissions } from 'src/auth/decorators/permissions.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';


@Controller('quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard,PermissionsGuard)
  @CheckPermissions([PermissionAction.CREATE,'quiz'])
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
  @UseGuards(AuthGuard('jwt'), RolesGuard,PermissionsGuard)
  @CheckPermissions([PermissionAction.READ,'quiz'])
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }

  @Put(':id/close')
  @UseGuards(AuthGuard('jwt'), RolesGuard,PermissionsGuard)
  @CheckPermissions([PermissionAction.UPDATE,'quiz'])
  @Roles(UserRole.ADMIN)
  close(@Param('id') id: string) {
    return this.quizService.close(id);
  }

  @Put(':id/image')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/Quiz',
      filename: (req, file, callback) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');

       return callback(
          null,
          `${randomName}${extname(file.originalname)}`,
        );
      },
    }),
  }),
)
async uploadQuizImage(
  @Param('id') id: string,
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({
          fileType: '.(png|jpeg|jpg)',
        }),
        new MaxFileSizeValidator({
          maxSize: 1024 * 1024*1,
        }),
      ],
    }),
  )
  file: Express.Multer.File,
) {
  return this.quizService.uploadImage(id, file.path);
}
}
