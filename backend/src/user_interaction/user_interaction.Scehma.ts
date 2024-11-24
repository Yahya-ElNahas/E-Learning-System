/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserInteractionDocument = UserInteraction & Document;

@Schema({ timestamps: true })
export class UserInteraction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  course_id: Types.ObjectId;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  time_spent_minutes: number;
}

export const UserInteractionSchema = SchemaFactory.createForClass(UserInteraction);
