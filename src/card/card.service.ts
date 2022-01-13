import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

    private async columnExistenceCheck(columnId: number) {
        const column = await this.columnRepository.findOne(columnId);
        if (!column) 
            throw new HttpException({ Column: ' not found' }, HttpStatus.NOT_FOUND);
    }

    async create(userCreds: UserCredentials, columnId: number, data: CardDtoRequest): Promise<CardDtoResponse> {
        await this.columnExistenceCheck(columnId)

        const user = await this.userRepository.findOne({
            where: {
                id: userCreds.userId
            },
            relations: ['cards']
        })
        if (!user)
            throw new HttpException({ CardUser: ' not found'}, HttpStatus.NOT_FOUND)

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

    async getById(cardId: number): Promise<CardDtoResponse> {
        const card = await this.cardRepository.findOne({
            where: {
                id: cardId
            },
            relations: ['user', 'column']
        })
        if (!card)
            throw new HttpException({ Card: ' not found'}, HttpStatus.NOT_FOUND)

        return new CardDtoResponse(card, card.user.id, card.column.id )
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

    async update(userCreds: UserCredentials, cardId: number, data: CardUpdateDtoRequest): Promise<CardDtoResponse> {
        const card = await this.cardRepository.findOne({
            where: {
                id: cardId
            },
            relations: ['user', 'column']
        })
        if (!card)
            throw new HttpException({ Card: ' not found'}, HttpStatus.NOT_FOUND)

        if (card.user.id != userCreds.userId)
            throw new HttpException('no permission', HttpStatus.UNAUTHORIZED)
        
        if (card.column.id != data.columnId) {
            await this.columnExistenceCheck(data.columnId)
            const newColumn = await this.columnRepository.findOne(data.columnId) 
            card.column = newColumn;
        }
        card.title = data.title;
        card.description = data.description;
        this.cardRepository.save(card);

        return new CardDtoResponse(card, card.user.id, card.column.id);
    }

    async delete(userCreds: UserCredentials, cardId: number) {
        const card = await this.cardRepository.findOne({
            where: {
                id: cardId
            }, relations: ['user']
        })
        if (!card)
            throw new HttpException({ Card: ' not found'}, HttpStatus.NOT_FOUND)

        if (card.user.id != userCreds.userId)
            throw new HttpException('no permission', HttpStatus.UNAUTHORIZED)

        return await this.cardRepository.delete(cardId)
    }
}
