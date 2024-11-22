/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  user_id: string;


  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['student', 'instructor', 'admin'] })
  role: string;

  @Prop({ required: false })
  profile_picture_url?: string;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);