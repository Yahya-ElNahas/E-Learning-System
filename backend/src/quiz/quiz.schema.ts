/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuizDocument = Quiz & Document;

@Schema({ timestamps: true })
export class Quiz {
  @Prop({ type: Types.ObjectId, ref: 'Module', required: true })
  module_id: Types.ObjectId;

  @Prop({ type: [{ question: String, options: [String], correctAnswer: String }], required: true })
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
