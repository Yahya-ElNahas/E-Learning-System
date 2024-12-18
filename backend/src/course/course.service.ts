/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument, Difficulty } from './course.schema';
import { isIdValid } from '../helper';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
    private readonly authService: AuthService,
  ) {}

  // Create a new course
  async create(token: string, body: {
    title: string;
    description: string;
    category: string;
    difficulty_level: string;
  }): Promise<Course> {
    const created_by = this.authService.GetIdFromToken(token);
    body['created_by'] = created_by;
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
  async update(
    id: string,
    body: {
      title?: string;
      description?: string;
      category?: string;
      difficulty_level?: string;
      created_by?: string;
    },
  ): Promise<Course> {
    isIdValid(id);
    if (body.created_by) isIdValid(body.created_by);
    if (body.difficulty_level)
      body.difficulty_level = fixDifficultyLevel(body.difficulty_level);
    const updatedCourse = await this.courseModel
      .findByIdAndUpdate(id, body, { new: true })
      .exec();
    if (!updatedCourse) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return updatedCourse;
  }

  // "Remove" a course (set isAvailable to false)
  async remove(id: string): Promise<void> {
    isIdValid(id);

    // Update isAvailable field to false
    const updatedCourse = await this.courseModel.findByIdAndUpdate(
      id,
      { isAvailable: false },
      { new: true } // Return the updated document
    ).exec();

    if (!updatedCourse) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
  }

  // Search courses by title
  async searchByTitle(title: string): Promise<Course[]> {
    return this.courseModel.find({ title: title }).exec();
  }

  // Search courses by instructor (created_by)
  async searchByInstructor(token: string): Promise<Course[]> {
    const user_id = this.authService.GetIdFromToken(token);
    return this.courseModel.find({ created_by: user_id }).exec();
  }
}

function fixDifficultyLevel(difficulty: string): Difficulty {
  switch (difficulty) {
    case 'beginner':
      return Difficulty.BEGINNER;
    case 'intermediate':
      return Difficulty.INTERMEDIATE;
    case 'advanced':
      return Difficulty.ADVANCED;
  }
  throw new BadRequestException(`Invalid difficulty_level: ${difficulty}`);
}
