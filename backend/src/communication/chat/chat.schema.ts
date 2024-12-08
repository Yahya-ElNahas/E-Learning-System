import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ type: String, required: true })
  sender: string; 

  @Prop({ type: String, required: true })
  recipient: string; 

  @Prop({ type: [Object], required: true })
   message: object[];
   
   @Prop({type : String, required : true})
   channel : string

  @Prop({ type: Boolean, default: false })
  isGroupMessage: boolean;
}


export const ChatSchema = SchemaFactory.createForClass(Chat);

export type GroupDocument = Group & Document;

@Schema({ timestamps: true })
export class Group {
  
  @Prop({ type: String, required: true })
  GroupName: string;

  @Prop({ type: [{ type: Types.ObjectId }], required: true })
  members: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: [Object]})
   message: object[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);