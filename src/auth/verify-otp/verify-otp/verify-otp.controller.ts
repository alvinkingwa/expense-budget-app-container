import { Body, Controller, Param, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Controller('verify-otp')
export class VerifyOtpController {
  constructor(private readonly userService: UsersService) {}

  // verify otp token
  @Post(':email')
  async verifyOTP(
    @Param('email') email: string,
    @Body('otp') otp: string,
  ): Promise<string> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return 'User not found';
    }
    if (user.otp !== otp) {
      return 'Invalid OTP';
    }

    const now = new Date();
    if (user.otpExpiresAt && now > user.otpExpiresAt) {
      return 'OTP has expired';
    }

    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return 'OTP verified successfully';
  }
}
