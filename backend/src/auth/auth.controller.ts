/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userDto: any) {
    return this.authService.register(userDto);
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