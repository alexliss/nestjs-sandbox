import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { JwtAuthGuard } from 'src/authentication/jwt.auth.guard';
import { UserDtoRegisterRequest } from './dto/register/user.dto.register.request';
import { UserDtoRegisterResponse } from './dto/register/user.dto.register.response';
import { UserDtoRequest } from './dto/user.dto.request';
import { UserDtoResponse } from './dto/user.dto.response';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    //RU

    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() userData: UserDtoRegisterRequest): Promise<UserDtoRegisterResponse> {
        return this.userService.createNewUser(userData);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(): Promise<UserDtoResponse[]> {
        return this.userService.getAll()
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number): Promise<UserDtoResponse> {
        return this.userService.findById(id)
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() newData: UserDtoRequest) {
        return this.userService.updateById(id, newData)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id)
    }

}
