/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { Model } from 'mongoose';
import { UserDocument } from '../user/user.schema'; // Correct path to the User schema file
import { CourseDocument } from '../course/course.schema'; // Correct path to the Course schema file
import { ProgressDocument } from '../progress/progress.schema'; // Import your progress schema

@Injectable()
export class BackupService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    @InjectModel('Course') private readonly courseModel: Model<CourseDocument>,
    @InjectModel('Progress')
    private readonly progressModel: Model<ProgressDocument>,
  ) {}

  @Cron('0 0 * * *')
  async backupData() {
    try {
      const users = await this.getUserData();
      const courses = await this.getCourseData();
      const progress = await this.getProgressData();

      await this.saveBackup({ users, courses, progress });
    } catch (error) {
      console.error('Backup failed:', error);
    }
  }

  // Get user data from the database
  private async getUserData() {
    try {
      const users = await this.userModel.find().exec();
      return users.map((user) => ({
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        profile_picture_url: user.profile_picture_url,
      }));
    } catch (error) {
      console.error('Error fetching user data for backup:', error);
      throw new Error('Failed to fetch user data');
    }
  }

  // Get course data from the database (using the provided Course schema)
  private async getCourseData() {
    try {
      const courses = await this.courseModel.find().exec();
      return courses.map((course) => ({
        courseId: course._id.toString(), // Using ObjectId as courseId
        title: course.title,
        description: course.description,
        category: course.category,
        difficultyLevel: course.difficulty_level,
        createdBy: course.created_by.toString(), // CreatedBy is ObjectId
      }));
    } catch (error) {
      console.error('Error fetching course data for backup:', error);
      throw new Error('Failed to fetch course data');
    }
  }

  // Get progress data from the database
  private async getProgressData() {
    try {
      const progress = await this.progressModel.find().exec();
      return progress.map((progress) => ({
        userId: progress.user_id.toString(),
        courseId: progress.course_id.toString(),
        completionPercentage: progress.completion_percentage,
      }));
    } catch (error) {
      console.error('Error fetching progress data for backup:', error);
      throw new Error('Failed to fetch progress data');
    }
  }

  // Save backup to file (overwriting the previous backup)
  private async saveBackup(data: {
    users: any[];
    courses: any[];
    progress: any[];
  }) {
    try {
      // Backup data will include users, courses, and progress
      const backupData = JSON.stringify({
        timestamp: new Date().toISOString(),
        status: 'Backup successful',
        users: data.users,
        courses: data.courses,
        progress: data.progress,
      });

      const backupDir = path.resolve(__dirname, '../../backups');
      const backupFilePath = path.join(backupDir, 'backup_latest.json');  

      // Ensure backup directory exists
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
      }

      // Overwrite the previous backup file with the new data
      fs.writeFileSync(backupFilePath, backupData);
      console.log(`Backup Successful`);
    } catch (error) {
      console.error('Error during backup saving:', error);
      throw new Error('Backup failed during save operation');
    }
  }
}
