import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenService } from './token.service';
import { ConfigService } from '@nestjs/config';
import { CustomModuleOptions } from './custom-module-options/custom-module-options.interface';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService, // Add ConfigService
  ) {}

  async login(authLoginDto: AuthLoginDto) {
    const user = await this.validateUser(authLoginDto);
    const payload = {
      userId: user.userId,
    };
    const accessToken = this.generateAccessToken(payload);
    return {
      access_token: accessToken,
    };
  }
  generateAccessToken(payload: { userId: string }): string {
    const options: CustomModuleOptions = {
      secret: process.env.JWT_SECRET,
    };
    return this.jwtService.sign(payload, options);
  }

  async validateUser(authLoginDto: AuthLoginDto): Promise<User> {
    const { email, password } = authLoginDto;

    const user = await this.usersService.findByEmail(email);
    if (!(await user?.validatePassword(password))) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.usersService.findById(userId);
    user.remove();
  }

  async generateResetToken(user: User, otp: string): Promise<User> {
    const resetToken = await this.tokenService.generateToken({
      userId: user.userId,
      otp,
    });
    user.otp = resetToken;
    await user.save();
    return user;
  }

  async updatePassword(user: User, newPassword: string): Promise<User> {
    user.password = await bcrypt.hash(newPassword, 8);
    return this.userRepository.save(user);
  }
}
