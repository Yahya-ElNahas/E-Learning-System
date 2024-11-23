/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './course.schema';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
  ) {}


  async create(courseData: {
    course_id: string;
    title: string;
    description: string;
    category: string;
    difficulty_level: string;
    created_by: string;
  }): Promise<Course> {
    const { course_id, title, description, category, difficulty_level, created_by } = courseData;

  
    const validLevels = ['Beginner', 'Intermediate', 'Advanced'];
    if (!validLevels.includes(difficulty_level)) {
      throw new BadRequestException(
        `Invalid difficulty level. Valid levels are: ${validLevels.join(', ')}`,
      );
    }

    const newCourse = new this.courseModel({
      course_id,
      title,
      description,
      category,
      difficulty_level,
      created_by,
    });
    return newCourse.save();
  }

 
  async findAll(search?: string): Promise<Course[]> {
    if (search) {
      const searchRegex = new RegExp(search, 'i'); 
      return this.courseModel.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
        ],
      }).exec();
    }
    return this.courseModel.find().exec();
  }


  async findById(id: string): Promise<Course> {
    const course = await this.courseModel.findById(id).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found.`);
    }
    return course;
  }

  
  async update(
    id: string,
    updateData: {
      title?: string;
      description?: string;
      category?: string;
      difficulty_level?: string;
    },
  ): Promise<Course> {
    const { difficulty_level } = updateData;

    if (difficulty_level) {
      const validLevels = ['Beginner', 'Intermediate', 'Advanced'];
      if (!validLevels.includes(difficulty_level)) {
        throw new BadRequestException(
          `Invalid difficulty level. Valid levels are: ${validLevels.join(', ')}`,
        );
      }
    }

    const updatedCourse = await this.courseModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .exec();
    if (!updatedCourse) {
      throw new NotFoundException(`Course with ID ${id} not found.`);
    }
    return updatedCourse;
  }

  
  async searchCourses(query: string): Promise<Course[]> {
    const searchRegex = new RegExp(query, 'i'); 
    return this.courseModel.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ],
    }).exec();
  }
}
