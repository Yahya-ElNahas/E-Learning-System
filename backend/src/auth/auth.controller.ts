/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Res, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request,Response } from 'express';
let s = {
  ssss:"rrr"
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  

  @Get('check-verification')
  checkVerification(@Req() req: Request) {
    const verificationToken = req.cookies['verification_token'];
    console.log(verificationToken); 
    return {
      status: 'oh yah',
      verificationToken: verificationToken
    };
  }
  
  @Post('register')
  async register(@Body() userDto: any, @Res({ passthrough: true }) res: Response,@Req() req:Request): Promise<any> {
    return this.authService.register(userDto, res , req.cookies); 
  }

  @Post('login')
  async login(@Body() credentials: { email: string; password: string }) {
    return this.authService.login(credentials);
  }

  @Post('verify-email')
  async verifyEmail(@Body() { token, otp }: { token: string; otp: string }) {
    return this.authService.verifyEmail(token, otp);
  }
}
