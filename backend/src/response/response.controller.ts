import { Controller, Get, Post, Body, Param,Patch, Put, Delete } from '@nestjs/common';
import { ResponseService } from './response.service';
import { Response } from './response.schema';

@Controller('Responses')

export default class ResponseModel{
    constructor(private readonly responseService: ResponseService) {}

    @Get()
    async findAll() : Promise<Response[]>{
        return this.responseService.findAll()
    }
    @Get(':id')
    async findOne(@Param('id') id: string) : Promise<Response>{
        return this.responseService.findOne(id)
    }

    @Post() 
    async create(
        @Body() data : Partial<Response>
    ): Promise<Response>{
        const res = this.responseService.create(data)
        return res;
    }

    @Patch(':id')
    async updatePartial(
      @Param('id') id: string, 
      @Body() data: Partial<Response>
    ): Promise<{ acknowledgment: boolean }> {
      await this.responseService.updatePartial(id, data);
      return { acknowledgment: true };
    }

    @Put(':id')
    async updateFull(
      @Param('id') id: string, 
      @Body() data: Partial<Response>
    ): Promise<{ acknowledgment: boolean }> {
      await this.responseService.updateFull(id, data);
      return { acknowledgment: true };
    }
    @Delete(':id')
    async delete(
      @Param('id') id: string,
    ): Promise<{ acknowledgment: boolean }> {
      await this.responseService.delete(id);
      return { acknowledgment: true };
    }
}