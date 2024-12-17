/* eslint-disable @typescript-eslint/no-unused-vars */

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { setEngine } from 'crypto';
import { Document, Types } from 'mongoose';

export type CourseDocument = Course & Document;

export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, enum: Difficulty })
  difficulty_level: Difficulty;

  @Prop({ type: Types.ObjectId, required: true })
  created_by: Types.ObjectId;


  @Prop({ type: Boolean, default: true })
  isAvailable: boolean;  
  
  @Prop({ type: [String], default: [] })
  keywords: string[];
  
}

export const CourseSchema = SchemaFactory.createForClass(Course);
