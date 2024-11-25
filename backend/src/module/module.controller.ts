import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ModuleService } from './module.service';
import { Module } from './module.schema';

@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  async create(@Body() body: {
    course_id: string,
    title: string,
    content: string,
    resources?: string[]
  }): Promise<Module> {
    return this.moduleService.create(body);
  }

  @Get()
  async findAll(): Promise<Module[]> {
    return this.moduleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Module> {
    return this.moduleService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: {
      course_id?: string,
      title?: string,
      content?: string,
      resources?: string[]
    }
  ): Promise<Module> {
    return this.moduleService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.moduleService.delete(id);
  }
}
