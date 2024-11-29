/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { PusherService } from './pusher.service';
import { ChatService } from '../chat/chat.service';
import { UserDocument } from '../../user/user.schema';
import { ChatDocument } from '../chat/chat.schema';
import { from } from 'rxjs';
import { UserService } from '../../user/user.service';

@Controller('chat')
export class PusherController {
  constructor(
    private readonly pusherService: PusherService,
    @Inject(ChatService) private readonly chatService: ChatService,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

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
  @Post('PrivateGroupChat')
  async PrivateGroup(
    @Body('usernames') members?: string[],
    @Body('groupName') groupName?: string,
    @Body('message') message?: string,
  ) {
    const channelName = members.map((name) => name.trim()).join(',');
  }
}
