import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UserDtoRegisterRequest } from './dto/register/user.dto.register.request';
import { UserDtoRegisterResponse } from './dto/register/user.dto.register.response';
import { UserDtoResponse } from './dto/user.dto.response';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
      ) {}

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

      async delete(id: number): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
      }

      //TODO: update
}
