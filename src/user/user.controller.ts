import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { UserDtoRegisterRequest } from './dto/register/user.dto.register.request';
import { UserDtoRegisterResponse } from './dto/register/user.dto.register.response';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    //RU

    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() userData: UserDtoRegisterRequest): Promise<UserDtoRegisterResponse> {
        return this.userService.createNewUser(userData);
    }

    @Get()

    @Delete()
    async delete(@Body() userId: number) {
        return this.userService.delete(userId)
    }

}
