/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';  // Import ScheduleModule
import { UserSchema } from './user/user.schema';
import { CourseSchema } from './course/course.schema';
import { ModuleSchema } from './module/module.schema';
import { QuizSchema } from './quiz/quiz.schema';
import { ResponseSchema } from './response/response.schema';
import { ProgressSchema } from './progress/progress.schema';
import { NoteSchema } from './note/note.schema';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { QuizController } from './quiz/quiz.controller';
import { QuizService } from './quiz/quiz.service';

import  CourseController  from './course/course.controller';

import { CourseService } from './course/course.service';
import { JwtModule } from '@nestjs/jwt'; 
import { ResponseService } from './response/response.service'
import  ResponseController from './response/response.controller'
import { AuthController } from './auth/auth.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthService } from './auth/auth.service'; 
import { PusherController } from './communication/pusher/pusher.controller';
import { PusherService } from './communication/pusher/pusher.service';

import {ChatController} from './communication/chat/chat.controller'
import { ChatService } from './communication/chat/chat.service';
import { Chat, ChatSchema, Group, GroupSchema } from './communication/chat/chat.schema';


import { BackupService } from './backup/backup.service';  // Import BackupService
import { ProgressController } from './progress/progress.controller';
import { ProgressService } from './progress/progress.service';
import { ModuleController } from './module/module.controller';
import { ModuleService } from './module/module.service';
import {ForumController} from './communication/forum/forum.controller'
import {ForumService} from './communication/forum/forum.service'
import { Forum, ForumSchema } from './communication/forum/forum.schema';  // Import your schema
import { Thread, ThreadSchema } from './communication/forum/forum.schema';  // Import related schemas if needed
import { Reply, ReplySchema } from './communication/forum/forum.schema';
import { NoteController } from './note/note.controller';
import { NoteService } from './note/note.service';

import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';




@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Course', schema: CourseSchema },
      { name: 'Module', schema: ModuleSchema },
      { name: 'Quiz', schema: QuizSchema },
      { name: 'Response', schema: ResponseSchema },
      { name: 'Progress', schema: ProgressSchema },
      { name: 'Note', schema: NoteSchema },
      { name: Chat.name, schema: ChatSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Forum.name, schema: ForumSchema },  
      { name: Thread.name, schema: ThreadSchema },
      { name: Reply.name, schema: ReplySchema }, 
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '1h' },
    }),
    ScheduleModule.forRoot(),  // Add ScheduleModule to handle cron jobs
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/modules', // Directory for storing files
        filename: (req, file, callback) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          callback(null, uniqueName);
        },
      }),
    }),
  ],
  controllers: [
    QuizController,
    CourseController,
    UserController,
    AuthController,
    ResponseController,
    PusherController,
    ChatController,
    ModuleController,
    ProgressController,
    ForumController,
    NoteController
  ],

  providers: [
    QuizService,
    CourseService,
    UserService,
    AuthService,
    ResponseService,
    PusherService,
    ChatService,
    JwtStrategy, 
    BackupService,  
    ProgressService,
    ModuleService,
    ForumService,
    NoteService
  ],

})
export class AppModule {}

