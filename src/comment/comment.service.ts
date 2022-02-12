import { Injectable } from '@nestjs/common';
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

    async create(userCreds: UserCredentials, cardId: number, data: CommentDtoRequest): Promise<CommentDtoResponse> {
        const user = await this.userRepository.findOneOrFail({
            where: {
                id: userCreds.userId
            },
            relations: ['comments']
        })

        const card = await this.cardRepository.findOneOrFail({
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
        comment.userId = user.id;
        comment.cardId = cardId;
        return new CommentDtoResponse(comment)
    }

    async getById(id: number): Promise<CommentDtoResponse> {
        const comment = await this.commentRepository.findOneOrFail({
            where: {
                id: id,
            }
        })
        return new CommentDtoResponse(comment)
    }

    async getAllByCardId(cardId: number): Promise<CommentDtoResponse[]> {
        const card = await this.cardRepository.findOneOrFail({
            where: {
                id: cardId
            },
            relations :['comments']
        })
        return card.comments.map(comment =>
            new CommentDtoResponse(comment))
    }
    
    async update(id: number, data: CommentDtoRequest): Promise<CommentDtoResponse> {
        let comment = await this.commentRepository.findOneOrFail({
            where: {
                id: id
            }
        })
        comment.text = data.text;        
        comment = await this.commentRepository.save(comment);

        return new CommentDtoResponse(comment)
    }

    async delete(id: number) {
        await this.commentRepository.findOneOrFail({
            where: {
                id: id
            }
        })
        await this.commentRepository.delete(id)
    }
}
