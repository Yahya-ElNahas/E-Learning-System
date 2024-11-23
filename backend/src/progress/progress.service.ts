/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress, ProgressDocument } from './progress.schema';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private readonly progressModel: Model<ProgressDocument>,
  ) {}

  // Create a new progress record
  async create(progressData: {
    progress_id: string;
    user_id: string;
    course_id: string;
    completion_percentage: number;
    last_accessed: Date;
  }): Promise<Progress> {
    const { progress_id, user_id, course_id, completion_percentage, last_accessed } = progressData;

    // Validate completion percentage
    if (completion_percentage < 0 || completion_percentage > 100) {
      throw new BadRequestException(
        'Completion percentage must be between 0 and 100.',
      );
    }

    const newProgress = new this.progressModel({
      progress_id,
      user_id,
      course_id,
      completion_percentage,
      last_accessed,
    });

    return newProgress.save();
  }

  // Get all progress records or filter by user_id or course_id
  async findAll(user_id?: string, course_id?: string): Promise<Progress[]> {
    const filter: Record<string, string> = {};
    if (user_id) {
      filter.user_id = user_id;
    }
    if (course_id) {
      filter.course_id = course_id;
    }

    return this.progressModel.find(filter).exec();
  }

  // Get progress by ID
  async findById(id: string): Promise<Progress> {
    const progress = await this.progressModel.findById(id).exec();
    if (!progress) {
      throw new NotFoundException(`Progress record with ID ${id} not found.`);
    }
    return progress;
  }

  // Update progress record
  async update(
    id: string,
    updateData: {
      completion_percentage?: number;
      last_accessed?: Date;
    },
  ): Promise<Progress> {
    // Validate completion percentage if provided
    if (
      updateData.completion_percentage != null &&
      (updateData.completion_percentage < 0 || updateData.completion_percentage > 100)
    ) {
      throw new BadRequestException(
        'Completion percentage must be between 0 and 100.',
      );
    }

    const updatedProgress = await this.progressModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .exec();

    if (!updatedProgress) {
      throw new NotFoundException(`Progress record with ID ${id} not found.`);
    }
    return updatedProgress;
  }
}
