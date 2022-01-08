import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ColumnEntity } from 'src/column/column.entity';
import { ColumnDtoResponse } from 'src/column/dto/column.dto.response';
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

    private async columnExistenceCheck(columnOwnerId: number, columnId: number) {
        const user = await this.userRepository.findOne(columnOwnerId);
        if (!user) {
            throw new HttpException({ User: ' not found'}, 404)
        }
        const column = await this.columnRepository.findOne({ 
            where: { 
                id: columnId,
                user: {
                    id: columnOwnerId
                }
            } 
        });
        if (!column) 
            throw new HttpException({ Column: ' not found' }, 404);
    }

    async create(columnOwnerId: number, columnId: number, data: CardDtoRequest): Promise<CardDtoResponse> {
        await this.columnExistenceCheck(columnOwnerId, columnId)

        const user = await this.userRepository.findOne({
            where: {
                id: data.userId
            },
            relations: ['cards']
        })
        if (!user) {
            throw new HttpException({ CardUser: ' not found'}, 404)
        }

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

    async getById(columnOwnerId: number, columnId: number, cardId: number): Promise<CardDtoResponse> {
        await this.columnExistenceCheck(columnOwnerId, columnId);
        const card = await this.cardRepository.findOne({
            where: {
                id: cardId,
                column: {
                    id: columnId
                }
            },
            relations: ['column', 'user']
        })
        if (!card) {
            throw new HttpException({ Card: ' not found'}, 404)
        }

        return new CardDtoResponse(card, card.user.id, card.column.id )
    }

    async getAllByColumnId(columnOwnerId: number, columnId: number): Promise<CardDtoResponse[]> {
        await this.columnExistenceCheck(columnOwnerId, columnId)
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

    async update(columnOwnerId: number, columnId: number, cardId: number, data: CardDtoRequest)
        : Promise<CardDtoResponse> {
        await this.columnExistenceCheck(columnOwnerId, columnId);
        const card = await this.cardRepository.findOne({
            where: {
                id: cardId,
                column: {
                    id: columnId
                }
            },
            relations: ['user']
        })
        if (!card) {
            throw new HttpException({ Card: ' not found'}, 404)
        }

        card.title = data.title;
        card.description = data.description;
        this.cardRepository.save(card);

        return new CardDtoResponse(card, card.user.id, columnId);
    }

    async delete(columnOwnerId: number, columnId: number, cardId: number) {
        await this.columnExistenceCheck(columnOwnerId, columnId);
        const card = await this.cardRepository.findOne({
            where: {
                id: cardId,
                column: {
                    id: columnId
                }
            },
            relations: ['user']
        })
        if (!card) {
            throw new HttpException({ Card: ' not found'}, 404)
        }

        return await this.cardRepository.delete(cardId)
    }
}
