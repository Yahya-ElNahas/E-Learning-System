/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './note.schema';
import { isIdValid } from 'src/helper';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name) private readonly noteModel: Model<NoteDocument>,
    private readonly authService: AuthService,
  ) {}

  async create(token: string, body: { 
    course_id?: string, 
  }) {
    if(body.course_id) isIdValid(body.course_id);
    const user_id = this.authService.GetIdFromToken(token);
    body['user_id'] = user_id;
    console.log(body)
    const createdNote = new this.noteModel(body);
    return createdNote.save();
  }

  async findAll() {
    return this.noteModel.find().exec();
  }

  async findOne(id: string) {
    isIdValid(id);
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async update(
    id: string,
    body: { 
      content?: string, 
      course_id?: string 
    }
  ) {
    isIdValid(id);
    if(body.course_id) isIdValid(body.course_id);
    const updatedNote = await this.noteModel.findByIdAndUpdate(id, body, { new: true }).exec();
    if (!updatedNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return updatedNote;
  }

  async remove(id: string) {
    isIdValid(id);
    const deletedNote = await this.noteModel.findByIdAndDelete(id).exec();
    if (!deletedNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return deletedNote;
  }

  async findStudentNotes(token: string): Promise<NoteDocument[]> {
    const user_id = this.authService.GetIdFromToken(token);
    return this.noteModel.find({user_id}).exec();
  }
}
