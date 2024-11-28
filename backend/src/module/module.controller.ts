import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ModuleService } from './module.service';
import { Module } from './module.schema';
import { Role as UserRole } from 'src/user/user.schema';
import { Role } from 'src/auth/reflectors';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';

@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.INSTRUCTOR)
  async create(@Body() body: {
    course_id: string,
    title: string,
    content: string,
    resources?: [{link: string; type: string}]
  }): Promise<Module> {
    return this.moduleService.create(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Module[]> {
    return this.moduleService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Module> {
    return this.moduleService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.INSTRUCTOR)
  async update(
    @Param('id') id: string,
    @Body() body: {
      course_id?: string,
      title?: string,
      content?: string,
      resources?: [{link: string; type: string}]
    }
  ): Promise<Module> {
    return this.moduleService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.INSTRUCTOR)
  async delete(@Param('id') id: string): Promise<void> {
    await this.moduleService.delete(id);
  }
}
