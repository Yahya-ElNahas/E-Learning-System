import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuizDocument = Quiz & Document;

@Schema({ timestamps: true })
export class Quiz {
  @Prop({ required: true, unique: true })
  quiz_id: string;

  @Prop({ required: true })
  module_id: string; 

  @Prop({ required: true })
  questions: Array<any>; 

  @Prop({ default: Date.now })
  created_at: Date;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);