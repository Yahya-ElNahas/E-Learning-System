import { Controller, Get, Post, Body, Param,Patch, Put, Delete, UseGuards } from '@nestjs/common';
import { ResponseService } from './response.service';
import { Response } from './response.schema';
import { JwtAuthGuard } from 'src/auth/guards';

@Controller('Responses')
export default class ResponseModel{
    constructor(private readonly responseService: ResponseService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll() : Promise<Response[]>{
        return this.responseService.findAll()
    }
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string) : Promise<Response>{
        return this.responseService.findOne(id)
    }

    @Post() 
    @UseGuards(JwtAuthGuard)
    async create(
        @Body() data : Partial<Response>
    ): Promise<Response>{
        const res = this.responseService.create(data)
        return res;
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async updatePartial(
      @Param('id') id: string, 
      @Body() data: Partial<Response>
    ): Promise<{ acknowledgment: boolean }> {
      await this.responseService.updatePartial(id, data);
      return { acknowledgment: true };
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateFull(
      @Param('id') id: string, 
      @Body() data: Partial<Response>
    ): Promise<{ acknowledgment: boolean }> {
      await this.responseService.updateFull(id, data);
      return { acknowledgment: true };
    }
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete(
      @Param('id') id: string,
    ): Promise<{ acknowledgment: boolean }> {
      await this.responseService.delete(id);
      return { acknowledgment: true };
    }
}