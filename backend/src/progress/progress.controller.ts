import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.progressService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.progressService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: {
    user_id: string,
    course_id: string,
    completion_percentage: number
  }) {
    return this.progressService.create(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() body: {
    user_id?: string,
    course_id?: string,
    completion_percentage?: number
  }) {
    return this.progressService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.progressService.remove(id);
  }
}
