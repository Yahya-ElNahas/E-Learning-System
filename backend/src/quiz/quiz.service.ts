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
    questionsPool?: Array<{
      question: string,
      options: string[],
      correctAnswer: string,
      difficulty: string
    }>
  }): Promise<Quiz> {
    isIdValid(body.module_id);
    const newQuiz = new this.quizModel(body);
    return newQuiz.save();
  }

  async findAll(): Promise<Quiz[]> {
    return this.quizModel.find().exec();
  }

  async findOneByModule(id: string) {
    const res = await this.quizModel.findOne({module_id: id});
    if(!res) return {}
    return res;
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
    questionsPool: Array<{
      question: string,
      options: string[],
      correctAnswer: string,
      difficulty: string
    }>,
    numberOfQuestions: number
  }): Promise<Quiz> {
    isIdValid(id);
    console.log(body)
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

  async incrementResponses(id: string) {
    const quizResponses = (await this.quizModel.findById(id)).numberOfResponses;
    console.log(quizResponses)
    return this.quizModel.findByIdAndUpdate(id, {numberOfResponses: quizResponses + 1});
  }
}
