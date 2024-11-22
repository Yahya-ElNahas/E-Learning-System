/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ModuleDocument = Module & Document;

@Schema({ timestamps: true })
export class Module {
  @Prop({ required: true, unique: true })
  module_id: string;

  @Prop({ required: true })
  course_id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], required: false })
  resources?: string[];

  @Prop({ default: Date.now })
  created_at: Date;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);