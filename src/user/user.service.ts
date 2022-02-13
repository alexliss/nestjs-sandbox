import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UserCredentials } from 'src/authentication/user.credentials';
import { UserDtoRequest } from './dto/user.dto.request';
import { UserDtoResponse } from './dto/user.dto.response';
import { UserEntity } from './user.entity';
import * as argon2 from "argon2";
import { RegisterDtoRequest } from 'src/authentication/dto/register.dto.request';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
      ) {}

      async register(data: RegisterDtoRequest): Promise<UserCredentials> {
        if (await this.userRepository.findOne({ 
          where: 
            { name : data.name }
          } )) {
            throw new HttpException({ User: 'username is already used' }, HttpStatus.BAD_REQUEST);
        }

        if (await this.userRepository.findOne({ 
          where:
            { email : data.email }
          } )) {
            throw new HttpException({ User: 'email is already used' }, HttpStatus.BAD_REQUEST);
        }

        let user = new UserEntity(data.name, data.email, await this.hashPassword(data.password));
        user = await this.userRepository.save(user);
        return new UserCredentials(user.id)
      }

      async getAll(): Promise<UserDtoResponse[]> {
        const users = await this.userRepository.find();
        return users.map(user => new UserDtoResponse(user));
      }

      async findById(id: number): Promise<UserDtoResponse> {
        const user = await this.userRepository.findOneOrFail(id);

        return new UserDtoResponse(user);
      }

      async findByCreds(userData: UserCredentials): Promise<UserDtoResponse> {
        return this.findById(userData.userId)
      }

      async update(userData: UserCredentials, newData: UserDtoRequest): Promise<UserDtoResponse> {
        let user = await this.userRepository.findOneOrFail(userData.userId);

        if (await this.userRepository.findOne({ 
          where: 
            { name : newData.name, id: Not(userData.userId) }
          } )) {
            throw new HttpException({ User: 'username is already used' }, HttpStatus.BAD_REQUEST);
        }

        if (await this.userRepository.findOne({ 
          where:
            { email : newData.email, id: Not(userData.userId) }
          } )) {
            throw new HttpException({ User: 'email is already used' }, HttpStatus.BAD_REQUEST);
        }

        user.name = newData.name;
        user.password = await this.hashPassword(newData.password);
        user.email = newData.email;
        user = await this.userRepository.save(user)
        return new UserDtoResponse(user)
      }

      async delete(userData: UserCredentials) {
        const user = await this.userRepository.findOneOrFail(userData.userId);
      
        await this.userRepository.delete(user.id);
      }

      async validateUser(email: string, password: string): Promise<UserCredentials> {
        const user = await this.userRepository.findOneOrFail( {
            where: {
                email: email
            }
        })

        const isSame = await argon2.verify(user.password, password)
        if (!isSame) {
            throw new UnauthorizedException();
        }

        return new UserCredentials(user.id)
    }

      private async hashPassword(password: string): Promise<string> {
        return await argon2.hash(password)
      }
}
