import { Injectable } from '@nestjs/common';
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


    async create(data: ColumnDtoRequest): Promise<ColumnDtoResponse> {
        let newColumn = new ColumnEntity();
        newColumn.name = data.name;
        let user = await this.userRepository.findOne({ where: { id: data.userId }, relations: ['columns'] });
        user.columns.push(newColumn);
        newColumn = await this.columnRepository.save(newColumn);
        user = await this.userRepository.save(user);
        return new ColumnDtoResponse(newColumn.id, newColumn.name, user.id, newColumn.createdAt)
    }

    async delete(id: number) {
        return await this.columnRepository.delete(id)
    }
}
