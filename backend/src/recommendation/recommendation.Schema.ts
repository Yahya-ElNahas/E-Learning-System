/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecommendationDocument = Recommendation & Document;

@Schema({ timestamps: true })
export class Recommendation {
  @Prop({ required: true, unique: true })
  recommendation_id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  recommended_items: string[]; 

  @Prop({ default: Date.now })
  generated_at: Date; 
}

export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);