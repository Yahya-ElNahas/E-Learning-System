/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ModuleDocument = Module & Document;

@Schema({ timestamps: true })
export class Module {
  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  course_id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  isOutdated: boolean;

  @Prop({
    type: [
      {
        path: { type: String, required: true },
        type: { type: String, required: true },
      }
    ],
    required: false
  })
  resources?: { path: string; type: string }[];
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
