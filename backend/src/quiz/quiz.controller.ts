/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Quiz } from './quiz.schema';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Role } from '../auth/reflectors';
import { Role as UserRole } from '../user/user.schema';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Quiz[]> {
    return this.quizService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Quiz> {
    return this.quizService.findOne(id);
  }

  @Get('module/:id')
  @UseGuards(JwtAuthGuard)
  async findOneByModule(@Param('id') id: string): Promise<Quiz> {
    return this.quizService.findOneByModule(id);
  }
  
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.INSTRUCTOR)
  async create(@Body() body: {
    module_id: string,
    questions: Array<{
      question: string,
      options: string[],
      correctAnswer: string
    }>
  }): Promise<Quiz> {
    return this.quizService.create(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.INSTRUCTOR)
  async update(
    @Param('id') id: string,
    @Body() body: {
      module_id?: string,
      questions?: Array<{
        question: string,
        options: string[],
        correctAnswer: string
      }>
    }
  ): Promise<Quiz> {
    return this.quizService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.INSTRUCTOR)
  async delete(@Param('id') id: string): Promise<void> {
    await this.quizService.delete(id);
  }
}
