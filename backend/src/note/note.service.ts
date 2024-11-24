/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './note.schema';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name) private readonly noteModel: Model<NoteDocument>,
  ) {}

  async create(data: { user_id: string; course_id?: string; content: string }) {
    const createdNote = new this.noteModel(data);
    return createdNote.save();
  }

  async findAll(filters: { user_id: string; course_id?: string }) {
    const query: any = { user_id: filters.user_id };
    if (filters.course_id) {
      query.course_id = filters.course_id;
    }
    return this.noteModel.find(query).exec();
  }

  async findOne(id: string) {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async update(
    id: string,
    data: { content?: string; course_id?: string },
  ) {
    const updatedNote = await this.noteModel
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();
    if (!updatedNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return updatedNote;
  }

  async remove(id: string) {
    const deletedNote = await this.noteModel.findByIdAndDelete(id).exec();
    if (!deletedNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return deletedNote;
  }
}
