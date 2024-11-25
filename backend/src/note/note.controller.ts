/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { NoteService } from './note.service';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  async create(@Body() body: { 
    user_id: string, 
    course_id?: string, 
    content: string 
  }) {
    return this.noteService.create(body);
  }

  @Get()
  async findAll() {
    return this.noteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.noteService.findOne(id);
  }

  @Put(':id')
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
  async remove(@Param('id') id: string) {
    return this.noteService.remove(id);
  }
}
