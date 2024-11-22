/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user/user.schema';
import { CourseSchema } from './course/course.schema';
import { ModuleSchema } from './module/module.schema';
import { QuizSchema } from './quiz/quiz.schema';
import { ResponseSchema } from './response/response.schema';
import { ProgressSchema } from './progress/progress.schema';
import { NoteSchema } from './note/note.schema';
import { UserInteractionSchema } from './user_interaction/user_interaction.Scehma';
import { RecommendationSchema } from './recommendation/recommendation.Schema';
import { AuthenticationLogSchema } from './authentication_log/authentication_log.schema';
import { ConfigurationSchema } from './configuration/configuration.schema';
@Module({
  imports: [
      MongooseModule.forRoot('mongodb://localhost:27017/e-learning'),
      MongooseModule.forFeature([{name:'User',schema:UserSchema}])
      ,MongooseModule.forFeature([{name:'Course',schema:CourseSchema}]),
      MongooseModule.forFeature([{name:'Module',schema:ModuleSchema}]),
      MongooseModule.forFeature([{name:'Quiz',schema:QuizSchema}]),
      MongooseModule.forFeature([{name:'Response',schema:ResponseSchema}]),
      MongooseModule.forFeature([{name:'Progress',schema:ProgressSchema}]),
      MongooseModule.forFeature([{name:'Note',schema:NoteSchema}]),
      MongooseModule.forFeature([{name:'UserInteraction',schema:UserInteractionSchema}]),
      MongooseModule.forFeature([{name:'Recommendation',schema:RecommendationSchema}]),
      MongooseModule.forFeature([{name:'Authenticationlog',schema:AuthenticationLogSchema}]),
      MongooseModule.forFeature([{name:'Configuration',schema:ConfigurationSchema}]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
