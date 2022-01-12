import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentials } from 'src/authentication/user.credentials';
import { CardEntity } from 'src/card/card.entity';
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
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    private async cardExistenceCheck(cardId: number) {
        const card = await this.cardRepository.findOne(cardId);
        if (!card) 
            throw new HttpException({ Card: ' not found'}, HttpStatus.NOT_FOUND);
    }

    async create(userCreds: UserCredentials, cardId: number, data: CommentDtoRequest): Promise<CommentDtoResponse> {
        await this.cardExistenceCheck(cardId);
        const user = await this.userRepository.findOne({
            where: {
                id: userCreds.userId
            },
            relations: ['comments']
        });
        if (!user) 
            throw new HttpException({CommentUser: ' not found'}, HttpStatus.NOT_FOUND)

        const card = await this.cardRepository.findOne({
            where: {
                id: cardId
            },
            relations: ['comments']
        });

        let comment = new CommentEntity(data.text);
        user.comments.push(comment);
        card.comments.push(comment);
        comment = await this.commentRepository.save(comment);
        this.userRepository.save(user);
        this.cardRepository.save(card);
        return new CommentDtoResponse(comment, comment.user.id, cardId)
    }

    async getById(commentId: number): Promise<CommentDtoResponse> {
        const comment = await this.commentRepository.findOne({
            where: {
                id: commentId,
            },
            relations: ['user', 'card']
        })
        if (!comment)
            throw new HttpException({ Comment: ' not found'}, HttpStatus.NOT_FOUND)

        return new CommentDtoResponse(comment, comment.user.id, comment.card.id)
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
            new CommentDtoResponse(comment, comment.user.id, cardId))
    }
    
    async update(
        userCreds: UserCredentials, 
        commentId: number, 
        data: CommentDtoRequest
    ): Promise<CommentDtoResponse> {
        let comment = await this.commentRepository.findOne({
            where: {
                id: commentId
            }, relations: ['user', 'card']
        })

        if (!comment) 
            throw new HttpException({ Card: ' not found'}, HttpStatus.NOT_FOUND)
            
        if (comment.user.id != userCreds.userId)
            throw new HttpException('no permission', HttpStatus.UNAUTHORIZED)

        comment.text = data.text;        
        comment = await this.commentRepository.save(comment);

        return new CommentDtoResponse(comment, comment.user.id, comment.card.id)
    }

    async delete(userCreds: UserCredentials, commentId: number) {
        let comment = await this.commentRepository.findOne({
            where: {
                id: commentId,
            },
            relations: ['user']
        })
        if (!comment) 
            throw new HttpException({ Card: ' not found'}, HttpStatus.NOT_FOUND)

        if (comment.user.id != userCreds.userId)
            throw new HttpException('no permission', HttpStatus.UNAUTHORIZED)

        await this.commentRepository.delete(commentId)
        
    }
}
