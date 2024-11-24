import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProgressService } from './progress.service';

class CreateProgressDto {
  progressId: string;
  userId: string;
  courseId: string;
  completionPercentage: number;
  lastAccessed: Date;
}

class UpdateProgressDto {
  userId?: string;
  courseId?: string;
  completionPercentage?: number;
  lastAccessed?: Date;
}

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
  async create(@Body() createProgressDto: CreateProgressDto) {
    return this.progressService.create(createProgressDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProgressDto: UpdateProgressDto) {
    return this.progressService.update(id, updateProgressDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.progressService.remove(id);
  }
}
