import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ModuleService } from './module.service';
import { Module } from './module.schema';
import { Role as UserRole } from 'src/user/user.schema';
import { Role } from 'src/auth/reflectors';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

<<<<<<< Updated upstream
=======
  @Post()
  async create(
    @Body() createModuleDto: { course_id: string; title: string; content: string; resources?: string[] }
  ): Promise<Module> {
    return this.moduleService.create(createModuleDto);
  }
>>>>>>> Stashed changes
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Module[]> {
    return this.moduleService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Module> {
    return this.moduleService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.INSTRUCTOR)
  async create(@Body() body: {
    course_id: string,
    title: string,
    content: string,
    resources?: [{path: string; type: string}]
  }): Promise<Module> {
    return this.moduleService.create(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.INSTRUCTOR)
  async update(
    @Param('id') id: string,
    @Body() body: {
      course_id?: string,
      title?: string,
      content?: string,
      resources?: [{path: string; type: string}]
    }
  ): Promise<Module> {
    return this.moduleService.update(id, body);
  }

  @Post(':id/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.INSTRUCTOR)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '../uploads', 
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(pdf|jpeg|png|jpg|mp4)$/)) {
          return cb(new Error('Only PDF, JPEG, PNG and MP4 files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(
    @Param('id') moduleId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string,
  ) {
    return this.moduleService.uploadResource(moduleId, file, type);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.INSTRUCTOR)
  async delete(@Param('id') id: string): Promise<void> {
    await this.moduleService.delete(id);
  }
}
