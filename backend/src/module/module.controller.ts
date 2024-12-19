/* eslint-disable prettier/prettier */
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch, 
  Delete, 
  UseGuards, 
  UseInterceptors, 
  UploadedFile,
  UploadedFiles
} from '@nestjs/common';
import { ModuleService } from './module.service';
import { Module } from './module.schema';
import { Role as UserRole } from '../user/user.schema';
import { Role } from '../auth/reflectors';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  /**
   * Retrieve all modules.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Module[]> {
    return this.moduleService.findAll();
  }

  @Get('course/:id')
  @UseGuards(JwtAuthGuard)
  async findByCourse(@Param('id') id: string): Promise<Module[]> {
    return this.moduleService.findByCourse(id);
  }

  /**
   * Retrieve a module by its ID.
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Module> {
    return this.moduleService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.INSTRUCTOR)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'resources', maxCount: 10 }, // Accept up to 10 files under the key 'resources'
    ])
  )
  async create(
    @Body() createModuleDto: { course_id: string; title: string; content: string, difficulty_level: string },
    @UploadedFiles()
    files: { resources?: Express.Multer.File[] }
  ) {
    const uploadedFiles = files?.resources?.map((file) => ({
      path: file.path,
      type: file.mimetype,
    }));

    return this.moduleService.create({ ...createModuleDto, resources: uploadedFiles });
  }

  /**
   * Update a module by ID.
   * Restricted to instructors.
   */
  @Patch(':module_id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.INSTRUCTOR)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'resources', maxCount: 10 },
  ]))
  async update(
    @Param('module_id') moduleId: string,
    @Body() updateModuleDto: { title?: string; content?: string; difficulty_level?: string },
    @UploadedFiles() files: { resources?: Express.Multer.File[] },
  ) {
    const uploadedFiles = files?.resources?.map((file) => ({
      path: file.path,
      type: file.mimetype,
    }));

    return this.moduleService.update(moduleId, {
      ...updateModuleDto,
      resources: uploadedFiles,
    });
  }


  /**
   * Upload a resource file for a specific module.
   * Restricted to instructors.
   */
  // @Post(':id/upload')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Role(UserRole.INSTRUCTOR)
  // @UseInterceptors(
  //   FileFieldsInterceptor('file', {
  //     storage: diskStorage({
  //       destination: '../uploads', 
  //       filename: (req, file, cb) => {
  //         const uniqueName = `${Date.now()}-${file.originalname}`;
  //         cb(null, uniqueName);
  //       },
  //     }),
  //     fileFilter: (req, file, cb) => {
  //       if (!file.mimetype.match(/\/(pdf|jpeg|png|jpg|mp4)$/)) {
  //         return cb(new Error('Only PDF, JPEG, PNG, and MP4 files are allowed'), false);
  //       }
  //       cb(null, true);
  //     },
  //   }),
  // )
  // async uploadFile(
  //   @Param('id') moduleId: string,
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body('type') type: string,
  // ): Promise<Module> {
  //   return this.moduleService.uploadResource(moduleId, file, type);
  // }

  /**
   * Delete a module by ID.
   * Restricted to instructors.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.INSTRUCTOR)
  async delete(@Param('id') id: string): Promise<void> {
    await this.moduleService.delete(id);
  }
}
