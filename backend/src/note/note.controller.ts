/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req, Res } from '@nestjs/common';
import { NoteService } from './note.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Role } from '../auth/reflectors';
import { Role as UserRole } from '../user/user.schema';
import { Request, Response } from 'express';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.STUDENT)
  async create(@Body() body: { 
      course_id?: string, 
    },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.noteService.create(req.cookies['verification_token'], body);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.STUDENT)
  async findAll() {
    return this.noteService.findAll();
  }

  @Get('student/all-notes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.STUDENT)
  async findStudentNotes(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.noteService.findStudentNotes(req.cookies['verification_token']);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.STUDENT)
  async findOne(@Param('id') id: string) {
    return this.noteService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.STUDENT)
  async update(
    @Param('id') id: string,
    @Body() body: { 
      content?: string,
      course_id?: string 
    }
  ) {
    return this.noteService.update(id, body);
  } 

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.STUDENT)
  async remove(@Param('id') id: string) {
    return this.noteService.remove(id);
  }
}
