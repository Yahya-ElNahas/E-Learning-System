<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
        return res;
    }

    @Patch(':id')
<<<<<<< Updated upstream
    @UseGuards(JwtAuthGuard)
=======
>>>>>>> Stashed changes
    async updatePartial(
      @Param('id') id: string, 
      @Body() data: Partial<Response>
    ): Promise<{ acknowledgment: boolean }> {
<<<<<<< Updated upstream
      await this.responseService.updatePartial(id, data);
=======
      await this.responseServic.updatePartial(id, data);
>>>>>>> Stashed changes
      return { acknowledgment: true };
    }

    @Put(':id')
<<<<<<< Updated upstream
    @UseGuards(JwtAuthGuard)
=======
>>>>>>> Stashed changes
    async updateFull(
      @Param('id') id: string, 
      @Body() data: Partial<Response>
    ): Promise<{ acknowledgment: boolean }> {
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
