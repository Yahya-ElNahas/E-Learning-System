import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleDocument } from './module.schema';

@Injectable()
export class ModuleService {
  constructor(@InjectModel(Module.name) private moduleModel: Model<ModuleDocument>) {}

  async create(createModuleDto: Partial<Module>): Promise<Module> {
    const newModule = new this.moduleModel(createModuleDto);
    return newModule.save();
  }

  async findAll(): Promise<Module[]> {
    return this.moduleModel.find().exec();
  }

  async findOne(id: string): Promise<Module> {
    const module = await this.moduleModel.findById(id).exec();
    if (!module) {
      throw new NotFoundException(`Module with ID "${id}" not found`);
    }
    return module;
  }

  async update(id: string, updateModuleDto: Partial<Module>): Promise<Module> {
    const updatedModule = await this.moduleModel.findByIdAndUpdate(id, updateModuleDto, {
      new: true,
    }).exec();

    if (!updatedModule) {
      throw new NotFoundException(`Module with ID "${id}" not found`);
    }
    return updatedModule;
  }

  async delete(id: string): Promise<void> {
    const result = await this.moduleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Module with ID "${id}" not found`);
    }
  }
}
