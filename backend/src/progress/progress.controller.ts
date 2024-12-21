/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req, Res } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Role } from '../auth/reflectors';
import { Role as UserRole } from '../user/user.schema';
import { Request, Response } from 'express';
import { Course } from 'src/course/course.schema';
import { Progress } from './progress.schema';
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.progressService.findOne(id);
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

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.STUDENT)
  async create(@Body() body: { course_id: string }, @Req() req: Request) {
    return this.progressService.create(body.course_id, req.cookies['verification_token']);
  }

  @Get('student/courses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.STUDENT)
  async findCoursesByStudent(@Req() req: Request): Promise<any[]> {
    return this.progressService.findCourseByStudent(req.cookies['verification_token'], true);
  }

  @Get('student/:studentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.STUDENT)
  async findByStudent(@Param('studentId') id: string): Promise<Progress> {
    return this.progressService.findByStudent(id);
  }

  @Get(':studentId/courses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.INSTRUCTOR)
  async findCoursesByStudentId(@Param('studentId') id: string): Promise<any[]> {
    return this.progressService.findCourseByStudent(id, false);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async findAll() {
    return this.progressService.findAll();
  }

  @Get(':courseId/analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.INSTRUCTOR)
  async getAnalytics(@Param('courseId') courseId: string) {
    return this.progressService.getInstructorAnalytics(courseId);
  }
}
