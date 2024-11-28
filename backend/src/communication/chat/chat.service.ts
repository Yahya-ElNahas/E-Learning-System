import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument, Group, GroupDocument } from './chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    @InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>,
  ) {}

  // Create a new chat
  async createChat({ sender_id, recipient_id, message, isGroupMessage }: any) {
    const chat = new this.chatModel({
      sender: sender_id,
      recipient: recipient_id,
      message,
      isGroupMessage,
    });
    return chat.save();
  }

  // Get all chats
  async findAllChats() {
    return this.chatModel.find().exec();
  }

  async findChat(id: string) {
    return this.chatModel.findById(id).exec();
  }

  // Update a chat message
  async updateChat(id: string, { message }: any) {
    return this.chatModel.findByIdAndUpdate(id, { message }, { new: true }).exec();
  }

  // Delete a chat message
  async deleteChat(id: string) {
    return this.chatModel.findByIdAndDelete(id).exec();
  }

  // Create a new group
  async createGroup({ name, members, createdBy }: any) {
    const group = new this.groupModel({
      name,
      members,
      createdBy,
    });
    return group.save();
  }

  // Get all groups
  async findAllGroups() {
    return this.groupModel.find().exec();
  }

  async findGroup(id: string) {
    return this.groupModel.findById(id).exec();
  }

  // Update a group
  async updateGroup(id: string, { name, members }: any) {
    return this.groupModel.findByIdAndUpdate(
      id,
      { name, members },
      { new: true },
    ).exec();
  }

  // Delete a group
  async deleteGroup(id: string) {
    return this.groupModel.findByIdAndDelete(id).exec();
  }
}
