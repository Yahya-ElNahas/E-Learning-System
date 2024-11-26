/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
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
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { JwtModule } from '@nestjs/jwt'; 

@Module({
  imports: [
    ConfigModule.forRoot({}), // Global config module
    MongooseModule.forRoot('mongodb://localhost:27017/e-learning'), // MongoDB connection using environment variable
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), // User schema
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]), // Course schema
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]), // Module schema
    MongooseModule.forFeature([{ name: 'Quiz', schema: QuizSchema }]), // Quiz schema
    MongooseModule.forFeature([{ name: 'Response', schema: ResponseSchema }]), // Response schema
    MongooseModule.forFeature([{ name: 'Progress', schema: ProgressSchema }]), // Progress schema
    MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }]), // Note schema
    JwtModule.register({  
      secret: process.env.JWT_SECRET||'default-secret', // Use the secret key from environment
      signOptions: { expiresIn: process.env.JWT_EXPIRATION||'1h' },  // Set the token expiration (optional)
    }),
  ],
  controllers: [
    QuizController,
    CourseController,
    UserController,
    AuthController,
  ],
  providers: [
    QuizService,
    CourseService,
    UserService,
    AuthService,  
  ],
})
export class AppModule {}