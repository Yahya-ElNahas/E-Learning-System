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
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { Course } from './course.schema';
import { Difficulty } from './course.schema';
import { Role } from 'src/auth/reflectors';
import { Role as UserRole } from 'src/user/user.schema';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard) // Ensure all routes in the controller are protected by these guards
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Role(UserRole.INSTRUCTOR) // Only instructors can create courses
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
  @Role(UserRole.INSTRUCTOR) // Only instructors can update courses
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
  @Role(UserRole.INSTRUCTOR) // Only instructors can delete courses
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


