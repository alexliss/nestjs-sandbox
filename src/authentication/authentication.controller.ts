import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDtoResponse } from './dto/login.dto.response';
import { RegisterDtoRequest } from './dto/register.dto.request';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local.auth.guard';
import { User } from './user.decorator';
import { UserCredentials } from './user.credentials';
import { LoginDtoRequest } from './dto/login.dto.request';

@ApiTags('auth')
@Controller()
export class AuthenticationController {
    constructor(private readonly authService: AuthenticationService) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(200)
    @ApiOkResponse( { type: LoginDtoResponse } )
    @ApiOperation({ summary: 'Log in by email & password' })
    async login(@User() userCreds: UserCredentials, @Body() data: LoginDtoRequest): Promise<LoginDtoResponse> {
        return this.authService.login(userCreds)
    }

    @Post('register')
    @ApiCreatedResponse( { type: LoginDtoResponse } )
    @ApiOperation({ summary: 'Register new user' })
    async register(@Body() data: RegisterDtoRequest): Promise<LoginDtoResponse> {
        return this.authService.register(data);
    }

}
