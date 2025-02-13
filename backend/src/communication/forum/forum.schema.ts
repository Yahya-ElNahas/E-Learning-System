import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ForumDocument = Forum & Document;
export type ThreadDocument = Thread & Document;
export type ReplyDocument = Reply & Document;

@Schema({ timestamps: true })
export class Forum {
  @Prop({ type: String, required: true, unique: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string; 
  @Prop({ type: Object, required: true })
  comments: Object[]; 

  @Prop({ type: Object, ref: 'User', required: true })
  moderator: Object; 
}

export const ForumSchema = SchemaFactory.createForClass(Forum);

@Schema({ timestamps: true })
export class Thread {
  @Prop({ type: Types.ObjectId, ref: 'Forum', required: true })
  forum: Types.ObjectId; 

  @Prop({ type: String, required: true })
  title: string; 

  commits: string; 


  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId; 
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);

@Schema({ timestamps: true })
export class Reply {
  @Prop({ type: Types.ObjectId, ref: 'Thread', required: true })
  thread: Types.ObjectId; 

  @Prop({ type: String, required: true })
  content: string; 

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId; 
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
