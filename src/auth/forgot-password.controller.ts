import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
// import * as mailgun from 'mailgun-js';
import { Inject } from '@nestjs/common';

@Controller('forgot-password')
export class ForgotPasswordController {
  constructor(
    private readonly userService: UsersService, // @Inject('MAILGUN_CLIENT') // private readonly mailgunClient: mailgun.Mailgun,
  ) {}
  private generatedOTP(): { otp: string; expiresAt: Date } {
    const min = 1000;
    const max = 9999;
    const otp = (Math.floor(Math.random() * (max - min)) + min).toString();
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);
    return { otp, expiresAt: expirationTime };
  }

  @Post()
  async forgotPassword(@Body('email') email: string): Promise<string> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return 'EMAIL NOT FOUND';
    }

    const { otp, expiresAt } = this.generatedOTP();
    user.otp = otp;
    user.otpExpiresAt = expiresAt;
    await user.save();

    // const data: mailgun.messages.SendData = {
    //   from: 'alvinkingwa433@gmail.com',
    //   to: user.email,
    //   subject: 'reset password',
    //   text: `To reset your password, click the following link: ${otp}`,
    // };
    // this.mailgunClient.messages().send(data, (error, body) => {
    //   if (error) {
    //     console.error('error sending email', error);
    //   } else {
    //     console.log('Email sent:', body);
    //   }
    // });
    return 'Email sent with instructions to reset the password.';
  }
}
