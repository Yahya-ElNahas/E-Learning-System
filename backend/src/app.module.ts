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
import { JwtModule } from '@nestjs/jwt'; 
import { ResponseService } from './response/response.service'
import  ResponseController from './response/response.controller'
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/e-learning'), 
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]), 
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]), 
    MongooseModule.forFeature([{ name: 'Quiz', schema: QuizSchema }]), 
    MongooseModule.forFeature([{ name: 'Response', schema: ResponseSchema }]), 
    MongooseModule.forFeature([{ name: 'Progress', schema: ProgressSchema }]),
    MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }]), 
    JwtModule.register({  
      secret: process.env.JWT_SECRET||'default-secret', 
      signOptions: { expiresIn: process.env.JWT_EXPIRATION||'1h' },  
    }),
  ],
  controllers: [
    QuizController,
    CourseController,
    UserController,
    AuthController,
    ResponseController
  ],
  providers: [
    QuizService,
    CourseService,
    UserService, 
    AuthService,
    ResponseService, 
    JwtStrategy
  ],
  exports: [JwtStrategy]
})
export class AppModule {}