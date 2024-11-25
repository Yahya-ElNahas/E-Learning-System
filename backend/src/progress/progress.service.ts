import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress, ProgressDocument } from './progress.schema';
import { isIdValid } from 'src/helper';

@Injectable()
export class ProgressService {
  constructor( @InjectModel(Progress.name) private readonly progressModel: Model<ProgressDocument> ) {}

  async findAll(): Promise<Progress[]> {
    return this.progressModel.find().exec();
  }

  async findOne(id: string): Promise<Progress> {
    const progress = await this.progressModel.findById(id).exec();
    if (!progress) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }
    return progress;
  }

  async create(body: {
    user_id: string,
    course_id: string,
    completion_percentage: number
  }): Promise<Progress> {
    isIdValid(body.user_id);
    isIdValid(body.course_id);
    const newProgress = new this.progressModel(body);
    return newProgress.save();
  }

  async update(id: string, body: {
    user_id?: string,
    course_id?: string,
    completion_percentage?: number
  }): Promise<Progress> {
    if(body.user_id) isIdValid(body.user_id);
    if(body.course_id) isIdValid(body.course_id);
    const updatedProgress = await this.progressModel.findByIdAndUpdate(id, body, { new: true }).exec();
    if (!updatedProgress) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }
    return updatedProgress;
  }

  async remove(id: string): Promise<void> {
    isIdValid(id);
    const result = await this.progressModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }
  }
}
