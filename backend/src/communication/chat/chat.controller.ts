/* eslint-disable prettier/prettier */
import { 
    Controller, 
    Post, 
    Get, 
    Patch, 
    Param, 
    Body, 
    Delete ,
    UseGuards
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Role } from 'src/auth/reflectors';
import { Role as UserRole } from 'src/user/user.schema';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';

@Controller('chats')
export class ChatController {
constructor(private readonly chatService: ChatService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAllChats() {
        return this.chatService.findAllChats();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findChat(@Param('id') id: string) {
        return this.chatService.findChat(id);
    }

    // Create a new chat message
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role(UserRole.STUDENT, UserRole.INSTRUCTOR)
    async createChat(
        @Body('sender') sender_id: string,
        @Body('recipient') recipient_id: string,
        @Body('message') message: string,
        @Body('isGroupMessage') isGroupMessage: boolean = false,
    ) {
        return this.chatService.createChat({ sender_id, recipient_id, message, isGroupMessage });
    }

    // Update a chat message
    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role(UserRole.STUDENT, UserRole.INSTRUCTOR)
    async updateChat(
        @Param('id') id: string,
        @Body('message') message: string,
    ) {
        return this.chatService.updateChat(id, { message });
    }

    // Delete a chat message
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role(UserRole.STUDENT, UserRole.INSTRUCTOR)
    async deleteChat(@Param('id') id: string) {
        return this.chatService.deleteChat(id);
    }

    // Create a new group
    @Post('group')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role(UserRole.STUDENT, UserRole.ADMIN)
    async createGroup(
        @Body('name') name: string,
        @Body('members') members: string[],
        @Body('createdBy') createdBy: string,
    ) {
        return this.chatService.createGroup({ name, members, createdBy });
    }

    // Get all groups
    @Get('group')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role(UserRole.STUDENT, UserRole.ADMIN)
    async findAllGroups() {
        return this.chatService.findAllGroups();
    }

    @Get('group/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role(UserRole.STUDENT, UserRole.ADMIN)
    async findGroup(@Param('id') id: string) {
        return this.chatService.findGroup(id);
    }

    // Update a group
    @Patch('group/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role(UserRole.STUDENT, UserRole.ADMIN)
    async updateGroup(
        @Param('id') id: string,
        @Body('name') name: string,
        @Body('members') members: string[],
    ) {
        return this.chatService.updateGroup(id, { name, members });
    }

    // Delete a group
    @Delete('group/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Role(UserRole.STUDENT, UserRole.ADMIN)
    async deleteGroup(@Param('id') id: string) {
        return this.chatService.deleteGroup(id);
    }
}