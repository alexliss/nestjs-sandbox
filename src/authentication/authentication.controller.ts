import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDtoRequest } from './dto/login.dto.request';
import { LoginDtoResponse } from './dto/login.dto.response';
import { RegisterDtoRequest } from './dto/register.dto.request';

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

}
