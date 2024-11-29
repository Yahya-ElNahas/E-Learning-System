/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { NoteService } from './note.service';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { Role } from 'src/auth/reflectors';
import { Role as UserRole } from 'src/user/user.schema';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.STUDENT)
  async create(@Body() body: { 
    user_id: string, 
    course_id?: string, 
    content: string 
  }) {
    return this.noteService.create(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.STUDENT)
  async findAll() {
    return this.noteService.findAll();
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
