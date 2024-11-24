/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RecommendationDocument = Recommendation & Document;

@Schema({ timestamps: true })
export class Recommendation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: [String], required: true })
  recommended_items: string[];
}

export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);
