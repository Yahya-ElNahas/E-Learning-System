/* eslint-disable prettier/prettier */
import { 
    Controller, 
    Post, 
    Get, 
    Patch, 
    Param, 
    Body, 
    Delete ,
    UseGuards,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { ChatService } from './chat.service';


@Controller('chats')
export class ChatController {
constructor(private readonly chatService: ChatService) {}
@Get('channelName')
async channelName(@Body('channelName') name: string) {
  if (!name || typeof name !== 'string') {
    throw new HttpException('Invalid channel name', HttpStatus.BAD_REQUEST);
  }

  try {
    const channelData = await this.chatService.findByChannel(name);
    console.log(channelData)
    if (!channelData) {
      throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);
    }
    return channelData;
  } catch (error) {
    throw new HttpException(
      error.message || 'An error occurred while fetching channel data',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
@Get('channel/:channelName')
async fetchChatHistory(
  @Param('channelName') channelName: string
): Promise<any> {
  const chat = await this.chatService.findByChannel(channelName);

  if (!chat) {
    throw new HttpException(
      `No chat found for channel: ${channelName}`,
      HttpStatus.NOT_FOUND
    );
  }

  return {
    status: 'Chat history fetched successfully!',
    messages: chat.message, // Return the messages array
  };
}



}