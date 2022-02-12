import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentials } from 'src/authentication/user.credentials';
import { ColumnEntity } from 'src/column/column.entity';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CardEntity } from './card.entity';
import { CardDtoRequest } from './dto/card.dto.request';
import { CardDtoResponse } from './dto/card.dto.response';
import { CardUpdateDtoRequest } from './dto/card.update.dto.request';

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(CardEntity)
        private readonly cardRepository: Repository<CardEntity>,
        @InjectRepository(ColumnEntity)
        private readonly columnRepository: Repository<ColumnEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
      ) {}

    async create(userCreds: UserCredentials, columnId: number, data: CardDtoRequest): Promise<CardDtoResponse> {
        const user = await this.userRepository.findOneOrFail({
            where: {
                id: userCreds.userId
            },
            relations: ['cards']
        })

        const column = await this.columnRepository.findOneOrFail({
            where: {
                id: columnId
            },
            relations: ['cards']
        })

        let card = new CardEntity(data.title, data.description);
        user.cards.push(card);
        column.cards.push(card);

        card = await this.cardRepository.save(card);
        this.userRepository.save(user);
        this.columnRepository.save(column);
        card.userId = user.id;
        card.columnId = column.id;

        return new CardDtoResponse(card);
    }

    async getById(id: number): Promise<CardDtoResponse> {
        const card = await this.cardRepository.findOneOrFail({
            where: {
                id: id
            }
        })
        
        return new CardDtoResponse(card)
    }

    async getAllByColumnId(columnId: number): Promise<CardDtoResponse[]> {
        const column = await this.columnRepository.findOneOrFail({
            where: {
                id: columnId
            },
            relations: ['cards']
        })

        return column.cards.map(card =>
            new CardDtoResponse(card))
    }

    async update(id: number, data: CardUpdateDtoRequest): Promise<CardDtoResponse> {
        const card = await this.cardRepository.findOneOrFail({
            where: {
                id: id
            }
        })
        
        if (card.columnId != data.columnId) {
            const newColumn = await this.columnRepository.findOneOrFail(data.columnId) 
            card.column = newColumn;
            card.columnId = data.columnId;
        }
        card.title = data.title;
        card.description = data.description;
        this.cardRepository.save(card);

        return new CardDtoResponse(card);
    }

    async delete(id: number) {
        await this.cardRepository.findOneOrFail({
            where: {
                id: id
            }
        })

        return await this.cardRepository.delete(id)
    }
}
