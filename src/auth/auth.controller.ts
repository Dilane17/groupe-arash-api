import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion administrateur' })
  @ApiResponse({ 
    status: 200, 
    description: 'Authentification réussie, retourne le token JWT.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1...',
        user: {
          id: 'cuid...',
          email: 'admin@groupearash.com',
          name: 'Admin',
          role: 'ADMIN'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Identifiants invalides.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
