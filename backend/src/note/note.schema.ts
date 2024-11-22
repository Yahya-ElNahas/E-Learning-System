/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema({ timestamps: true })
export class Note {
  @Prop({ required: true, unique: true })
  note_id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: false })
  course_id?: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  last_updated: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);