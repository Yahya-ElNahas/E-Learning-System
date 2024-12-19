/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResponseDocument = Response & Document;

@Schema({ timestamps: true })
export class Response {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Quiz', required: true })
  quiz_id: Types.ObjectId;

  @Prop({ type: [{ question: String, correctAnswer: String, answer: String }], required: true })
  answers: Array<{
    question: string;
    correctAnswer: string;
    answer: string; 
  }>;

  @Prop({ required: true })
  score: number;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
