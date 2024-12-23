/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req, NotFoundException, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserDocument } from './user.schema';
import { Role } from '../auth/reflectors';
import { Request, Response } from 'express';
import { RolesGuard, JwtAuthGuard } from '../auth/guards'; 
import { Role as UserRole } from './user.schema';
import { AuthService } from 'src/auth/auth.service';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly authService: AuthService

  
      
  ) {}

  @Post()
  async create(@Body() body: { email: string; username: string; password: string; role: string; isVerified: boolean }): Promise<UserDocument> {
    return this.userService.create(body);
  }
  @Get('profile/details')
  @UseGuards(JwtAuthGuard)
  async getProfileDetails(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserDocument | null> {
    const token = req.cookies['verification_token']; 
    const userId = this.authService.GetIdFromToken(token); 
    return this.userService.findById(userId); 
  }
  @Patch('profile/details')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './uploads/profile-pictures',
        filename: (req, file, callback) => {
          callback(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    })
  )
  async updateProfile(
    @Body() updateData: Partial<User>,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @UploadedFile() profilePicture: Express.Multer.File
  ) {
    // Extract user ID from the token
    const token = req.cookies['verification_token'];
    const userId = this.authService.GetIdFromToken(token);

    // If a file is uploaded, add its URL to the update data
    if (profilePicture) {
      updateData.profile_picture_url = `/uploads/profile-pictures/${profilePicture.filename}`;
    }

    // Update user data
    const updatedUser = await this.userService.updateUser(userId, updateData);

    // Remove sensitive information before returning
    const { password, otp, ...userWithoutSensitiveInfo } = updatedUser.toObject();
    return userWithoutSensitiveInfo;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() body: { email?: string; username?: string; password?: string; role?: string; isVerified?: boolean }
  ): Promise<UserDocument> {
    return this.userService.update(id, body);
  }
  @Delete('profile')
@UseGuards(JwtAuthGuard)
async deleteProfile(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
  
  const token = req.cookies['verification_token'];
  const userId = this.authService.GetIdFromToken(token);

  const deletedUser = await this.userService.deleteUser(userId);

  return { message: 'User deleted successfully' };
}

  
  
  
  @Get('/students/all')
  @UseGuards(JwtAuthGuard)
  async getStudents(): Promise<UserDocument[]> {
    return this.userService.findByRole(UserRole.STUDENT);
  }
  
  @Get('/instructors/all')
  @UseGuards(JwtAuthGuard)
  async getInstructors(): Promise<UserDocument[]> {
    return this.userService.findByRole(UserRole.INSTRUCTOR);
  }


  @Get('/admins/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  async getAdmins(): Promise<UserDocument[]> {
    return this.userService.findByRole(UserRole.ADMIN);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  async findAll(): Promise<UserDocument[]> {
    return this.userService.findAll();
  }

  @Get('email/:email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.ADMIN)
  async findByEmail(@Param('email') email: string): Promise<UserDocument> {
    return this.userService.findByEmail(email);
  }
}
