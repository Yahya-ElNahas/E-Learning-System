/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleDocument } from './module.schema';
import { isIdValid } from 'src/helper';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as fs from 'fs';

@Injectable()
export class ModuleService {
  constructor(@InjectModel(Module.name) private readonly moduleModel: Model<ModuleDocument>) {}

  /**
   * Create a new module.
   * @param body - Module creation data.
   * @returns Created module.
   */
  async create(body: {
    course_id: string;
    title: string;
    content: string;
    resources?: { path: string; type: string }[];
  }): Promise<Module> {
    isIdValid(body.course_id); // Validate course ID.
    const newModule = new this.moduleModel(body);
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
    },
  ): Promise<Module> {
    isIdValid(id); // Validate module ID.
    if (body.course_id) isIdValid(body.course_id); // Validate course ID if present.
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
    const result = await this.moduleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Module with ID "${id}" not found`);
    }
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
}
