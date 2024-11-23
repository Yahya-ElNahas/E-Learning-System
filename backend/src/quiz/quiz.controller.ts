import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Quiz } from './quiz.schema';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  async create(@Body() createQuizDto: Partial<Quiz>): Promise<Quiz> {
    return this.quizService.create(createQuizDto);
  }

  @Get()
  async findAll(): Promise<Quiz[]> {
    return this.quizService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Quiz> {
    return this.quizService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuizDto: Partial<Quiz>
  ): Promise<Quiz> {
    return this.quizService.update(id, updateQuizDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.quizService.delete(id);
  }
}
