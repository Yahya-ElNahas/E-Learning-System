import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument, Difficulty } from './course.schema';
import { isIdValid } from 'src/helper';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>) {}

  // Create a new course
  async create(body: {
    title: string;
    description: string;
    category: string;
    difficulty_level: Difficulty;
    created_by: string;
  }): Promise<Course> {
    isIdValid(body.created_by);
    body.difficulty_level = fixDifficultyLevel(body.difficulty_level);
    const course = new this.courseModel(body);
    return course.save();
  }

  // Get all courses
  async findAll(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  // Get a course by ID
  async findOne(id: string): Promise<Course> {
    isIdValid(id);
    const course = await this.courseModel.findById(id).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  // Update a course
  async update(id: string, body: {
    title?: string;
    description?: string;
    category?: string;
    difficulty_level?: Difficulty;
    created_by?: string;
  }): Promise<Course> {
    isIdValid(id);
    if(body.created_by) isIdValid(body.created_by);
    if(body.difficulty_level) body.difficulty_level = fixDifficultyLevel(body.difficulty_level);
    const updatedCourse = await this.courseModel.findByIdAndUpdate(id, body, { new: true }).exec();
    if (!updatedCourse) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return updatedCourse;
  }

  // Delete a course
  async remove(id: string): Promise<void> {
    isIdValid(id);
    const result = await this.courseModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
  }
}

function fixDifficultyLevel(difficulty: string): Difficulty {
  switch(difficulty) {
    case "beginner": return Difficulty.BEGINNER;
    case "intermediate": return Difficulty.INTERMEDIATE;
    case "advanced": return Difficulty.ADVANCED;
  }
  throw new BadRequestException(`Invalid difficulty_level: ${difficulty}`);
}