import {Body,Controller,Get,Post,Res,UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt.guards';
import { RolesGuard } from './guards/roles.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Account } from 'src/account/entities/account.entity';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

//   @Post('login')
// signin(@Body() dto: LoginDto) {
//   return this.authService.signIn(dto.email, dto.password);
// }

 @Post('login')
async signin(
  @Body() dto: LoginDto,
  @Res({ passthrough: true }) response: Response,
) {
  const result = await this.authService.signIn(
    dto.email,
    dto.password,
  );

  response.cookie('access_token', result.token, {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return {
    message: 'Login successful',
  };
}

  @Get('profile')
  @UseGuards(JwtAuthGuard,RolesGuard)
  profile(@CurrentUser() user:Account) {
    return user;
  }
}
