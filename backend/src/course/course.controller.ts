import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { Course } from './course.schema';
import { Difficulty } from './course.schema';
import { Role } from 'src/auth/reflectors';
import { Role as UserRole } from 'src/user/user.schema';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.INSTRUCTOR)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.INSTRUCTOR)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.INSTRUCTOR)
  async remove(@Param('id') id: string): Promise<void> {
    return this.courseService.remove(id);
  }

  @Get('search')
  async search(
    @Query('topic') topic?: string,
    @Query('instructor') instructor?: string,
  ): Promise<Course[]> {
    return this.courseService.searchCourses({ topic, instructor });
  }
}
