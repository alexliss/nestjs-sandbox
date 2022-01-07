import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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


    async create(data: ColumnDtoRequest, userId: number): Promise<ColumnDtoResponse> {
        let newColumn = new ColumnEntity();
        newColumn.name = data.name;
        let user = await this.userRepository.findOne({
            where: { 
                id: userId
            },
            relations: ['columns'] 
        });

        if (!user) 
            throw new HttpException({ User: ' not found' }, 404);

        user.columns.push(newColumn);
        newColumn = await this.columnRepository.save(newColumn);
        user = await this.userRepository.save(user);
        return new ColumnDtoResponse(newColumn.id, newColumn.name, user.id, newColumn.createdAt)
    }

    async getByUserId(userId: number): Promise<ColumnDtoResponse[]> {
        const user = await this.userRepository.findOne({ 
            where: { 
                id: userId 
            }, 
            relations: ['columns'] 
        });

        if (!user) 
            throw new HttpException({ User: ' not found' }, 404);

        return user.columns.map(element => 
            new ColumnDtoResponse(element.id, element.name, user.id, element.createdAt)
        )
    }

    async getById(id: number, userId: number): Promise<ColumnDtoResponse> {
        const user = await this.userRepository.findOne(userId);
        if (!user) 
            throw new HttpException({ User: ' not found' }, 404);

        const column = await this.columnRepository.findOne({ 
            where: { 
                id: id,
                user: {
                    id: userId
                }
            }, 
            relations: ['user'] 
        });
        console.log(column);

        if (!column) 
            throw new HttpException({ User: ' invalid' }, 404)
        
        return new ColumnDtoResponse(column.id, column.name, user.id, column.createdAt)
    }

    async update(id: number, userId: number, newData: ColumnDtoRequest) {
        const user = await this.userRepository.findOne(userId);
        if (!user) 
            throw new HttpException({ User: ' not found' }, 404);
        
        const column = await this.columnRepository.findOne({ 
            where: { 
                id: id,
                user: {
                    id: userId
                }
            } 
        });
        if (!column) 
            throw new HttpException({ Column: ' not found' }, 404);

        column.name = newData.name;
        return await this.columnRepository.save(column)
    }

    async delete(id: number, userId: number) {
        const user = await this.userRepository.findOne(userId);
        if (!user) 
            throw new HttpException({ User: ' not found' }, 404);
        
        const column = await this.columnRepository.findOne({ 
            where: { 
                id: id,
                user: {
                    id: userId
                }
            } 
        });
        if (!column) 
            throw new HttpException({ Column: ' not found' }, 404);
            
        return await this.columnRepository.delete(id)
    }
}
