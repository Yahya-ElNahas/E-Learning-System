import { Body, Controller, Post } from '@nestjs/common';
import { PusherService } from './pusher.service';

@Controller('chat')
export class PusherController {
  constructor(private readonly pusherService: PusherService) {}

  @Post('PrivateChat')
async PrivateChat(
  @Body('studentName') studentName: string,
  @Body('instructorName') instructorName: string,
  @Body('message') message: string,
) {
  if (!studentName || typeof studentName !== 'string' || !instructorName || typeof instructorName !== 'string') {
    return { status: 'Error', message: 'Invalid studentName or instructorName' };
  }

  const channelName = `${studentName.trim().toLowerCase()}_${instructorName.trim().toLowerCase()}`;
  await this.pusherService.trigger(channelName, 'message', {
    sender: studentName,
    message,
  });

  return { status: 'Private message sent successfully!', channel: channelName };
}


  @Post('PublicChat')
  async PublicChat(@Body('username') username: string, @Body('message') message: string) {
    const channelName = 'public';
    await this.pusherService.trigger(channelName, 'public-message', {
      sender: username,
      message,
    });
    return { status: 'Public message sent successfully!', channel: channelName };
  }
}
