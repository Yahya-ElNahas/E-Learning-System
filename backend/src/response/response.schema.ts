/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResponseDocument = Response & Document;

@Schema({ timestamps: true })
export class Response {
  @Prop({ required: true, unique: true })
  response_id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  quiz_id: string;

  @Prop({ required: true })
  answers: Array<any>; 

  @Prop({ required: true })
  score: number;

  @Prop({ default: Date.now })
  submitted_at: Date;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);