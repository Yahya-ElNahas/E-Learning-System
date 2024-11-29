import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleDocument } from './module.schema';
import { isIdValid } from 'src/helper';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ModuleService {
  constructor(@InjectModel(Module.name) private moduleModel: Model<ModuleDocument>) {}

  async create(body: {
    course_id: string,
    title: string,
    content: string,
    resources?: [{path: string; type: string}]
  }): Promise<Module> {
    isIdValid(body.course_id);
    const newModule = new this.moduleModel(body);
    return newModule.save();
  }

  async findAll(): Promise<Module[]> {
    return this.moduleModel.find().exec();
  }

  async findOne(id: string): Promise<Module> {
    isIdValid(id);
    const module = await this.moduleModel.findById(id).exec();
    if (!module) {
      throw new NotFoundException(`Module with ID "${id}" not found`);
    }
    return module;
  }

  async update(id: string, body: {
    course_id?: string,
    title?: string,
    content?: string,
    resources?: [{path: string; type: string}]
  }): Promise<Module> {
    isIdValid(id);
    if(body.course_id) isIdValid(body.course_id);
    const updatedModule = await this.moduleModel.findByIdAndUpdate(id, body, { new: true }).exec();
    if (!updatedModule) {
      throw new NotFoundException(`Module with ID "${id}" not found`);
    }
    return updatedModule;
  }

  async delete(id: string): Promise<void> {
    isIdValid(id);
    const result = await this.moduleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Module with ID "${id}" not found`);
    }
  }

  async uploadResource(
    moduleId: string,
    file: Express.Multer.File,
    type: string,
  ): Promise<Module> {
    const module = await this.moduleModel.findById(moduleId);
    if (!module) throw new NotFoundException('Module not found');
    const filePath = path.join('uploads', file.filename);
    const resource = { type, path: filePath };
    if (!module.resources) module.resources = [];
    module.resources.push(resource);
    return await module.save();
  }
}
