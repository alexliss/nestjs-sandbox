import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwt.auth.guard';
import { UserCredentials } from 'src/authentication/user.credentials';
import { User } from 'src/authentication/user.decorator';
import { UserDtoRegisterRequest } from './dto/register/user.dto.register.request';
import { UserDtoRegisterResponse } from './dto/register/user.dto.register.response';
import { UserDtoRequest } from './dto/user.dto.request';
import { UserDtoResponse } from './dto/user.dto.response';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
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
    @Put()
    async update(@User() user: UserCredentials, @Body() newData: UserDtoRequest) {
        return this.userService.update(user, newData)
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async delete(@User() user: UserCredentials) {
        return this.userService.delete(user)
    }

}
