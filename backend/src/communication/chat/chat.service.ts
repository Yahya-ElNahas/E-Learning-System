/* eslint-disable prettier/prettier */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Injectable, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument, Group, GroupDocument } from './chat.schema';
import { User, UserDocument } from '../../user/user.schema';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as moment from 'moment';




@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    @InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>,
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
  
  async createChat({ sender_name, recipient_name, message, isGroupMessage }: any) {
    const data = {
      message,
      sender_name,
      date: this.formatDate(new Date()),
    };
    const existingChat = await this.chatModel.findOne({
      sender: sender_name,
      recipient: recipient_name,
      isGroupMessage,
    });

    if(!existingChat){
      const chat = new this.chatModel({
        sender: sender_name,
        recipient: recipient_name,
        message : [data],
        isGroupMessage,

      });
      return chat.save();
    }

    const id = existingChat._id.toString()
   return  await this.chatModel.findByIdAndUpdate(id,
        { $push:{ message: data } },  
        { new: true, useFindAndModify: false } 
        
      )
  
  }
  
  async findAllChats() {
    return this.chatModel.find().exec();
  }

  async findChat(id: string) {
    return this.chatModel.findById(id).exec();
  }

  async updateChat(id: string, updateData: object) {
    console.log(updateData)
    try {
        const updatedChat = await this.chatModel.findByIdAndUpdate(
            id,
            { $push:{ updateData} },  
            { new: true, useFindAndModify: false } 
        );
        if (!updatedChat) {
            throw new Error('Chat not found or unable to update.');
        }
        return updatedChat;
    } catch (error) {
        console.error('Error updating chat:', error);
        throw error;
    }
}


  async deleteChat(id: string) {
    return this.chatModel.findByIdAndDelete(id).exec();
  }

  async allGroupMembersIds(members: string[]) {
    let arr = [];
    for (let i = 0; i < members.length; i++) {
      const user = await this.userModel.findOne({ name: members[i] });
      if (user) {
       let added = String(user._id.toString())
        arr.push(added);
        console.log(added)
      } else {
        console.log(`User with name ${members[i]} not found`);
      }
    }
    return arr;
  }

  async createGroup(GroupName:String, members:string[], createdBy:string, message ? : string) {
    const data = {
      GroupName,
      members,
      createdBy,
      message: message || [], 
    };
    const existingGroup = await this.groupModel.findOne({ GroupName, createdBy });
    if (!existingGroup) {
      const group = new this.groupModel(data);
      return group.save();
    }
  
    throw new Error('A group with this name already exists.');
  }
  
  async sendGroupMessage(GroupName:String ,message : object){
    const existingGroup = await this.groupModel.findOne({GroupName});
    if(!existingGroup){
      throw new Error('this group do not exists.');
    }

    const GroupId = existingGroup._id;

    const updatedChat = await this.groupModel.findByIdAndUpdate(
      GroupId,
      { $push:{message} },  
      { new: true, useFindAndModify: false } )

      updatedChat
  }
  async findAllGroups() {
    return this.groupModel.find().exec();
  }

  async findGroup(id: string) {
    return this.groupModel.findById(id).exec();
  }



  async findAllGroupMembersNames(GroupName:string){
    const existingGroup = await this.groupModel.findOne({GroupName});
    if(!existingGroup){
      throw new Error('this group do not exists.');
    }
    
    const message = existingGroup.message
    let names = [];
    
    for(let  i = 0 ; i < message.length ; i++){
      let senderName = message[i]['sender']
      if(!names.includes(senderName))
      names.push(message[i]['sender']);
    }
    return names;
  }

  

  async deleteGroup(id: string) {
    return this.groupModel.findByIdAndDelete(id).exec();
  }

  async findGroupByName(name : string){
    return this.groupModel.findOne({GroupName:name})
  }
}
