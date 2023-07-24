import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { url } = request;

    // Allow access to the /api/users and /api/auth routes without authentication
    if (
      url.includes('/api/user/signup') ||
      url.includes('/api/user/login') ||
      url.includes('/api/forgot-password') ||
      url.includes('/api/update-password') ||
      url.includes('/api/verify-otp')
    ) {
      return true;
    }

    const authToken = request.headers.authorization;

    if (!authToken || !authToken.startsWith('Bearer ')) {
      return false;
    }

    const token = authToken.split(' ')[1];

    try {
      const decodedToken = this.jwtService.verify(token);

      const userId = decodedToken.userId;
      const user = await this.usersService.findById(userId);

      if (!user) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
