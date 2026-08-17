import {Body,Controller,Post} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/account.dto';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
  ) {}

  @Post('register')
  create(@Body() dto: CreateAccountDto) {
    return this.accountService.create(dto);
  }
}
