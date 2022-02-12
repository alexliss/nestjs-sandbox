import { Injectable } from '@nestjs/common';
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
        let user = await this.userRepository.findOneOrFail({
            where: { 
                id: userCreds.userId
            },
            relations: ['columns'] 
        });

        user.columns.push(column);
        column = await this.columnRepository.save(column);
        user = await this.userRepository.save(user);
        return new ColumnDtoResponse(column)
    }

    async getByUserId(userId: number): Promise<ColumnDtoResponse[]> {
        const user = await this.userRepository.findOneOrFail({ 
            where: { 
                id: userId 
            }, 
            relations: ['columns'] 
        });

        return user.columns.map(column => 
            new ColumnDtoResponse(column)
        )
    }

    async getById(id: number): Promise<ColumnDtoResponse> {
        const column = await this.columnRepository.findOneOrFail({ 
            where: { 
                id: id
            }
        });

        return new ColumnDtoResponse(column)
    }

    async update(id: number, newData: ColumnDtoRequest) {
        let column = await this.columnRepository.findOneOrFail({ 
            where: { 
                id: id
            }
        });

        column.name = newData.name;
        column = await this.columnRepository.save(column)

        return new ColumnDtoResponse(column)
    }

    async delete(id: number) {
        await this.columnRepository.findOneOrFail({ 
            where: { 
                id: id
            }
        });

        await this.columnRepository.delete(id)
    }
}
