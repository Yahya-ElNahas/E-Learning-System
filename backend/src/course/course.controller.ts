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
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Course[]> {
    return this.courseService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Course> {
    return this.courseService.findOne(id);
  }

  @Get('search/title')
  @UseGuards(JwtAuthGuard)
  async searchByTitle(@Query('title') title: string): Promise<Course[]> {
    if (!title) {
      throw new BadRequestException('Title query parameter is required');
    }
    return this.courseService.searchByTitle(title);
  }

  @Get('search/instructor')
  @UseGuards(JwtAuthGuard)
  async searchByInstructor(@Query('createdBy') createdBy: string): Promise<Course[]> {
    if (!createdBy) {
      throw new BadRequestException('CreatedBy query parameter is required');
    }
    return this.courseService.searchByInstructor(createdBy);
  }

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
}


