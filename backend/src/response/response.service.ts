/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response, ResponseDocument } from './response.schema';
import { isIdValid } from '../helper'; // Helper to validate ObjectId
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(Response.name) private readonly responseModel: Model<ResponseDocument>,
    private readonly authService: AuthService,
  ) {}

  /**
   * Create a new response.
   * @param body Partial response object.
   * @returns Created response document.
   */
  async create(body: Partial<Response>): Promise<Response> {
    const newResponse = new this.responseModel(body);
    return newResponse.save();
  }

  /**
   * Fetch all responses.
   * @returns Array of responses.
   */
  async findAll(): Promise<Response[]> {
    return this.responseModel.find().exec();
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
    return newResponse.save();
  }
}
