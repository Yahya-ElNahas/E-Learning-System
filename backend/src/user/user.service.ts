/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  // Create a new user
  async create(userDto: any): Promise<UserDocument> {
    const newUser = new this.userModel(userDto);
    return await newUser.save();
  }

  // Find all users
  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find().exec();
  }
  // Find a user by email
  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  // Find a user by ID
  async findById(id: string): Promise<UserDocument | null> {
    return await this.userModel.findById(id).exec();
  }

  async update(id: string, updateData: any): Promise<UserDocument | null> {
    return await this.userModel.findByIdAndUpdate(id, updateData, {
      new: true, 
    }).exec();
  }


  async updateByEmail(email: string, updateData: any): Promise<UserDocument> {
    return await this.userModel.findOneAndUpdate({ email }, updateData, {
      new: true,
    });
  }

  // Delete a user by ID
  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  async findByRole(role: Role): Promise<UserDocument[]> {
    return this.userModel.find({ role }).exec(); 
  }
  async findByName(name : string):Promise<any>{
    return this.userModel.find({name}).exec()
  }

}

