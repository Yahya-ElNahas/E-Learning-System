/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDocument } from './user.schema';
import { Role } from '../auth/reflectors';
import { RolesGuard, JwtAuthGuard } from '../auth/guards'; 
import { Role as UserRole } from './user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: { email: string; username: string; password: string; role: string; isVerified: boolean }): Promise<UserDocument> {
    return this.userService.create(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() body: { email?: string; username?: string; password?: string; role?: string; isVerified?: boolean }
  ): Promise<UserDocument> {
    return this.userService.update(id, body);
  }

  
  @Get('/students/all')
  @UseGuards(JwtAuthGuard)
  async getStudents(): Promise<UserDocument[]> {
    return this.userService.findByRole(UserRole.STUDENT);
  }
  
  @Get('/instructors/all')
  @UseGuards(JwtAuthGuard)
  async getInstructors(): Promise<UserDocument[]> {
    return this.userService.findByRole(UserRole.INSTRUCTOR);
  }
  
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)  
  async delete(@Param('id') id: string): Promise<void> {
    await this.userService.delete(id);
  }

  @Get('/admins/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  async getAdmins(): Promise<UserDocument[]> {
    return this.userService.findByRole(UserRole.ADMIN);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  async findAll(): Promise<UserDocument[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  async findOne(@Param('id') id: string): Promise<UserDocument> {
    return this.userService.findById(id);
  }

  @Get('email/:email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  async findByEmail(@Param('email') email: string): Promise<UserDocument> {
    return this.userService.findByEmail(email);
  }
}
