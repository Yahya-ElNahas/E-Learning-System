/* eslint-disable prettier/prettier */
import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpStatus,
    HttpException,
  } from '@nestjs/common';
  import { NoteService } from './note.service';
  
  @Controller('notes')
  export class NoteController {
    constructor(private readonly noteService: NoteService) {}
  
    // Create a new note
    @Post()
    async createNote(@Body() body: {
      note_id: string;
      user_id: string;
      course_id?: string;
      content: string;
    }) {
      try {
        const { note_id, user_id, course_id, content } = body;
  
        if (!note_id || !user_id || !content) {
          throw new HttpException(
            'Missing required fields: note_id, user_id, content.',
            HttpStatus.BAD_REQUEST,
          );
        }
  
        const newNote = await this.noteService.create({
          note_id,
          user_id,
          course_id,
          content,
        });
  
        return { status: 'success', data: newNote };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  
    // Get all notes or filter by user/course
    @Get()
    async getAllNotes(
      @Query('user_id') userId?: string,
      @Query('course_id') courseId?: string,
    ) {
      try {
        const notes = await this.noteService.findAll(userId, courseId);
        return { status: 'success', data: notes };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // Get a note by ID
    @Get(':id')
    async getNoteById(@Param('id') id: string) {
      try {
        const note = await this.noteService.findById(id);
        if (!note) {
          throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
        }
        return { status: 'success', data: note };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // Update a note
    @Put(':id')
    async updateNote(
      @Param('id') id: string,
      @Body()
      body: {
        content?: string;
      },
    ) {
      try {
        const updatedNote = await this.noteService.update(id, body);
        if (!updatedNote) {
          throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
        }
        return { status: 'success', data: updatedNote };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  
    // Delete a note
    @Delete(':id')
    async deleteNote(@Param('id') id: string) {
      try {
        const deleted = await this.noteService.delete(id);
        if (!deleted) {
          throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
        }
        return { status: 'success', message: 'Note deleted successfully' };
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
  