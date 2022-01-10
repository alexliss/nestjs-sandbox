import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwt.auth.guard';
import { ColumnService } from './column.service';
import { ColumnDtoRequest } from './dto/column.dto.request';
import { ColumnDtoResponse } from './dto/column.dto.response';

@Controller()
export class ColumnController {
    constructor(private readonly columnService: ColumnService) {}
    
    @UseGuards(JwtAuthGuard)
    @Post('users/:userId/columns')
    async create(
        @Body() data: ColumnDtoRequest, 
        @Param('userId', ParseIntPipe) userId: number
    ): Promise<ColumnDtoResponse> {
        return this.columnService.create(data, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('users/:userId/columns/:id')
    async getById(
        @Param('id', ParseIntPipe) id: number, 
        @Param('userId', ParseIntPipe) userId: number
    ): Promise<ColumnDtoResponse> {
        return this.columnService.getById(id, userId)
    }

    @UseGuards(JwtAuthGuard)
    @Get('users/:userId/columns')
    async getAllByUserId(
        @Param('userId', ParseIntPipe) userId: number
    ): Promise<ColumnDtoResponse[]> {
        return this.columnService.getByUserId(userId)
    }

    @UseGuards(JwtAuthGuard)
    @Put('users/:userId/columns/:id')
    async update(
        @Param('id', ParseIntPipe) id: number, 
        @Param('userId', ParseIntPipe) userId: number, 
        @Body() newData: ColumnDtoRequest
    ) {
        return this.columnService.update(id, userId, newData)
    }

    @UseGuards(JwtAuthGuard)
    @Delete('users/:userId/columns/:id')
    async delete(
        @Param('id', ParseIntPipe) id: number, 
        @Param('userId', ParseIntPipe) userId: number
    ) {
        return this.columnService.delete(id, userId)
    }
}
