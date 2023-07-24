import { Controller, Body, Post, Delete, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';

@Controller('user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto);
  }

  @Delete(':id')
  async logout(@Param('id') id: string) {
    await this.authService.deleteUser(id);
    return { message: 'user deleted successfully' };
  }
}
