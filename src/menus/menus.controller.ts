import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenuDto } from './dto/create-menu.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard,RolesGuard)
  create(@Body() menuDto: MenuDto){
    return this.menusService.create(menuDto);
  }

    @Get()
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard,RolesGuard)
     findAll() {
     return this.menusService.findAll();
  }
}
