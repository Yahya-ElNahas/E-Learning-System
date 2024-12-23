/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleDocument } from './module.schema';
import { isIdValid } from 'src/helper';
import * as path from 'path';
import { CourseService } from 'src/course/course.service';
import * as fs from 'fs';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(Module.name) private readonly moduleModel: Model<ModuleDocument>,
    private readonly courseService: CourseService
  ) {}


  async create(body: {
    course_id: string;
    title: string;
    content: string;
    difficulty_level: string
    resources?: { path: string; type: string }[];
  }): Promise<Module> {
    isIdValid(body.course_id); 
    const newModule = new this.moduleModel(body);
    const moduleNo = ( await this.courseService.findOne(body.course_id)).modulesNo;
    this.courseService.update(body.course_id, {modulesNo: moduleNo+1});
    return await newModule.save();
  }

  /**
   * Fetch all modules.
   * @returns Array of all modules.
   */
  async findAll(): Promise<Module[]> {
    return this.moduleModel.find().exec();
  }

  /**
   * Fetch a single module by its ID.
   * @param id - Module ID.
   * @returns Module document.
   */
  async findOne(id: string): Promise<Module> {
    isIdValid(id); // Validate module ID.
    const module = await this.moduleModel.findById(id).exec();
    if (!module) {
      throw new NotFoundException(`Module with ID "${id}" not found`);
    }
    return module;
  }

  /**
   * Update an existing module by its ID.
   * @param id - Module ID.
   * @param body - Partial module update data.
   * @returns Updated module document.
   */
  async update(
    id: string,
    body: {
      course_id?: string;
      title?: string;
      content?: string;
      resources?: { path: string; type: string }[];
      difficulty_level?: string;
      rating?: number[]
    },
  ): Promise<Module> {
    isIdValid(id); 
    if (body.course_id) isIdValid(body.course_id); 
    const resources = (await this.moduleModel.findById(id)).resources;
    for(const res of body.resources) resources.push(res);
    body.resources = resources;
    const updatedModule = await this.moduleModel.findByIdAndUpdate(id, body, { new: true }).exec();
    if (!updatedModule) {
      throw new NotFoundException(`Module with ID "${id}" not found`);
    }
    return updatedModule;
  }

  /**
   * Delete a module by its ID.
   * @param id - Module ID.
   * @returns Acknowledgment of deletion.
   */
  async delete(id: string): Promise<void> {
    isIdValid(id); // Validate module ID.
    const body = await this.moduleModel.findById(id);
    const result = await this.moduleModel.findByIdAndDelete(id).exec();
    const moduleNo = ( await this.courseService.findOne(body.course_id)).modulesNo;
    this.courseService.update(body.course_id, {modulesNo: moduleNo-1});
    if (!result) {
      throw new NotFoundException(`Module with ID "${id}" not found`);
    }
  }

  async findByCourse(id: string): Promise<Module[]> {
    return await this.moduleModel.find({course_id: id}).exec();
  }

  /**
   * Upload a resource file for a specific module.
   * @param moduleId - Module ID.
   * @param file - Uploaded file.
   * @param type - Type of the resource (e.g., "video", "document").
   * @returns Updated module with the new resource.
   */
  async uploadResource(
    moduleId: string,
    file: Express.Multer.File,
    type: string,
  ): Promise<Module> {
    isIdValid(moduleId); // Validate module ID.
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) throw new NotFoundException(`Module with ID "${moduleId}" not found`);

    const filePath = path.join('uploads', file.filename); // Define file path.
    const resource = { path: filePath, type }; // Create resource object.

    if (!module.resources) module.resources = []; // Initialize resources array if not present.
    module.resources.push(resource); // Add resource to the module.

    return await module.save();
  }

  async rate(id: string, rating: number) {
    const module = await this.moduleModel.findById(id);
    let ratings = [];
    if(module.ratings) ratings = module.ratings;
    ratings.push(rating);
    return await this.moduleModel.findByIdAndUpdate(id, {ratings})
  }

  async getResourcePath(moduleId: string, resourcePath: string): Promise<string> {
    const module = await this.moduleModel.findById(moduleId);
    if (!module) throw new NotFoundException(`Module with ID "${moduleId}" not found`);

    const resource = module.resources.find((res) => res.path === resourcePath);
    if (!resource) throw new NotFoundException(`Resource with path "${resourcePath}" not found`);

    return path.join(__dirname, '..', 'uploads', resource.path); 
  }
}
