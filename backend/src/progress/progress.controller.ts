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
  import { ProgressService } from './progress.service';
  
  @Controller('progress')
  export class ProgressController {
    constructor(private readonly progressService: ProgressService) {}
  
    // Create Progress
    @Post()
    async createProgress(@Body() body: {
      progress_id: string;
      user_id: string;
      course_id: string;
      completion_percentage: number;
      last_accessed: Date;
    }) {
      try {
        const { progress_id, user_id, course_id, completion_percentage, last_accessed } = body;
  
        // Validate required fields
        if (!progress_id || !user_id || !course_id || completion_percentage == null || !last_accessed) {
          throw new HttpException(
            'Missing required fields: progress_id, user_id, course_id, completion_percentage, last_accessed.',
            HttpStatus.BAD_REQUEST,
          );
        }
  
        const newProgress = await this.progressService.create({
          progress_id,
          user_id,
          course_id,
          completion_percentage,
          last_accessed,
        });
  
        return { status: 'success', data: newProgress };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  
    // Get All Progress Records or Search by User/Course
    @Get()
    async getAllProgress(@Query('user_id') userId?: string, @Query('course_id') courseId?: string) {
      try {
        const progress = await this.progressService.findAll(userId, courseId);
        return { status: 'success', data: progress };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // Get Progress By ID
    @Get(':id')
    async getProgressById(@Param('id') id: string) {
      try {
        const progress = await this.progressService.findById(id);
        if (!progress) {
          throw new HttpException('Progress record not found', HttpStatus.NOT_FOUND);
        }
        return { status: 'success', data: progress };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // Update Progress
    @Put(':id')
    async updateProgress(
      @Param('id') id: string,
      @Body()
      body: {
        completion_percentage?: number;
        last_accessed?: Date;
      },
    ) {
      try {
        const updatedProgress = await this.progressService.update(id, body);
        if (!updatedProgress) {
          throw new HttpException('Progress record not found', HttpStatus.NOT_FOUND);
        }
        return { status: 'success', data: updatedProgress };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
  