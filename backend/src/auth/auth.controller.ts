/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userDto: any) {
    return await this.authService.register(userDto);
  }

  @Post('login')
  async login(@Body() credentials: any) {
    return await this.authService.login(credentials);
  }

  @Post('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return await this.authService.verifyEmail(token);
  }
}