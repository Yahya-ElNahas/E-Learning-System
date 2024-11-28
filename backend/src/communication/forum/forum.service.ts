import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Forum, ForumDocument, Thread, ThreadDocument, Reply, ReplyDocument } from './forum.schema';

@Injectable()
export class ForumService {
  constructor(
    @InjectModel(Forum.name) private readonly forumModel: Model<ForumDocument>,
    @InjectModel(Thread.name) private readonly threadModel: Model<ThreadDocument>,
    @InjectModel(Reply.name) private readonly replyModel: Model<ReplyDocument>,
  ) {}

  // Forum Methods
  async createForum({ title, description, moderator }: any) {
    const forum = new this.forumModel({ title, description, moderator });
    return forum.save();
  }

  async findAllForums() {
    return this.forumModel.find().exec();
  }

  async findForumById(id: string) {
    return this.forumModel.findById(id).exec();
  }

  async updateForum(id: string, { title, description }: any) {
    return this.forumModel
      .findByIdAndUpdate(id, { title, description }, { new: true })
      .exec();
  }

  async deleteForum(id: string) {
    return this.forumModel.findByIdAndDelete(id).exec();
  }

  // Thread Methods
  async createThread({ forum, title, content, createdBy }: any) {
    const thread = new this.threadModel({ forum, title, content, createdBy });
    return thread.save();
  }

  async findThreadsByForum(forumId: string) {
    return this.threadModel.find({ forum: forumId }).exec();
  }

  async findThreadById(id: string) {
    return this.threadModel.findById(id).exec();
  }

  async updateThread(id: string, { title, content }: any) {
    return this.threadModel
      .findByIdAndUpdate(id, { title, content }, { new: true })
      .exec();
  }

  async deleteThread(id: string) {
    return this.threadModel.findByIdAndDelete(id).exec();
  }

  // Reply Methods
  async createReply({ thread, content, createdBy }: any) {
    const reply = new this.replyModel({ thread, content, createdBy });
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
}
