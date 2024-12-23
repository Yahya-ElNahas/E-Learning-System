/* eslint-disable prettier/prettier */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Forum, ForumDocument, Thread, ThreadDocument, Reply, ReplyDocument } from './forum.schema';
import { User, UserDocument } from '../../user/user.schema';



@Injectable()
export class ForumService {
  constructor(
    @InjectModel(Forum.name) private readonly forumModel: Model<ForumDocument>,
    @InjectModel(Thread.name) private readonly threadModel: Model<ThreadDocument>,
    @InjectModel(Reply.name) private readonly replyModel: Model<ReplyDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,

  ) {}

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-EG', {
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Africa/Cairo',
    }).format(date);
  }

  // Forum Methods
  async createForum( title:string, description:string, moderator:object) {
    const comments =[]
    const data = { title, description,comments ,moderator };
    const existingForum = await this.forumModel.findOne({ title });
    console.log(data)

    if (!existingForum) {
      const forum = new this.forumModel(data);
      return forum.save();
    }
    throw new Error('A forum with this title already exists.');
  }
  async findall(){
    return await this.forumModel.find().exec();
  }
  async findAllForums(id: string) {
    try {
      // Fetch all forums
      const allForums = await this.forumModel.find().exec();
      console.log('All Forums:', allForums);
  
      let arr = [];
      for (let i = 0; i < allForums.length; i++) {
        if (allForums[i].moderator['_id'].toString() === id) {
          arr.push(allForums[i]);
        }
      }
      return arr;
    } catch (error) {
      console.error('Error fetching forums:', error);
      throw new Error('Failed to fetch forums');
    }
  }
  async findForumById(id: string) {
    return this.forumModel.findById(id).exec();
  }

  async updateForum(id: string, updateData: any) {
    const updatedForum = await this.forumModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, useFindAndModify: false }
    );
    if (!updatedForum) {
      throw new Error('Forum not found or unable to update.');
    }
    return updatedForum;
  }

  

  async deleteForum(id: string) {
    return this.forumModel.findByIdAndDelete(id).exec();
  }

  async addComment(forumId: string, user: object, text: string) {
    const forum = await this.forumModel.findById(forumId);

    if (!forum) {
      throw new Error('Forum not found');
    }
    
  
  const comments = { user,text,createdAt: new Date(),}
  forum.comments.push(comments)

    const res= await this.forumModel.updateOne({_id : forumId},{$set:{comments: forum.comments}})
    console.log(res)
    return forum;
  }


  // Thread Methods
  async createThread({ forum, title, content, createdBy }: any) {
    const data = { forum, title, content, createdBy, date: this.formatDate(new Date()) };
    const thread = new this.threadModel(data);
    return thread.save();
  }

  async findThreadsByForum(forumId: string) {
    return this.threadModel.find({ forum: forumId }).exec();
  }

  async findThreadById(id: string) {
    return this.threadModel.findById(id).exec();
  }

  async updateThread(id: string, updateData: any) {
    const updatedThread = await this.threadModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, useFindAndModify: false }
    );
    if (!updatedThread) {
      throw new Error('Thread not found or unable to update.');
    }
    return updatedThread;
  }

  async deleteThread(id: string) {
    return this.threadModel.findByIdAndDelete(id).exec();
  }

  // Reply Methods
  async createReply({ thread, content, createdBy }: any) {
    const data = { thread, content, createdBy, date: this.formatDate(new Date()) };
    const reply = new this.replyModel(data);
    return reply.save();
  }

  async findRepliesByThread(threadId: string) {
    return this.replyModel.find({ thread: threadId }).exec();
  }

  async findReplyById(id: string) {
    return this.replyModel.findById(id).exec();
  }

  async deleteReply(id: string) {
    return this.replyModel.findByIdAndDelete(id).exec();
  }

  // Additional Helper Methods
  async findUserById(userId: string) {
    return this.userModel.findById(userId).exec();
  }

  async findForumModerator(forumId: string) {
    const forum = await this.forumModel.findById(forumId).populate('moderator').exec();
    if (!forum) {
      throw new Error('Forum not found.');
    }
    return forum.moderator;
  }
}
