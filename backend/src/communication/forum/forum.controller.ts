import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ForumService } from './forum.service';
import { User, UserDocument } from 'src/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  @Post('create')
  async createForum(
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('moderator') moderator: string,
  ) {
    if (!title || !description || !moderator) {
      throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST);
    }

    const stat = await this.userModel.findById(moderator)

    if(!stat){
      throw new HttpException(`This moderator does not exist.`, HttpStatus.NOT_FOUND);
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
  async findAllForums() {
    const forums = await this.forumService.findAllForums();
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
