import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId; 

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  recipient: Types.ObjectId;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: Boolean, default: false })
  isGroupMessage: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

@Schema({ timestamps: true })
export class Group {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  members: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const GroupSchema = SchemaFactory.createForClass(Group);