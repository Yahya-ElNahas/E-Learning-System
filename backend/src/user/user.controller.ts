/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDocument } from './user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Create a new user
  @Post()
  async create(@Body() body: {
    email: string;
    password: string;
    role: string;
    isVerified: boolean;
  }): Promise<UserDocument> {
    return this.userService.create(body);
  }

  // Find all users
  @Get()
  async findAll(): Promise<UserDocument[]> {
    return this.userService.findAll();
  }

  // Find a user by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDocument> {
    return this.userService.findById(id);
  }

  // Find a user by email
  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<UserDocument> {
    return this.userService.findByEmail(email);
  }

  // Update user by ID
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: {
      email?: string;
      password?: string;
      role?: string;
      isVerified?: boolean;
    }
  ): Promise<UserDocument> {
    return this.userService.update(id, body);
  }

  // Delete a user by ID
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.userService.delete(id);
  }
}