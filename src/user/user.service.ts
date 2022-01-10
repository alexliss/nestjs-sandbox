import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentials } from 'src/authentication/user.credentials';
import { DeleteResult, Not, Repository } from 'typeorm';
import { resourceLimits } from 'worker_threads';
import { UserDtoRegisterRequest } from './dto/register/user.dto.register.request';
import { UserDtoRegisterResponse } from './dto/register/user.dto.register.response';
import { UserDtoRequest } from './dto/user.dto.request';
import { UserDtoResponse } from './dto/user.dto.response';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
      ) {}

      async getAll(): Promise<UserDtoResponse[]> {
        const users = await this.userRepository.find();
        return users.map(user => new UserDtoResponse(user));
      }

      async createNewUser(data: UserDtoRegisterRequest): Promise<UserDtoRegisterResponse> {
        const maybeUser = await this.userRepository.findOne({
          where: [
            { email : data.email },
            { name : data.name }]
        });
        if (maybeUser) 
            throw new HttpException({ User: ' invalid data' }, 404);

        let newUser = new UserEntity(data.name, data.email, data.password);
        newUser = await this.userRepository.save(newUser);
        return new UserDtoRegisterResponse(newUser.id)
      }

      async findById(id: number): Promise<UserDtoResponse> {
        const user = await this.userRepository.findOne(id);

        if (!user) 
          throw new HttpException({ User: ' not found' }, 404);

        return new UserDtoResponse(user);
      }

      async update(userData: UserCredentials, newData: UserDtoRequest) {
        const user = await this.userRepository.findOne(userData.userId);

        if (!user) 
            throw new HttpException({ User: ' not found' }, 404);

        if (await this.userRepository.findOne({ 
          where: [
            { email : newData.email, id: Not(userData.userId) },
            { name : newData.name, id: Not(userData.userId) }]
          } )) {
            throw new HttpException({ User: ' invalid data' }, 404);
          }
        user.name = newData.name;
        user.password = newData.password;
        user.email = newData.email;
        return await this.userRepository.save(user)
      }

      async delete(userData: UserCredentials): Promise<DeleteResult> {
        const user = await this.userRepository.findOne(userData.userId);
        if (!user) 
            throw new HttpException({ User: ' not found' }, 404);

        return await this.userRepository.delete(user);
      }

}
