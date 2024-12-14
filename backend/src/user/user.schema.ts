/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum Role {
  ADMIN = 'admin',
  STUDENT = 'student',
  INSTRUCTOR = 'instructor'
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true})
  username: string

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ required: false })
  otp: string | null;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: Role, default: Role.STUDENT })
  role: Role;

  @Prop({ required: false })
  profile_picture_url?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
