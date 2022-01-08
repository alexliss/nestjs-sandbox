import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from 'src/card/card.entity';
import { ColumnEntity } from 'src/column/column.entity';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { CommentDtoRequest } from './dto/comment.dto.request';
import { CommentDtoResponse } from './dto/comment.dto.response';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity) 
        private readonly commentRepository: Repository<CommentEntity>,
        @InjectRepository(CardEntity)
        private readonly cardRepository: Repository<CardEntity>,
        @InjectRepository(ColumnEntity)
        private readonly columnRepository: Repository<ColumnEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    private async cardExistenceCheck(cardId: number) {
        const card = await this.cardRepository.findOne(cardId);
        if (!card) 
            throw new HttpException({ Card: ' not found'}, 404);
    }

    async create(cardId: number,data: CommentDtoRequest): Promise<CommentDtoResponse> {
        await this.cardExistenceCheck(cardId);
        const user = await this.userRepository.findOne({
            where: {
                id: data.userId
            },
            relations: ['comments']
        });
        if (!user) 
            throw new HttpException({CommentUser: ' not found'}, 404)

        const card = await this.cardRepository.findOne({
            where: {
                id: cardId
            },
            relations: ['comments']
        });
        let comment = new CommentEntity(data);
        user.comments.push(comment);
        card.comments.push(comment);
        comment = await this.commentRepository.save(comment);
        this.userRepository.save(user);
        this.cardRepository.save(card);
        return new CommentDtoResponse(
            comment.id, 
            data.userId, 
            comment.text, 
            comment.createdAt,
            comment. updatedAt)
    }

    async getById(cardId: number, commentId: number): Promise<CommentDtoResponse> {
        await this.cardExistenceCheck(cardId)
        const comment = await this.commentRepository.findOne({
            where: {
                id: commentId,
                card: {
                    id: cardId
                }
            },
            relations: ['user']
        })
        if (!comment)
            throw new HttpException({ Comment: ' not found'}, 404)

        return new CommentDtoResponse(
            comment.id, 
            comment.user.id, 
            comment.text, 
            comment.createdAt,
            comment.updatedAt)
    }

    async getAllByCardId(cardId: number): Promise<CommentDtoResponse[]> {
        await this.cardExistenceCheck(cardId)
        const comments = await this.commentRepository.find({
            where: {
                card: {
                    id: cardId
                }
            },
            relations: ['user']
        })
        return comments.map(comment =>
            new CommentDtoResponse(
                comment.id,
                comment.user.id,
                comment.text,
                comment.createdAt,
                comment.updatedAt))
    }
    
    async update(cardId: number, commentId: number, data: CommentDtoRequest): Promise<CommentDtoResponse> {
        await this.cardExistenceCheck(cardId);
        let comment = await this.commentRepository.findOne({
            where: {
                id: commentId,
                card: {
                    id: cardId
                }
            },
            relations: ['user']
        })
        if (!comment) 
            throw new HttpException({ Card: ' not found'}, 404)

        comment.text = data.text;
        comment = await this.commentRepository.save(comment);

        return new CommentDtoResponse(
            comment.id,
            comment.user.id,
            comment.text,
            comment.createdAt,
            comment.updatedAt
        )
    }

    async delete(cardId: number, commentId: number) {
        await this.cardExistenceCheck(cardId);
        let comment = await this.commentRepository.findOne({
            where: {
                id: commentId,
                card: {
                    id: cardId
                }
            }
        })
        if (!comment) 
            throw new HttpException({ Card: ' not found'}, 404)

        return await this.commentRepository.delete(commentId)
    }
}
