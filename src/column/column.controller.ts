import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwt.auth.guard';
import { UserCredentials } from 'src/authentication/user.credentials';
import { User } from 'src/authentication/user.decorator';
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
    @Put('columns/:id')
    async update(
        @User() userData: UserCredentials,
        @Param('id', ParseIntPipe) id: number,  
        @Body() newData: ColumnDtoRequest
    ) {
        return this.columnService.update(id, userData, newData)
    }

    @UseGuards(JwtAuthGuard)
    @Delete('columns/:id')
    async delete(
        @User() userData: UserCredentials,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.columnService.delete(id, userData)
    }
}
