/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true, unique: true })
  course_id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })
  difficulty_level: string;

  @Prop({ required: true })
  created_by: string;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);