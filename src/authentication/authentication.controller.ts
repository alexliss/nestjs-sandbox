import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDtoRequest } from './dto/login.dto.request';
import { LoginDtoResponse } from './dto/login.dto.response';
import { RegisterDtoRequest } from './dto/register.dto.request';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller()
export class AuthenticationController {
    constructor(private readonly authService: AuthenticationService) {}

    @Post('login')
    @HttpCode(200)
    @ApiOkResponse( { type: LoginDtoResponse } )
    @ApiOperation({ summary: 'Log in by email & password' })
    async login(@Body() data: LoginDtoRequest): Promise<LoginDtoResponse> {
        return this.authService.login(data)
    }

    @Post('register')
    @ApiCreatedResponse( { type: LoginDtoResponse } )
    @ApiOperation({ summary: 'Register new user' })
    async register(@Body() data: RegisterDtoRequest): Promise<LoginDtoResponse> {
        return this.authService.register(data);
    }

}
