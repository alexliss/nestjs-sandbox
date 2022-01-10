import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { AuthenticationService } from './authentication.service';
import { LoginDtoRequest } from './dto/login.dto.request';
import { LoginDtoResponse } from './dto/login.dto.response';
import { RegisterDtoRequest } from './dto/register.dto.request';
import { JwtAuthGuard } from './jwt.auth.guard';
import { UserCredentials } from './user.credentials';
import { User } from './user.decorator';
import { UserRequest } from './user.request.interface';

@Controller()
export class AuthenticationController {
    constructor(private readonly authService: AuthenticationService) {}

    @Post('login')
    @HttpCode(200)
    async login(@Body() data: LoginDtoRequest): Promise<LoginDtoResponse> {
        return this.authService.login(data)
    }

    @Post('register')
    async register(@Body() data: RegisterDtoRequest): Promise<LoginDtoResponse> {
        return this.authService.register(data);
    }

    @UseGuards(JwtAuthGuard)
    @Get('whoami')
    async whoAmI(@User() user: UserCredentials) {
        return user;
    }
}
