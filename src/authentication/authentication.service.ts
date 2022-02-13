import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDtoResponse } from './dto/login.dto.response';
import { RegisterDtoRequest } from './dto/register.dto.request';
import { TokenPayload } from './token.payload';
import { UserCredentials } from './user.credentials';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthenticationService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService) {}

    async login(userCreds: UserCredentials): Promise<LoginDtoResponse> {
        const payload = new TokenPayload(userCreds.userId);
        const token = this.jwtService.sign( { payload } );

        return new LoginDtoResponse(token)
    }

    async register(data: RegisterDtoRequest): Promise<LoginDtoResponse> {
        const userCreds = await this.userService.register(data);
        
        const payload = new TokenPayload(userCreds.userId);
        const token = this.jwtService.sign( { payload } )
        
        return new LoginDtoResponse(token);
    }

}
