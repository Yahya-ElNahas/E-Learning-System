import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { Course } from './course.schema';
import { Difficulty } from './course.schema';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  async create(
    @Body()
    body: {
      title: string;
      description: string;
      category: string;
      difficulty_level: Difficulty;
      created_by: string;
    },
  ): Promise<Course> {
    return this.courseService.create(body);
  }

  @Get()
  async findAll(): Promise<Course[]> {
    return this.courseService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Course> {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      description?: string;
      category?: string;
      difficulty_level?: Difficulty;
      created_by?: string;
    },
  ): Promise<Course> {
    return this.courseService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.courseService.remove(id);
  }

  @Get('search/title')
  async searchByTitle(@Query('title') title: string): Promise<Course[]> {
    if (!title) {
      throw new BadRequestException('Title query parameter is required');
    }
    return this.courseService.searchByTitle(title);
  }

  @Get('search/instructor')
  async searchByInstructor(@Query('createdBy') createdBy: string): Promise<Course[]> {
    if (!createdBy) {
      throw new BadRequestException('CreatedBy query parameter is required');
    }
    return this.courseService.searchByInstructor(createdBy);
  }
}

