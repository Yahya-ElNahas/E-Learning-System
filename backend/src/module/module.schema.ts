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

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ enum: ['beginner', 'intermediate', 'advanced'],  required: true })
  difficulty_level: string;

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

  @Prop({ type: [Number], required: false })
  ratings?: number[];

}

export const ModuleSchema = SchemaFactory.createForClass(Module);
