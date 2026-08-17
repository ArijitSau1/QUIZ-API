import {Body,Controller,Get,Post,UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt.guards';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { RolesGuard } from './guards/roles.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Account } from 'src/account/entities/account.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signin(@Body() dto: LoginDto) {
    return this.authService.signIn(dto.email, dto.password);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard,RolesGuard)
  profile(@CurrentUser() user:Account) {
    return user;
  }
}
