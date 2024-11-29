/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { PusherService } from './pusher.service';
import { ChatService } from '../chat/chat.service';
import { UserDocument } from '../../user/user.schema';
import { ChatDocument } from '../chat/chat.schema';
import { from } from 'rxjs';
import { UserService } from '../../user/user.service';
import { Types } from 'mongoose';

@Controller('chat')
export class PusherController {
  constructor(
    private readonly pusherService: PusherService,
    @Inject(ChatService) private readonly chatService: ChatService,
    @Inject(UserService) private readonly userService: UserService,
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

  @Post('PrivateChat')
  async PrivateChat(
    @Body('studentName') studentName: string,
    @Body('instructorName') instructorName: string,
    @Body('message') message: string,
  ) {
    if (
      !studentName ||
      typeof studentName !== 'string' ||
      !instructorName ||
      typeof instructorName !== 'string'
    ) {
      return { status: 'Error', message: 'Invalid channel name !!' };
    }

    const channelName = `${studentName.trim().toLowerCase()}_${instructorName.trim().toLowerCase()}`;
    await this.pusherService.trigger(channelName, 'message', {
      sender: studentName,
      message,
    });
    const isGroupMessage = false;

    // const user1 = await this.userService.findById(studentName)
    // const user2 = await this.userService.findById(instructorName)

    const chat = (await this.chatService.createChat({
      sender_name: studentName,
      recipient_name: instructorName,
      message,
      isGroupMessage,
    })) as ChatDocument;

    chat;

    return {
      status: 'Private message sent successfully!',
      channel: channelName,
    };
  }

  @Post('PublicChat')
  async PublicChat(
    @Body('username') username: string,
    @Body('message') message: string,
  ) {
    const channelName = 'public';
    await this.pusherService.trigger(channelName, 'public-message', {
      sender: username,
      message,
    });
    return {
      status: 'Public message sent successfully!',
      channel: channelName,
    };
  }
  @Post('CreateGroup')
async CreateGroup(
  @Body('groupName') groupName?: string, 
  @Body('usernames') members?: string[]
) {
  
  const idS = await this.chatService.allGroupMembersIds(members);
  let membersObjectArr = [];
  for (let i = 0; i < members.length; i++) {
    const user = await this.userService.findByName(members[i]);  
    console.log(user)
    if (user.length === 0) {
      throw new Error(`User with name ${members[i]} does not exist!`)

    }
    membersObjectArr.push({ _id: idS[i], name: members[i] });
  }

  await this.chatService.createGroup(groupName, membersObjectArr, members[0]);

  return {
    status: `Group ${groupName} successfully created!`
  };
}

    @Post('send')
    async SendOnGroup(
      @Body('groupName') groupName?: string,
      @Body('message')  message?: object,
      @Body('senderId') id?: string
    ){

      const arr = (await this.chatService.findGroupByName(groupName)).members;

      const members = arr.map(item => item._id);

     

      const isMember =members.some(mId => mId.toString() === (id))

       if(!isMember){
        throw new Error('Unauthorized')
       }     

      const senderData = this.userService.findById(id)

      const fullMessage = {
        sender : (await senderData).name,
        message,
        data : this.formatDate(new Date()),
      }

      await this.chatService.sendGroupMessage(groupName , fullMessage)

    }

  }