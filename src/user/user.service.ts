import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentials } from 'src/authentication/user.credentials';
import { Not, Repository } from 'typeorm';
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

      async findById(id: number): Promise<UserDtoResponse> {
        const user = await this.userRepository.findOne(id);

        if (!user) 
          throw new HttpException({ User: 'not found' }, HttpStatus.NOT_FOUND);

        return new UserDtoResponse(user);
      }

      async findByCreds(userData: UserCredentials): Promise<UserDtoResponse> {
        return this.findById(userData.userId)
      }

      async update(userData: UserCredentials, newData: UserDtoRequest): Promise<UserDtoResponse> {
        let user = await this.userRepository.findOne(userData.userId);

        if (!user) 
            throw new HttpException({ User: 'not found' }, HttpStatus.NOT_FOUND);

        if (await this.userRepository.findOne({ 
          where: [
            { email : newData.email, id: Not(userData.userId) },
            { name : newData.name, id: Not(userData.userId) }]
          } )) {
            throw new HttpException({ User: 'invalid data' }, HttpStatus.BAD_REQUEST);
          }
        user.name = newData.name;
        user.password = newData.password;
        user.email = newData.email;
        user = await this.userRepository.save(user)
        return new UserDtoResponse(user)
      }

      async delete(userData: UserCredentials) {
        const user = await this.userRepository.findOne(userData.userId);
        if (!user) 
            throw new HttpException({ User: 'not found' }, HttpStatus.NOT_FOUND);

        await this.userRepository.delete(user.id);
      }

}
