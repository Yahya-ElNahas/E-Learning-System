/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async create(userDto: any): Promise<User> {
    const user = new this.userModel(userDto);
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`User with ID ${id} not found.`);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateData: any): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedUser) throw new NotFoundException(`User with ID ${id} not found.1`);
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`User with ID ${id} not found.`);
  }
}