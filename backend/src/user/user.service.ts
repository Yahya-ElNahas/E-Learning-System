/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(userDto: any): Promise<User> {
    const user = new this.userModel(userDto);
    return await user.save();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }

  async update(userId: string, updateData: any): Promise<User> {
    return await this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
  }
}