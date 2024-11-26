import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Response, ResponseDocument } from './response.schema';
import { isIdValid } from '../helper';  // Adjust import path

@Injectable()
export class ResponseServic {
  constructor(
    @InjectModel(Response.name) private readonly responseModel: Model<ResponseDocument>,
  ) {}

  async create(body: Partial<Response>): Promise<Response> {
    const Added_Response = new this.responseModel(body);
    return Added_Response.save();
  }

  async findAll(): Promise<Response[]> {
    return this.responseModel.find().exec();
  }

  async findOne(id: string): Promise<Response> {
    isIdValid(id);
    const res = await this.responseModel.findById(id).exec();
    if (!res) {
      throw new NotFoundException('not found');
    }
    return res;
  }

  async updatePartial(id: string, body: Partial<Response>): Promise<{ Acknowledgment: boolean }> {
    isIdValid(id);
    const updated_Data = await this.responseModel.findByIdAndUpdate(id, body, { new: true }).exec();
    if (!updated_Data) {
      throw new NotFoundException(`Response with ID ${id} not found`);
    }
    return { Acknowledgment: true };
  }

  async updateFull(id: string, body: Partial<Response>): Promise<{ Acknowledgment: boolean }> {
    isIdValid(id);
    if (!body.answers || !body.quiz_id || !body.score || !body.user_id) {
      throw new BadRequestException('All fields are required');
    }
    const updated_Data = await this.responseModel.findByIdAndUpdate(id, body, { new: true }).exec();
    if (!updated_Data) {
      throw new NotFoundException(`Response with ID ${id} not found`);
    }
    return { Acknowledgment: true };
  }

  async delete(id: string): Promise<{ Acknowledgment: boolean }> {
    const result = await this.responseModel.findByIdAndDelete(id).exec();
    if (!result) {
      return { Acknowledgment: false };
    }
    return { Acknowledgment: true };
  }
}
