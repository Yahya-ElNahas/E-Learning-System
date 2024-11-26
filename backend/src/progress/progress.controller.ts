import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  async findAll() {
    return this.progressService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.progressService.findOne(id);
  }

  @Post()
  async create(@Body() body: {
    user_id: string,
    course_id: string,
    completion_percentage: number
  }) {
    return this.progressService.create(body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: {
    user_id?: string,
    course_id?: string,
    completion_percentage?: number
  }) {
    return this.progressService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.progressService.remove(id);
  }
}
