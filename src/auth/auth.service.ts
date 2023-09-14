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
import * as sendGrid from '@sendgrid/mail';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService, // Add ConfigService
  ) {
    // get sendGrid apikey from env file
    sendGrid.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }
  // login
  async login(authLoginDto: AuthLoginDto) {
    const user = await this.validateUser(authLoginDto);
    const payload = {
      userId: user.userId,
      firstName: user.firstName,
    };
    const accessToken = this.generateAccessToken(payload);
    return {
      message: 'login successful',
      access_token: accessToken,
    };
  }
  // jwt secret
  generateAccessToken(payload: { userId: string; firstName: string }): string {
    const options: CustomModuleOptions = {
      secret: process.env.JWT_SECRET,
    };
    return this.jwtService.sign(payload, options);
  }

  async validateUser(authLoginDto: AuthLoginDto): Promise<User> {
    const { email, password } = authLoginDto;

    const user = await this.usersService.findByEmail(email);
    if (!(await user?.validatePassword(password))) {
      throw new UnauthorizedException('wrong password');
    }
    return user;
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

  // SEND EMAIL FOR FORGOTPASSWORD
  async send(mail: sendGrid.MailDataRequired) {
    const transport = await sendGrid.send(mail);

    console.log(`Email successfully dispatched to ${mail.to}`);
    return transport;
  }
}
