import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress, ProgressDocument } from './progress.schema';

class CreateProgressDto {
  progressId: string;
  userId: string;
  courseId: string;
  completionPercentage: number;
  lastAccessed: Date;
}

class UpdateProgressDto {
  userId?: string;
  courseId?: string;
  completionPercentage?: number;
  lastAccessed?: Date;
}

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private readonly progressModel: Model<ProgressDocument>,
  ) {}

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

  async create(createProgressDto: CreateProgressDto): Promise<Progress> {
    const newProgress = new this.progressModel(createProgressDto);
    return newProgress.save();
  }

  async update(id: string, updateProgressDto: UpdateProgressDto): Promise<Progress> {
    const updatedProgress = await this.progressModel
      .findByIdAndUpdate(id, updateProgressDto, { new: true })
      .exec();
    if (!updatedProgress) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }
    return updatedProgress;
  }

  async remove(id: string): Promise<void> {
    const result = await this.progressModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }
  }
}
