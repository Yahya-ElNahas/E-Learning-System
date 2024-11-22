/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserInteractionDocument = UserInteraction & Document;

@Schema({ timestamps: true })
export class UserInteraction {
  @Prop({ required: true, unique: true })
  interaction_id: string;

  @Prop({ required: true })
  user_id: string; 

  @Prop({ required: true })
  course_id: string; 

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  time_spent_minutes: number; 

  @Prop({ default: Date.now })
  last_accessed: Date;
}

export const UserInteractionSchema = SchemaFactory.createForClass(UserInteraction);