import { Controller, Get, Post, Body, Param,Patch, Put, Delete} from '@nestjs/common';
import { ResponseServic } from './response.service';
import { Response } from './response.schema';

@Controller('Responses')

export default class ResponseModel{
    constructor(private readonly responseServic: ResponseServic) {}

    @Get()
    async findAll() : Promise<Response[]>{
        return this.responseServic.findAll()
    }
    @Get(':id')
    async findOne(@Param('id') id: string) : Promise<Response>{
        return this.responseServic.findOne(id)
    }

    @Post() 
    async create(
        @Body() data : Partial<Response>
    ): Promise<Response>{
        const res = this.responseServic.create(data)
        return res;
    }

    @Patch(':id')
    async updatePartial(
      @Param('id') id: string, 
      @Body() data: Partial<Response>
    ): Promise<{ acknowledgment: boolean }> {
      await this.responseServic.updatePartial(id, data);
      return { acknowledgment: true };
    }

    @Put(':id')
    async updateFull(
      @Param('id') id: string, 
      @Body() data: Partial<Response>
    ): Promise<{ acknowledgment: boolean }> {
      await this.responseServic.updateFull(id, data);
      return { acknowledgment: true };
    }
    @Delete(':id')
    async delete(
      @Param('id') id: string,
    ): Promise<{ acknowledgment: boolean }> {
      await this.responseServic.delete(id);
      return { acknowledgment: true };
    }
}