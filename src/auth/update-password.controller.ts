import { Controller, Post, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { TokenService } from './token.service';

@Controller('update-password')
export class UpdatePasswordController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post(':email')
  async updatePassword(
    @Param('email') email: string,
    @Body('password') password: string,
  ): Promise<string> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return 'User not found';
    }

    await this.authService.updatePassword(user, password);

    return 'Password updated successfully';
  }
}
