/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PusherService } from './pusher.service';
import { ChatService } from '../chat/chat.service';
import { UserDocument } from '../../user/user.schema';
import { ChatDocument } from '../chat/chat.schema';
import * as jwt from 'jsonwebtoken';

import { UserService } from '../../user/user.service';
import { Request, Response } from 'express';
import { waitForDebugger } from 'inspector';



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
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Africa/Cairo',
    }).format(date);
  }

  private extractTokenData(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded as { id: string; name: string };
    } catch (err) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  
  @Get('test')
  async g(@Req() req: Request) {
    const token = req.cookies['verification_token'];

    if (!token) {
      return { status: 'Error', message: 'Token not provided' };
    }

    try {
      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Extract ID and name from the token
      const { id, name } = decoded as { id: string; name: string };

      // console.log('Decoded Token:', decoded);

      return { token };
    } catch (err) {
      console.error('Invalid token:', err.message);
      return { status: 'Error', message: 'Invalid token' };
    }
  }
  @Post('PrivateChat')
  async PrivateChat(
    @Req() req: Request,
    @Body('instructorName') instructorName: string,
    @Body('message') message: string,
  ) {
    const token = req.cookies['verification_token'];
    const { id: senderId } = this.extractTokenData(token);
  
    const student = await this.userService.findById(senderId);
  
    if (!student) {
      throw new HttpException(`User with ID ${senderId} does not exist.`, HttpStatus.NOT_FOUND);
    }
  
    const studentName = student.name;
  
    if (!instructorName) {
      return { status: 'Error', message: 'Instructor name is required' };
    }
  
    // Generate channel name by sorting names alphabetically
    const channelName = [studentName.trim().toLowerCase(), instructorName.trim().toLowerCase()]
      .sort()
      .join('_');
  
    // console.log(channelName);
  
    await this.pusherService.trigger(channelName, 'message', {
      sender: studentName,
      message,
    });
  
    const instructor = await this.userService.findByName(instructorName);
  
    if (!instructor[0]) {
      throw new HttpException(`User with name ${instructorName} does not exist.`, HttpStatus.NOT_FOUND);
    }
    const doExists = await this.chatService.findByChannel(channelName)
    if(!doExists){
      const chat = (await this.chatService.createNewChat({
        sender_name: studentName,
        recipient_name: instructorName,
        message,
        channel: channelName,
        isGroupMessage: false,
      })) as ChatDocument;
      chat;
      return {
        status : "channel created !",
        channel: channelName
      }
    }

    const data = {message : message , sender_name: studentName, date : this.formatDate(new Date())}

    await this.chatService.updateExistingChat(channelName,data)

    return {
      status: 'Private message sent successfully!',
      channel: channelName,
    };
  }

  @Get('/username')
  async getProfile(@Req() req: Request) {
    console.log("v")
    const token = req.cookies['verification_token'];
    const userData = this.extractTokenData(token);
    const user = await this.userService.findById(userData.id);
    console.log(user)
    return { username: user.name };
  }
  

  @Post('join')
  async JoinChat(
    @Body('senderName') name,
    @Body('Channel') channel : string,
    @Body('message') message: string,
  ){
    const Chat =  await this.chatService.findAllChats();
    const ChannelName = Chat.map(item => item.channel)
    console.log(ChannelName)
    if(!ChannelName.includes(channel)){
      throw new HttpException(`this user with ${channel} does not exist.`, HttpStatus.NOT_FOUND);
    }

    await this.pusherService.trigger(channel , 'message' , {
      senderName : name,
      message
    })
    
    return {
      status: message,
      channel: channel,
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
  @Req() req: Request,
  @Body('groupName') groupName: string, 
  @Body('usernames') members: string[],
) {
  members.push()
  const token = req.cookies['verification_token'];
  const { id: senderId } = this.extractTokenData(token)
  const {name:userName} = await this.userService.findById(senderId)

  members.push(userName)
  // if(this.chatService.Exist(groupName)){
  //   throw new HttpException(`this group ${groupName} do exist` , HttpStatus.NOT_ACCEPTABLE)
  // }
  const idS = await this.chatService.allGroupMembersIds(members);
  let membersObjectArr = [];
  for (let i = 0; i < members.length; i++) {
    const user = await this.userService.findByName(members[i]);  
    if (user.length === 0) {
      throw new Error(`User with name ${members[i]} does not exist!`)
    }
    membersObjectArr.push({ _id: idS[i] , name: members[i] });
  }

  console.log(membersObjectArr)

  await this.chatService.createGroup(groupName, membersObjectArr,groupName);

  return {
    status: `Group ${groupName} successfully created!`
  };
}

    @Post('send')
    async SendOnGroup(@Req() req: Request,
      @Body('groupName') groupName?: string,
      @Body('message')  message?: object,
      
    ){
      const token = req.cookies['verification_token'];
      const {id:id} = this.extractTokenData(token)
      const arr = (await this.chatService.findGroupByName(groupName));

      if(!arr){
           throw new HttpException(`Group {${groupName}} does not exist.`, HttpStatus.NOT_FOUND);
      }

      const members = arr.members.map(item => item._id);

     

      const isMember =members.some(mId => mId.toString() === (id))

       if(!isMember){
        throw new Error('Unauthorized')
       }     

      const senderData = this.userService.findById(id)

      const fullMessage = {
        sender : (await senderData).name,
        message,
        date : this.formatDate(new Date()),
      }

      console.log(groupName)
      await this.pusherService.trigger(groupName, 'message', {
        sender: (await senderData).name,
        message,
      });
      await this.chatService.sendGroupMessage(groupName , fullMessage)

      return  fullMessage

    }

    @Post("AddUser")
    async AddUserToGroup(
      @Body('createrId') createrId: string,
      @Body('groupName') groupName: string,
      @Body('UserId') id: string
    ){
        const res = await this.chatService.addUser(createrId,id,groupName);
        res
      return res;
    }
    @Get('getUserGroups')
    async getUserGroups(@Req() req: Request) {
      try {
        const token = req.cookies['verification_token'];
    
        if (!token) {
          throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
        }
    
        const { id: userId } = this.extractTokenData(token);
    
        if (!userId) {
          throw new HttpException('Invalid token or user not found', HttpStatus.UNAUTHORIZED);
        }
    
        const userGroups = await this.chatService.findUserGroups(userId);
    
        if (!userGroups) {
          throw new HttpException('No groups found for the user', HttpStatus.NOT_FOUND);
        }
    
        return userGroups;
      } catch (error) {
        console.error('Error in getUserGroups:', error);
        throw new HttpException(error.message || 'Internal server error', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    

    @Get('getAllUserChats')
    async getAllUserChats(
      @Req() req: Request
    ){
      const token = req.cookies['verification_token'];
      const { id: senderId } = this.extractTokenData(token);
      const student = await this.userService.findById(senderId);
      if (!student) {
        throw new HttpException(`User with ID ${senderId} does not exist.`, HttpStatus.NOT_FOUND);
      }
      const studentName = student.name.toString();
      const res = await this.chatService.findSenderMessgae(studentName)
      return res
     }
  }