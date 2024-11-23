/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './note.schema';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name) private readonly noteModel: Model<NoteDocument>,
  ) {}

  // Create a new note
  async create(noteData: {
    note_id: string;
    user_id: string;
    course_id?: string;
    content: string;
  }): Promise<Note> {
    const { note_id, user_id, course_id, content } = noteData;

    const newNote = new this.noteModel({
      note_id,
      user_id,
      course_id,
      content,
      created_at: new Date(),
      last_updated: new Date(),
    });

    return newNote.save();
  }

  // Get all notes or filter by user/course
  async findAll(user_id?: string, course_id?: string): Promise<Note[]> {
    const filter: Record<string, string> = {};
    if (user_id) {
      filter.user_id = user_id;
    }
    if (course_id) {
      filter.course_id = course_id;
    }

    return this.noteModel.find(filter).exec();
  }

  // Get a note by ID
  async findById(id: string): Promise<Note> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found.`);
    }
    return note;
  }

  // Update a note
  async update(
    id: string,
    updateData: {
      content?: string;
    },
  ): Promise<Note> {
    if (!updateData.content) {
      throw new BadRequestException('Content must be provided for update.');
    }

    const updatedNote = await this.noteModel
      .findByIdAndUpdate(
        id,
        { ...updateData, last_updated: new Date() },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedNote) {
      throw new NotFoundException(`Note with ID ${id} not found.`);
    }

    return updatedNote;
  }

  // Delete a note
  async delete(id: string): Promise<boolean> {
    const result = await this.noteModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Note with ID ${id} not found.`);
    }
    return true;
  }
}
