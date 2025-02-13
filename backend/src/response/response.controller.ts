/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Put,
  Delete,
  UseGuards,
  Req,
  Res
} from '@nestjs/common';
import { ResponseService } from './response.service';
import { Response } from './response.schema';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Role } from 'src/auth/reflectors';
import { Role as UserRole } from 'src/user/user.schema';
import { Request, Response as Resp } from 'express';

@Controller('responses')
export default class ResponseModel {
  constructor(private readonly responseService: ResponseService) {}

  /**
   * Fetch all responses.
   * @returns Array of response documents.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Response[]> {
    return this.responseService.findAll();
  }

  /**
   * Fetch a single response by its ID.
   * @param id Response ID.
   * @returns Single response document.
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Response> {
    return this.responseService.findOne(id);
  }
  @Get('student/quiz/:id')
  @UseGuards(JwtAuthGuard)
  async findByQuiz(@Param('id') id: string): Promise<Response[]> {
    console.log(id)
    return this.responseService.findByQuiz(id);
  }

  @Get(':courseId/avgScore')
  @UseGuards(JwtAuthGuard)
  async averageScoresByCourse(@Param('courseId') id: string): Promise<{average: string}> {
    return this.responseService.averageScoresByCourse(id);
  }

  @Get('student/avgScore/all')
  @UseGuards(JwtAuthGuard)
  async averageScoreByStudent(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Resp,
  ): Promise<{average: string}> {
    return this.responseService.averageScoreByStudent(req.cookies['verification_token']);
  }
  
  /**
   * Create a new response.
   * @param data Partial response object.
   * @returns Created response document.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: Partial<Response>): Promise<Response> {
    return this.responseService.create(data);
  }

  /**
   * Partially update a response by its ID.
   * @param id Response ID.
   * @param data Partial response object to update.
   * @returns Acknowledgment of the update.
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updatePartial(
    @Param('id') id: string,
    @Body() data: Partial<Response>,
  ): Promise<{ acknowledgment: boolean }> {
    await this.responseService.updatePartial(id, data);
    return { acknowledgment: true };
  }

  /**
   * Fully update a response by its ID.
   * @param id Response ID.
   * @param data Full response object.
   * @returns Acknowledgment of the update.
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateFull(
    @Param('id') id: string,
    @Body() data: Partial<Response>,
  ): Promise<{ acknowledgment: boolean }> {
    await this.responseService.updateFull(id, data);
    return { acknowledgment: true };
  }

  /**
   * Delete a response by its ID.
   * @param id Response ID.
   * @returns Acknowledgment of the deletion.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<{ acknowledgment: boolean }> {
    await this.responseService.delete(id);
    return { acknowledgment: true };
  }

  @Post('student/quiz')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.STUDENT)
  async respondToStudentQuiz(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Resp,
    @Body() body: Partial<Response>
  ) {
    this.responseService.respondToStudentQuiz(req.cookies['verification_token'], body);
  }
}
