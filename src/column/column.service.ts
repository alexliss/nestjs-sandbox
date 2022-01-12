import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentials } from 'src/authentication/user.credentials';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { ColumnEntity } from './column.entity';
import { ColumnDtoRequest } from './dto/column.dto.request';
import { ColumnDtoResponse } from './dto/column.dto.response';

@Injectable()
export class ColumnService {
    constructor(
        @InjectRepository(ColumnEntity)
        private readonly columnRepository: Repository<ColumnEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async create(userCreds: UserCredentials, data: ColumnDtoRequest): Promise<ColumnDtoResponse> {
        let column = new ColumnEntity();
        column.name = data.name;
        let user = await this.userRepository.findOne({
            where: { 
                id: userCreds.userId
            },
            relations: ['columns'] 
        });

        if (!user) 
            throw new HttpException({ User: ' not found' }, HttpStatus.NOT_FOUND);

        user.columns.push(column);
        column = await this.columnRepository.save(column);
        user = await this.userRepository.save(user);
        return new ColumnDtoResponse(column, user.id)
    }

    async getByUserId(userId: number): Promise<ColumnDtoResponse[]> {
        const user = await this.userRepository.findOne({ 
            where: { 
                id: userId 
            }, 
            relations: ['columns'] 
        });

        if (!user) 
            throw new HttpException({ User: ' not found' }, HttpStatus.NOT_FOUND);

        return user.columns.map(column => 
            new ColumnDtoResponse(column, user.id)
        )
    }

    async getById(id: number): Promise<ColumnDtoResponse> {
        const column = await this.columnRepository.findOne({ 
            where: { 
                id: id
            }, 
            relations: ['user'] 
        });

        if (!column) 
            throw new HttpException({ Column: ' invalid' }, HttpStatus.NOT_FOUND)
        
        return new ColumnDtoResponse(column, column.user.id)
    }

    async update(id: number, userCreds: UserCredentials, newData: ColumnDtoRequest) {
        const user = await this.userRepository.findOne(userCreds.userId);
        if (!user) 
            throw new HttpException({ User: ' not found' }, HttpStatus.NOT_FOUND);
        
        let column = await this.columnRepository.findOne({ 
            where: { 
                id: id,
                user: {
                    id: userCreds.userId
                }
            }, relations: ['user']
        });
        if (!column) 
            throw new HttpException({ Column: ' not found' }, HttpStatus.NOT_FOUND);

        if (column.user.id != userCreds.userId)
            throw new HttpException('no permission', HttpStatus.UNAUTHORIZED)

        column.name = newData.name;
        column = await this.columnRepository.save(column)

        return new ColumnDtoResponse(column, column.user.id)
    }

    async delete(id: number, userCreds: UserCredentials) {
        const user = await this.userRepository.findOne(userCreds.userId);
        if (!user) 
            throw new HttpException({ User: ' not found' }, HttpStatus.NOT_FOUND);
        
        const column = await this.columnRepository.findOne({ 
            where: { 
                id: id,
                user: {
                    id: userCreds.userId
                }
            }, relations: ['user']
        });
        if (!column) 
            throw new HttpException({ Column: ' not found' }, HttpStatus.NOT_FOUND);
        
        if (column.user.id != userCreds.userId)
            throw new HttpException('no permission', HttpStatus.UNAUTHORIZED)

        await this.columnRepository.delete(id)
    }
}
