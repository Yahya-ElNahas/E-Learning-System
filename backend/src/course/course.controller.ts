/* eslint-disable prettier/prettier */
import {
    Controller,
    Post,
    Get,
    Put,
    Body,
    Param,
    Query,
    HttpStatus,
    HttpException,
  } from '@nestjs/common';
  import { CourseService } from './course.service';
  
  @Controller('courses')
  export class CourseController {
    constructor(private readonly courseService: CourseService) {}
  
    
    @Post()
    async createCourse(@Body() body: {
      course_id: string;
      title: string;
      description: string;
      category: string;
      difficulty_level: string;
      created_by: string;
    }) {
      try {
        const { course_id, title, description, category, difficulty_level, created_by } = body;
  
        if (!course_id || !title || !description || !category || !difficulty_level || !created_by) {
          throw new HttpException(
            'Missing required fields: course_id, title, description, category, difficulty_level, created_by.',
            HttpStatus.BAD_REQUEST,
          );
        }
  
        const newCourse = await this.courseService.create({
          course_id,
          title,
          description,
          category,
          difficulty_level,
          created_by,
        });
  
        return { status: 'success', data: newCourse };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  
    
    @Get()
    async getAllCourses(@Query('search') search?: string) {
      try {
        const courses = await this.courseService.findAll(search);
        return { status: 'success', data: courses };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    
    @Get(':id')
    async getCourseById(@Param('id') id: string) {
      try {
        const course = await this.courseService.findById(id);
        if (!course) {
          throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
        }
        return { status: 'success', data: course };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    
    @Put(':id')
    async updateCourse(
      @Param('id') id: string,
      @Body()
      body: {
        title?: string;
        description?: string;
        category?: string;
        difficulty_level?: string;
      },
    ) {
      try {
        const updatedCourse = await this.courseService.update(id, body);
        if (!updatedCourse) {
          throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
        }
        return { status: 'success', data: updatedCourse };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  
   
    @Get('search')
    async search(@Query('query') query: string) {
      try {
        const result = await this.courseService.searchCourses(query);
        return { status: 'success', data: result };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  