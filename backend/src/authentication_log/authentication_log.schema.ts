/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthenticationLogDocument = AuthenticationLog & Document;

@Schema({ timestamps: true })
export class AuthenticationLog {
  @Prop({ required: true, unique: true })
  log_id: string;

  @Prop({ required: true })
  user_id: string; 

  @Prop({ required: true })
  event: string; 

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  status: string; 
}

export const AuthenticationLogSchema = SchemaFactory.createForClass(AuthenticationLog);