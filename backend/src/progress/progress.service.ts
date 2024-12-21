/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress, ProgressDocument } from './progress.schema';
import { isIdValid } from 'src/helper';
import { AuthService } from '../auth/auth.service';
import { CourseService } from 'src/course/course.service';
import { UserService } from 'src/user/user.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Course, CourseDocument } from 'src/course/course.schema';
@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name)
    private readonly progressModel: Model<ProgressDocument>,
    private readonly authService: AuthService,
    private readonly courseService: CourseService,
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

  async create(course_id, token): Promise<Progress> {
    const user_id = this.authService.GetIdFromToken(token);
    isIdValid(course_id);
    const newBody = { user_id, course_id, completion_percentage: 0 };
    const newProgress = new this.progressModel(newBody);
    const course = await this.courseService.findOne(course_id);
    this.courseService.update(course_id, { enrolledNo: course.enrolledNo + 1 });

    const email = (await this.userService.findById(user_id)).email;
    const courseTitle = course.title;
    this.authService.sendMail(email, "Course Enrollment", `You have successfully enrolled in the ${courseTitle} course.`);

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

    const progress = await this.progressModel.findById(id).exec();
    if (!progress) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }

    const updatedProgress = await this.progressModel.findByIdAndUpdate(id, body, { new: true }).exec();

    if (body.completion_percentage === 100 && progress.completion_percentage !== 100) {
      const course = await this.courseService.findOne(progress.course_id.toString()) as CourseDocument;
      this.courseService.update(course._id.toString(), { completedNo: course.completedNo + 1 });
    }

    return updatedProgress;
  }

  async remove(id: string): Promise<void> {
    isIdValid(id);
    const progress = await this.progressModel.findById(id);
    if (!progress) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }

    const result = await this.progressModel.findByIdAndDelete(id).exec();
    const course = await this.courseService.findOne(progress.course_id.toString())as CourseDocument;
    this.courseService.update(course._id.toString(), { enrolledNo: course.enrolledNo - 1 });

    if (!result) {
      throw new NotFoundException(`Progress with ID ${id} not found`);
    }
  }

  async findByStudent(id: string): Promise<Progress> {
    return await this.progressModel.findOne({ user_id: id }).exec();
  }

  async findCourseByStudent(token: string, isToken: boolean): Promise<any[]> {
    const studentId = isToken ? this.authService.GetIdFromToken(token) : token;

    const progresses = await this.progressModel.find({ user_id: studentId }).exec();

    const courses: any[] = [];
    for (const progress of progresses) {
      const course = await this.courseService.findOne(progress.course_id.toString());
      if (course) {
        courses.push({
          _id: progress.course_id,
          title: course.title,
          description: course.description,
          category: course.category,
          difficulty_level: course.difficulty_level,
          created_by: course.created_by,
          isAvailable: course.isAvailable,
          keywords: course.keywords,
          completion_percentage: progress.completion_percentage,
        });
      }
    }

    return courses;
  }

  async getInstructorAnalytics(courseId: string) {
    const course = await this.courseService.findOne(courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const progresses = await this.progressModel.find({ course_id: courseId }).exec();

    const metrics = {
      belowAverage: 0,
      average: 0,
      aboveAverage: 0,
      excellent: 0,
    };

    progresses.forEach(({ completion_percentage }) => {
      if (completion_percentage < 50) metrics.belowAverage++;
      else if (completion_percentage < 75) metrics.average++;
      else if (completion_percentage < 100) metrics.aboveAverage++;
      else metrics.excellent++;
    });

    return {
      enrolledStudents: course.enrolledNo,
      completedStudents: course.completedNo,
      performanceMetrics: metrics,
    };
  }
}
