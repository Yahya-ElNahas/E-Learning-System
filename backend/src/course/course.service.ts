import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument, Difficulty } from './course.schema';

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
    const course = new this.courseModel(body);
    return course.save();
  }

  // Get all courses
  async findAll(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  // Get a course by ID
  async findOne(id: string): Promise<Course> {
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
    const updatedCourse = await this.courseModel.findByIdAndUpdate(id, body, { new: true }).exec();
    if (!updatedCourse) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return updatedCourse;
  }

  // Delete a course
  async remove(id: string): Promise<void> {
    const result = await this.courseModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
  }
}
