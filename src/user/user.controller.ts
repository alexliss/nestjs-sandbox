import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
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

    @Get(':id')
    async getById(@Param('id') id: number): Promise<UserDtoResponse> {
        return this.userService.findById(id)
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() newData: UserDtoRequest) {
        return this.userService.updateById(id, newData)
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.userService.delete(id)
    }

}
