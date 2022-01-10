import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { LoginDtoRequest } from './dto/login.dto.request';
import { LoginDtoResponse } from './dto/login.dto.response';
import { RegisterDtoRequest } from './dto/register.dto.request';
import { TokenPayload } from './dto/token.payload';

@Injectable()
export class AuthenticationService {
    constructor(
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService) {}

    async login(data: LoginDtoRequest): Promise<LoginDtoResponse> {
        const user = await this.userRepository.findOne({
            where: {
                email: data.email
            }
        })
        if (!user || (user.password !== data.password))
            throw new HttpException('invalid data', HttpStatus.UNAUTHORIZED)
        const payload = new TokenPayload(user.id);
        const token = this.jwtService.sign( { payload } );
        return new LoginDtoResponse(token)
    }

    async register(data: RegisterDtoRequest): Promise<LoginDtoResponse> {
        const dataRepeat = await this.userRepository.find({
            where: [ 
                { name: data.name },
                { email: data.email }
            ]
        })
        if (dataRepeat) {
            throw new HttpException('invalid data', HttpStatus.BAD_REQUEST)
        }
        let user = new UserEntity(data.name, data.email, data.password);
        user = await this.userRepository.save(user);
        const token = this.jwtService.sign(new TokenPayload(user.id))
        return new LoginDtoResponse(token);
    }
}
