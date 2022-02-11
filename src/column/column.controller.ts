import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwt.auth.guard';
import { UserCredentials } from 'src/authentication/user.credentials';
import { User } from 'src/authentication/user.decorator';
import { ColumnService } from './column.service';
import { ColumnDtoRequest } from './dto/column.dto.request';
import { ColumnDtoResponse } from './dto/column.dto.response';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ColumnOwnerGuard } from './column-owner.guard';

@ApiTags('columns')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('user-token')
export class ColumnController {
    constructor(private readonly columnService: ColumnService) {}

    @Post('columns')
    @ApiCreatedResponse( { type: ColumnDtoResponse } )
    @ApiOperation({ summary: 'Create new column' })
    async create(
        @User() userCreds: UserCredentials,
        @Body() data: ColumnDtoRequest
    ): Promise<ColumnDtoResponse> {
        return this.columnService.create(userCreds, data);
    }

    @Get('columns/:id')
    @ApiOkResponse( { type: ColumnDtoResponse } )
    @ApiOperation({ summary: 'Get column by id' })
    async getById(
        @Param('id', ParseIntPipe) id: number, 
    ): Promise<ColumnDtoResponse> {
        return this.columnService.getById(id)
    }

    @Get('users/:userId/columns')
    @ApiOkResponse( { type: [ColumnDtoResponse] } )
    @ApiOperation({ summary: "Get all user's columns" })
    async getAllByUserId(
        @Param('userId', ParseIntPipe) userId: number
    ): Promise<ColumnDtoResponse[]> {
        return this.columnService.getByUserId(userId)
    }

    @Put('columns/:id')
    @UseGuards(ColumnOwnerGuard)
    @ApiOkResponse( { type: ColumnDtoResponse } )
    @ApiOperation({ summary: "Edit column (if you're owner, of course)" })
    async update(
        @User() userData: UserCredentials,
        @Param('id', ParseIntPipe) id: number,  
        @Body() newData: ColumnDtoRequest
    ): Promise<ColumnDtoResponse> {
        return this.columnService.update(id, userData, newData)
    }

    @Delete('columns/:id')
    @UseGuards(ColumnOwnerGuard)
    @ApiOperation({ summary: 'Delete your column' })
    async delete(
        @User() userData: UserCredentials,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.columnService.delete(id, userData)
    }
}
