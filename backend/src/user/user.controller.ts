/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':email')
  async findByEmail(@Param('email') email: string) {
    return await this.userService.findByEmail(email);
  }

  @Patch(':id')
  async update(@Param('id') userId: string, @Body() updateData: any) {
    return await this.userService.update(userId, updateData);
  }
}