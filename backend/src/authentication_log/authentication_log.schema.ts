/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuthenticationLogDocument = AuthenticationLog & Document;

@Schema({ timestamps: true })
export class AuthenticationLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true, enum: ['LOGIN', 'LOGOUT', 'FAILED_LOGIN', 'PASSWORD_RESET'] })
  event: string;

  @Prop({ required: true, enum: ['SUCCESS', 'FAILURE'] })
  status: string;
}

export const AuthenticationLogSchema = SchemaFactory.createForClass(AuthenticationLog);
