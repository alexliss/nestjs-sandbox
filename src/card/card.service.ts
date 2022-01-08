import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ColumnEntity } from 'src/column/column.entity';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CardEntity } from './card.entity';
import { CardDtoRequest } from './dto/card.dto.request';
import { CardDtoResponse } from './dto/card.dto.response';

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

    private async columnExistenceCheck(columnId: number) {
        const column = await this.columnRepository.findOne(columnId);
        if (!column) 
            throw new HttpException({ Column: ' not found' }, 404);
    }

    async create(columnId: number, data: CardDtoRequest): Promise<CardDtoResponse> {
        await this.columnExistenceCheck(columnId)

        const user = await this.userRepository.findOne({
            where: {
                id: data.userId
            },
            relations: ['cards']
        })
        if (!user)
            throw new HttpException({ CardUser: ' not found'}, 404)

        const column = await this.columnRepository.findOne({
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

        return new CardDtoResponse(card, user.id, column.id);
    }

    async getById(columnId: number, cardId: number): Promise<CardDtoResponse> {
        await this.columnExistenceCheck(columnId);
        const card = await this.cardRepository.findOne({
            where: {
                id: cardId,
                column: {
                    id: columnId
                }
            },
            relations: ['user']
        })
        if (!card)
            throw new HttpException({ Card: ' not found'}, 404)

        return new CardDtoResponse(card, card.user.id, columnId )
    }

    async getAllByColumnId(columnId: number): Promise<CardDtoResponse[]> {
        await this.columnExistenceCheck(columnId)
        const cards = await this.cardRepository.find({
            where: {
                column: {
                    id: columnId
                }
            },
            relations: ['user']
        })

        return cards.map(card =>
            new CardDtoResponse(card, card.user.id, columnId))
    }

    async update(columnId: number, cardId: number, data: CardDtoRequest): Promise<CardDtoResponse> {
        await this.columnExistenceCheck(columnId);
        const card = await this.cardRepository.findOne({
            where: {
                id: cardId,
                column: {
                    id: columnId
                }
            },
            relations: ['user']
        })
        if (!card)
            throw new HttpException({ Card: ' not found'}, 404)

        card.title = data.title;
        card.description = data.description;
        this.cardRepository.save(card);

        return new CardDtoResponse(card, card.user.id, columnId);
    }

    async delete(columnId: number, cardId: number) {
        await this.columnExistenceCheck(columnId);
        const card = await this.cardRepository.findOne({
            where: {
                id: cardId,
                column: {
                    id: columnId
                }
            }
        })
        if (!card)
            throw new HttpException({ Card: ' not found'}, 404)

        return await this.cardRepository.delete(cardId)
    }
}
