import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('forgot-password')
export class ForgotPasswordController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}
  private generatedOTP(): { otp: string; expiresAt: Date } {
    const min = 1000;
    const max = 9999;
    const otp = (Math.floor(Math.random() * (max - min)) + min).toString();
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);
    return { otp, expiresAt: expirationTime };
  }

  // sends email for forgot password
  @Post('send/email')
  async sendEmail(@Body('email') email: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return 'EMAIL NOT FOUND';
    }
    const { otp, expiresAt } = this.generatedOTP();
    user.otp = otp;
    user.otpExpiresAt = expiresAt;
    await user.save();

    const mail = {
      from: 'mozne2r@gmail.com',
      to: user.email,
      subject: 'reset password',
      text: `reset password OTP,expires in 5 minutes: ${otp}`,
    };
    return await this.authService.send(mail);
  }
}
