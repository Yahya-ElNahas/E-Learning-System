/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz, QuizDocument } from './quiz.schema';
import { isIdValid } from 'src/helper';

@Injectable()
export class QuizService {
  constructor(@InjectModel(Quiz.name) private quizModel: Model<QuizDocument>) {}

  async create(body: {
    module_id: string,
    questions: Array<{
      question: string,
      options: string[],
      correctAnswer: string
    }>
  }): Promise<Quiz> {
    isIdValid(body.module_id);
    if(body.questions.length === 0)
      throw new BadRequestException('There are no questions');
    const newQuiz = new this.quizModel(body);
    return newQuiz.save();
  }

  async findAll(): Promise<Quiz[]> {
    return this.quizModel.find().exec();
  }

  async findOne(id: string): Promise<Quiz> {
    isIdValid(id);
    const quiz = await this.quizModel.findById(id).exec();
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID "${id}" not found`);
    }
    return quiz;
  }

  async update(id: string, body: {
    module_id?: string,
    questions?: Array<{
      question: string,
      options: string[],
      correctAnswer: string
    }>
  }): Promise<Quiz> {
    isIdValid(id);
    if(body.module_id) isIdValid(body.module_id);
    if(body.questions && body.questions.length === 0)
      throw new BadRequestException('There are no questions');
    const updatedQuiz = await this.quizModel.findByIdAndUpdate(id, body, { new: true }).exec();
    if (!updatedQuiz) {
      throw new NotFoundException(`Quiz with ID "${id}" not found`);
    }
    return updatedQuiz;
  }

  async delete(id: string): Promise<void> {
    isIdValid(id);
    const result = await this.quizModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Quiz with ID "${id}" not found`);
    }
  }
}
