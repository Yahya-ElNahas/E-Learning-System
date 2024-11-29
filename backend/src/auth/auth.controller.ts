/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('check-verification')
  checkVerification(@Req() req: Request) {
    const verificationToken = req.cookies['verification_token'];
    console.log(verificationToken);
    return {
      status: 'oh yah',
      verificationToken: verificationToken,
    };
  }

  @Post('register')
  async register(
    @Body() userDto: any,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    return this.authService.register(userDto, req.cookies, res);
  }

  @Post('login')
  async login(
    @Body() credentials: { email: string; password: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ access_token: string }> {
    return this.authService.login(credentials, req.cookies, res);
  }

  @Post('verify-email')
  // @UseGuards(JwtAuthGuard)
  async verifyEmail(@Body() { token, otp }: { token: string; otp: string }) {
    return this.authService.verifyEmail(token, otp);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
