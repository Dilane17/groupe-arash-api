import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminRole } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AdminRole.ADMIN)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: "Lister tous les administrateurs (ADMIN only)" })
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @ApiOperation({ summary: "Créer un nouvel administrateur (ADMIN only)" })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Révoquer l'accès d'un administrateur (ADMIN only)" })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.usersService.remove(id, req.user.sub);
  }
}
