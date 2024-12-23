/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response, ResponseDocument } from './response.schema';
import { isIdValid } from '../helper'; 
import { AuthService } from 'src/auth/auth.service';
import { QuizService } from 'src/quiz/quiz.service';
import { ModuleService } from 'src/module/module.service';
import { Quiz, QuizDocument } from 'src/quiz/quiz.schema';
import { Module, ModuleDocument } from 'src/module/module.schema';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(Response.name) private readonly responseModel: Model<ResponseDocument>,
    private readonly authService: AuthService,
    private readonly quizService: QuizService,
    private readonly moduleService: ModuleService,
  ) {}

  /**
   * Create a new response.
   * @param body Partial response object.
   * @returns Created response document.
   */
  async create(body: Partial<Response>): Promise<Response> {
    const newResponse = new this.responseModel(body);
    await this.quizService.incrementResponses(body.quiz_id.toString());
    return newResponse.save();
  }

  /**
   * Fetch all responses.
   * @returns Array of responses.
   */
  async findAll(): Promise<Response[]> {
    return this.responseModel.find().exec();
  }
  async findByQuiz(id: string): Promise<Response[]> {
    return this.responseModel.find({quiz_id: id}).exec();
  }

  /**
   * Fetch a single response by its ID.
   * @param id Response ID.
   * @returns Response document.
   */
  async findOne(id: string): Promise<Response> {
    isIdValid(id); // Validate ObjectId format
    const response = await this.responseModel.findById(id).exec();
    if (!response) {
      throw new NotFoundException('Response not found');
    }
    return response;
  }

  /**
   * Partially update a response.
   * @param id Response ID.
   * @param body Partial response object to update.
   * @returns Acknowledgment of the update.
   */
  async updatePartial(id: string, body: Partial<Response>): Promise<{ Acknowledgment: boolean }> {
    isIdValid(id); // Validate ObjectId format
    const updatedResponse = await this.responseModel.findByIdAndUpdate(id, body, { new: true }).exec();
    if (!updatedResponse) {
      throw new NotFoundException(`Response with ID ${id} not found`);
    }
    return { Acknowledgment: true };
  }

  /**
   * Fully update a response (all fields required).
   * @param id Response ID.
   * @param body Full response object to update.
   * @returns Acknowledgment of the update.
   */
  async updateFull(id: string, body: Partial<Response>): Promise<{ Acknowledgment: boolean }> {
    isIdValid(id); // Validate ObjectId format

    // Ensure all required fields are present
    if (!body.answers || !body.quiz_id || !body.score || !body.user_id) {
      throw new BadRequestException('All fields are required');
    }

    const updatedResponse = await this.responseModel.findByIdAndUpdate(id, body, { new: true }).exec();
    if (!updatedResponse) {
      throw new NotFoundException(`Response with ID ${id} not found`);
    }
    return { Acknowledgment: true };
  }

  /**
   * Delete a response by its ID.
   * @param id Response ID.
   * @returns Acknowledgment of the deletion.
   */
  async delete(id: string): Promise<{ Acknowledgment: boolean }> {
    isIdValid(id); // Validate ObjectId format
    const result = await this.responseModel.findByIdAndDelete(id).exec();
    if (!result) {
      return { Acknowledgment: false };
    }
    return { Acknowledgment: true };
  }

  async respondToStudentQuiz(token: string, body: Partial<Response>): Promise<Response> {
    const user_id = this.authService.GetIdFromToken(token);
    body['user_id'] = user_id;
    const newResponse = new this.responseModel(body);
    await this.quizService.incrementResponses(body.quiz_id.toString());
    return newResponse.save();
  }

  async averageScoresByCourse(course_id: string): Promise<{average: string}> {
    const modules = (await this.moduleService.findByCourse(course_id)) as ModuleDocument[];
    const quizzes: QuizDocument[] = [];
    for(const module of modules) {
      const quiz = (await this.quizService.findOneByModule(module._id.toString())) as QuizDocument;
      quizzes.push(quiz);
    }
    
    let score = 0, count = 0;
    
    for(const quiz of quizzes) {
      const responses = await this.responseModel.find({quiz_id: quiz._id.toString()});
      for(const response of responses) {
        score += response.score;
      }
      count += responses.length;
    }
    return {average: (score / count).toFixed(2)};
  }

  async averageScoreByStudent(token: string): Promise<{average: string}> {
    const user_id = this.authService.GetIdFromToken(token);
    const responses = await this.responseModel.find({user_id});
    let score = 0;
    for(const res of responses) score += res.score;
    return {average: (score / responses.length).toFixed(2)};
  }
}
