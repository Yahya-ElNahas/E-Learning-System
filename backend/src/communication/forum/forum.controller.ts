/* eslint-disable prettier/prettier */
import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards
} from '@nestjs/common';
import { ForumService } from './forum.service';
import { Role } from '../../auth/reflectors';
import { Role as UserRole } from '../../user/user.schema';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';

@Controller('forums')
export class ForumController {
    constructor(private readonly forumService: ForumService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAllForums() {
      return this.forumService.findAllForums();
    }
  
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findForumById(@Param('id') id: string) {
      return this.forumService.findForumById(id);
    }

    @Get('threads/:id')
    @UseGuards(JwtAuthGuard)
    async findThreadById(@Param('id') id: string) {
      return this.forumService.findThreadById(id);
    }
  
    @Patch('threads/:id')
    @UseGuards(JwtAuthGuard)
    async updateThread(
      @Param('id') id: string,
      @Body('title') title: string,
      @Body('content') content: string,
    ) {
      return this.forumService.updateThread(id, { title, content });
    }
  
    @Delete('threads/:id')
    @UseGuards(JwtAuthGuard)
    async deleteThread(@Param('id') id: string) {
      return this.forumService.deleteThread(id);
    }
  
    @Get(':forumId/threads')
    @UseGuards(JwtAuthGuard)
    async findThreadsByForum(@Param('forumId') forumId: string) {
      return this.forumService.findThreadsByForum(forumId);
    }
  
    @Get('threads/:threadId/replies')
    @UseGuards(JwtAuthGuard)
    async findRepliesByThread(@Param('threadId') threadId: string) {
      return this.forumService.findRepliesByThread(threadId);
    }
  
    @Get('replies/:id')
    @UseGuards(JwtAuthGuard)
    async findReplyById(@Param('id') id: string) {
      return this.forumService.findReplyById(id);
    }
  
    @Delete('replies/:id')
    @UseGuards(JwtAuthGuard)
    async deleteReply(@Param('id') id: string) {
      return this.forumService.deleteReply(id);
    }
  
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role(UserRole.INSTRUCTOR)
    async createForum(
      @Body('title') title: string,
      @Body('description') description: string,
      @Body('moderator') moderator: string,
    ) {
      return this.forumService.createForum({ title, description, moderator });
    }
  
    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role(UserRole.INSTRUCTOR, UserRole.ADMIN)
    async updateForum(
      @Param('id') id: string,
      @Body('title') title: string,
      @Body('description') description: string,
    ) {
      return this.forumService.updateForum(id, { title, description });
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role(UserRole.INSTRUCTOR, UserRole.ADMIN)
    async deleteForum(@Param('id') id: string) {
      return this.forumService.deleteForum(id);
    }
  
    @Post(':forumId/threads')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role(UserRole.INSTRUCTOR, UserRole.STUDENT)
    async createThread(
      @Param('forumId') forumId: string,
      @Body('title') title: string,
      @Body('content') content: string,
      @Body('createdBy') createdBy: string,
    ) {
      return this.forumService.createThread({ forum: forumId, title, content, createdBy });
    }
  
    @Post('threads/:threadId/replies')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role(UserRole.INSTRUCTOR, UserRole.STUDENT)
    async createReply(
      @Param('threadId') threadId: string,
      @Body('content') content: string,
      @Body('createdBy') createdBy: string,
    ) {
      return this.forumService.createReply({ thread: threadId, content, createdBy });
    }
}
  