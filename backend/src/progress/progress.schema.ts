import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProgressDocument = Progress & Document;

@Schema({ timestamps: true })
export class Progress {
  @Prop({ required: true, unique: true })
  progress_id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  course_id: string;

  @Prop({ required: true })
  completion_percentage: number;

  @Prop({ required: true })
  last_accessed: Date;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);