/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { NoteService } from './note.service';
import { JwtAuthGuard } from 'src/auth/guards';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: { 
    user_id: string, 
    course_id?: string, 
    content: string 
  }) {
    return this.noteService.create(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.noteService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.noteService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.noteService.remove(id);
  }
}
