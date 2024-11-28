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
import { CourseController } from './course/course.controller';
import { CourseService } from './course/course.service';
import { JwtModule } from '@nestjs/jwt'; 
import { ResponseService } from './response/response.service'
import  ResponseController from './response/response.controller'
import { AuthController } from './auth/auth.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthService } from './auth/auth.service'; 
import { PusherController } from './communication/pusher/pusher.controller';
import { PusherService } from './communication/pusher/pusher.service';
<<<<<<< HEAD
import { BackupService } from './backup/backup.service';  // Import BackupService
=======
import { ProgressController } from './progress/progress.controller';
import { ProgressService } from './progress/progress.service';
>>>>>>> bcaa920f1cb102ac738ddfa54a45ef1fbe7d4b87

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
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '1h' },
    }),
    ScheduleModule.forRoot(),  // Add ScheduleModule to handle cron jobs
  ],
  controllers: [
    QuizController,
    CourseController,
    UserController,
    AuthController,
    ResponseController,
    PusherController,
<<<<<<< HEAD
    // Removed BackupController here
=======
    ProgressController
>>>>>>> bcaa920f1cb102ac738ddfa54a45ef1fbe7d4b87
  ],
  providers: [
    QuizService,
    CourseService,
    UserService,
    AuthService,
    ResponseService,
    PusherService,
    JwtStrategy, 
<<<<<<< HEAD
    BackupService,  // Include BackupService here
=======
    ProgressService
>>>>>>> bcaa920f1cb102ac738ddfa54a45ef1fbe7d4b87
  ],
})
export class AppModule {}

