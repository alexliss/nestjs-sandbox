import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { LoginDtoRequest } from './dto/login.dto.request';
import { LoginDtoResponse } from './dto/login.dto.response';
import { RegisterDtoRequest } from './dto/register.dto.request';
import { TokenPayload } from './token.payload';
import { UserCredentials } from './user.credentials';

@Injectable()
export class AuthenticationService {

    constructor(
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService) {}

    async login(userCreds: UserCredentials): Promise<LoginDtoResponse> {
        const payload = new TokenPayload(userCreds.userId);
        const token = this.jwtService.sign( { payload } );

        return new LoginDtoResponse(token)
    }

    async register(data: RegisterDtoRequest): Promise<LoginDtoResponse> {
        const dataRepeat = await this.userRepository.findOne({
            where: [ 
                { name: data.name },
                { email: data.email }
            ]
        })

        if (dataRepeat) 
            throw new HttpException('invalid data', HttpStatus.BAD_REQUEST)
        
        let user = new UserEntity(data.name, data.email, data.password);
        user = await this.userRepository.save(user);
        
        const payload = new TokenPayload(user.id);
        const token = this.jwtService.sign( { payload } )
        
        return new LoginDtoResponse(token);
    }

    async validateUser(email: string, password: string): Promise<UserCredentials> {
        const user = await this.userRepository.findOneOrFail( {
            where: {
                email: email
            }
        })

        if (user.password != password) {
            throw new UnauthorizedException();
        }

        return new UserCredentials(user.id)
    }
}
