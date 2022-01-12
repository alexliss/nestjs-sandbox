import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwt.auth.guard';
import { UserCredentials } from 'src/authentication/user.credentials';
import { User } from 'src/authentication/user.decorator';
import { UserDtoRequest } from './dto/user.dto.request';
import { UserDtoResponse } from './dto/user.dto.response';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('user-token')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @ApiOkResponse( { type: [UserDtoResponse] } )
    @ApiOperation({ summary: 'Get list of all users' })
    async getAll(): Promise<UserDtoResponse[]> {
        return this.userService.getAll()
    }

    @Get('me')
    @ApiOkResponse( { type: UserDtoResponse } )
    @ApiOperation({ summary: "Get data of token's user" })
    async getMyself(@User() userData: UserCredentials): Promise<UserDtoResponse> {
        return this.userService.findByCreds(userData)
    }

    @Get(':id')
    @ApiOkResponse( { type: UserDtoResponse } )
    @ApiOperation({ summary: 'Get user data by id' })
    async getById(@Param('id', ParseIntPipe) id: number): Promise<UserDtoResponse> {
        return this.userService.findById(id)
    }

    @Put()
    @ApiOkResponse( { type: UserDtoResponse } )
    @ApiOperation({ summary: "Edit data of token's user" })
    async update(@User() user: UserCredentials, @Body() newData: UserDtoRequest): Promise<UserDtoResponse> {
        return this.userService.update(user, newData)
    }

    @Delete()
    @ApiOperation({ summary: "Delete token's user" })
    async delete(@User() user: UserCredentials) {
        return this.userService.delete(user)
    }

}
