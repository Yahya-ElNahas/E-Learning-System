/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
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

  async findByUsername(username: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ username }).exec();
  } 
  async updateUser(userId: string, updateData: Partial<User>): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
  
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.userModel.findOne({ email: updateData.email });
      if (existingUser) {
        throw new UnauthorizedException('Email already in use');
      }
  
      updateData.isVerified = false;
      updateData.otp = await bcrypt.hash(this.generateOtp(), 10);
      // TODO: Implement sendOtpMail function to send OTP to new email
      // await this.sendOtpMail(updateData.email, otp);
    }
  
    Object.assign(user, updateData);
    await user.save();
    return user;
  }
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }



  async update(id: string, updateData: any): Promise<UserDocument | null> {
    return await this.userModel.findByIdAndUpdate(id, updateData, {
      new: true, 
    }).exec();
  }
async deleteUser(userId: string): Promise<UserDocument | null> {
  const user = await this.userModel.findByIdAndDelete(userId).exec();
  
  if (!user) {
    throw new NotFoundException('User not found');
  }

  return user;  
}



  async updateByEmail(email: string, updateData: any): Promise<UserDocument> {
    return await this.userModel.findOneAndUpdate({ email }, updateData, {
      new: true,
    });
  }


  async findByRole(role: Role): Promise<UserDocument[]> {
    return this.userModel.find({ role }).exec(); 
  }
  async findByName(name : string):Promise<any>{
    return this.userModel.find({name}).exec()
  }

}

