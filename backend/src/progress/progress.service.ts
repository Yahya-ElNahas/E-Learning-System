import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress, ProgressDocument } from './progress.schema';
import { isIdValid } from 'src/helper';
import { AuthService } from 'src/auth/auth.service';
import { CourseService } from 'src/course/course.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name)
    private readonly progressModel: Model<ProgressDocument>,
    private readonly authService: AuthService,
    private readonly courseSerive: CourseService,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<Progress[]> {
    return this.progressModel.find().exec();
  }

  async findOne(id: string): Promise<Progress> {
    const progress = await this.progressModel.findById(id).exec();
    if (!progress) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }
    return progress;
  }

  async create(body: {
    user_id: string,
    course_id: string
  }): Promise<Progress> {
    isIdValid(body.user_id);
    isIdValid(body.course_id);
    const newBody = {...body, completion_percentage: 0}
    const newProgress = new this.progressModel(newBody);
    const email = (await this.userService.findById(body.user_id)).email;
    const courseTitle = (await this.courseSerive.findOne(body.course_id)).title;
    this.authService.sendMail(email, "Course Enrollment", "You Have Successfully Enrolled in the " + courseTitle + " Course")
    return newProgress.save();
  }

  async update(
    id: string,
    body: {
      user_id?: string;
      course_id?: string;
      completion_percentage?: number;
    },
  ): Promise<Progress> {
    if (body.user_id) isIdValid(body.user_id);
    if (body.course_id) isIdValid(body.course_id);
    const updatedProgress = await this.progressModel
      .findByIdAndUpdate(id, body, { new: true })
      .exec();
    if (!updatedProgress) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }
    return updatedProgress;
  }

  async remove(id: string): Promise<void> {
    isIdValid(id);
    const result = await this.progressModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }
  }
}
