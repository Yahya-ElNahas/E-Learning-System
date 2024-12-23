import {
  Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, Post, Put, Req, UnauthorizedException, UseGuards 
} from '@nestjs/common';

import { ForumService } from './forum.service';
import { User, UserDocument } from 'src/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { AuthService } from 'src/auth/auth.service';
import {UserService} from '../../user/user.service'

@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
       @Inject(AuthService) private readonly authService: AuthService,
  
  ) {}

//      const token = req.cookies['verification_token'];

    private extractTokenData(token: string) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded as {
          role(role: any): unknown;
          Role: string; id: string;
};
      } catch (err) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
    }

    @Post('addComment')
async addComment(
  @Req() req: Request,
  @Body('forumId') forumId: string,
  @Body('text') text: string,

) {
  const token = (req as any).cookies['verification_token'];
  const decoded = this.extractTokenData(token)
  const user = await this.userModel.findById(decoded.id)
  const data = {id :decoded.id , name : (user).name}
  return this.forumService.addComment(forumId, data, text);
}


  @Post('create')
  async createForum(
    @Req() req: Request,
    @Body('title') title: string,
    @Body('description') description: string,
  ) {
    const token = (req as any).cookies['verification_token'];
    const decoded = this.extractTokenData(token)
    console.log(decoded.role)
   
    
    if (!title || !description) {
      throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST);
    }

    const stat = await this.userModel.findById(decoded.id)

    if(!stat){
      throw new HttpException(`This moderator does not exist.`, HttpStatus.NOT_FOUND);
    }
    const usersEmail = await this.userModel.find()
    const arr = usersEmail.map(user => user.email)
    // (to: string, subject: string, text: string
    for(let i = 0 ; i < arr.length ; i++){
      await this.authService.sendMail(arr[i] , 'new post' , `New post: ${stat.name} has posted in the forum. Please check it out.`)
    }
    const addObj = { _id : stat._id,name : stat.name}
    const forum = await this.forumService.createForum(
      title,
      description,
      addObj,
    );
    return { status: 'Forum created successfully!', forum };
  }

  @Get()
  async all(){
    return this.forumService.findall()
  }
  @Get('/users')
  async findAllForums(@Req() req: Request) {
    const token = (req as any).cookies['verification_token'];
    const decoded = this.extractTokenData(token); 
    const userId = decoded?.id; 
    if (!userId) {
      return { status: 'Failed', message: 'User not authenticated.' };
    }
    console.log("d",decoded.role)
    if(decoded.role.toString() === 'instructor'){
      const forums = await this.forumService.findall();
      return { status: 'Forums fetched successfully!', forums };
    }
  
    const forums = await this.forumService.findAllForums(userId);
    return { status: 'Forums fetched successfully!', forums };
  }

  @Get(':id')
  async findForumById(@Param('id') id: string) {
    const forum = await this.forumService.findForumById(id);
    if (!forum) {
      throw new HttpException('Forum not found', HttpStatus.NOT_FOUND);
    }
    return { status: 'Forum fetched successfully!', forum };
  }

  @Put(':id')
  async updateForum(
    @Param('id') id: string,
    @Body('title') title?: string,
    @Body('description') description?: string,
  ) {
    const updatedForum = await this.forumService.updateForum(id, {
      title,
      description,
    });
    if (!updatedForum) {
      throw new HttpException('Forum not found', HttpStatus.NOT_FOUND);
    }
    return { status: 'Forum updated successfully!', updatedForum };
  }

  @Delete(':id')
  async deleteForum(@Param('id') id: string) {
    const deletedForum = await this.forumService.deleteForum(id);
    if (!deletedForum) {
      throw new HttpException('Forum not found', HttpStatus.NOT_FOUND);
    }
    return { status: 'Forum deleted successfully!' };
  }

  @Post('thread/create')
  async createThread(
    @Body('forum') forum: string,
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('createdBy') createdBy: string,
  ) {
    if (!forum || !title || !content || !createdBy) {
      throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST);
    }
    const thread = await this.forumService.createThread({
      forum,
      title,
      content,
      createdBy,
    });
    return { status: 'Thread created successfully!', thread };
  }

  @Get('thread/:forumId')
  async findThreadsByForum(@Param('forumId') forumId: string) {
    const threads = await this.forumService.findThreadsByForum(forumId);
    return { status: 'Threads fetched successfully!', threads };
  }

  @Post('reply/create')
  async createReply(
    @Body('thread') thread: string,
    @Body('content') content: string,
    @Body('createdBy') createdBy: string,
  ) {
    if (!thread || !content || !createdBy) {
      throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST);
    }
    const reply = await this.forumService.createReply({
      thread,
      content,
      createdBy,
    });
    return { status: 'Reply created successfully!', reply };
  }

  @Get('reply/:threadId')
  async findRepliesByThread(@Param('threadId') threadId: string) {
    const replies = await this.forumService.findRepliesByThread(threadId);
    return { status: 'Replies fetched successfully!', replies };
  }

  @Delete('reply/:id')
  async deleteReply(@Param('id') id: string) {
    const deletedReply = await this.forumService.deleteReply(id);
    if (!deletedReply) {
      throw new HttpException('Reply not found', HttpStatus.NOT_FOUND);
    }
    return { status: 'Reply deleted successfully!' };
  }
}
