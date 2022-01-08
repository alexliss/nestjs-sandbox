import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnDtoRequest } from './dto/column.dto.request';
import { ColumnDtoResponse } from './dto/column.dto.response';

@Controller()
export class ColumnController {
    constructor(private readonly columnService: ColumnService) {}
    
    @Post('users/:userId/columns')
    async create(
        @Body() data: ColumnDtoRequest, 
        @Param('userId', ParseIntPipe) userId: number
    ): Promise<ColumnDtoResponse> {
        return this.columnService.create(data, userId);
    }

    @Get('users/:userId/columns/:id')
    async getById(
        @Param('id', ParseIntPipe) id: number, 
        @Param('userId', ParseIntPipe) userId: number
    ): Promise<ColumnDtoResponse> {
        return this.columnService.getById(id, userId)
    }

    @Get('users/:userId/columns')
    async getAllByUserId(
        @Param('userId', ParseIntPipe) userId: number
    ): Promise<ColumnDtoResponse[]> {
        return this.columnService.getByUserId(userId)
    }

    @Put('users/:userId/columns/:id')
    async update(
        @Param('id', ParseIntPipe) id: number, 
        @Param('userId', ParseIntPipe) userId: number, 
        @Body() newData: ColumnDtoRequest
    ) {
        return this.columnService.update(id, userId, newData)
    }

    @Delete('users/:userId/columns/:id')
    async delete(
        @Param('id', ParseIntPipe) id: number, 
        @Param('userId', ParseIntPipe) userId: number
    ) {
        return this.columnService.delete(id, userId)
    }
}
