import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
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
        let users = await this.userRepository.find();
        let result: UserDtoResponse[];
        users.forEach(element => {
          result.push(new UserDtoResponse(element))
        });
        return result;
      }

      async createNewUser(data: UserDtoRegisterRequest): Promise<UserDtoRegisterResponse> {
          let newUser = new UserEntity(data.name, data.email, data.password);
          newUser = await this.userRepository.save(newUser);
          return new UserDtoRegisterResponse(newUser.id)
      }

      async findById(id: number): Promise<UserDtoResponse> {
        const user = await this.userRepository.findOne(id);

        if (!user) {
          const errors = {User: ' not found'};
          throw new HttpException({errors}, 401);
        }
    
        return new UserDtoResponse(user);
      }

      async updateById(id:number, newData: UserDtoRequest) {
        const user = await this.userRepository.findOne(id);

        if(!user) {
          const errors = {User: ' not found'}
          throw new HttpException({errors}, 401)
        }

        user.name = newData.name;
        user.password = newData.password;
        user.email = newData.email;
        return await this.userRepository.save(user)
      }

      async delete(id: number): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
      }

}
