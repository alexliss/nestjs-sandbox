import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwt.auth.guard';
import { UserCredentials } from 'src/authentication/user.credentials';
import { User } from 'src/authentication/user.decorator';
import { CommentService } from './comment.service';
import { CommentDtoRequest } from './dto/comment.dto.request';
import { CommentDtoResponse } from './dto/comment.dto.response';

@Controller()
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @UseGuards(JwtAuthGuard)
    @Post('cards/:cardId/comments')
    async create(
        @User() userCreds: UserCredentials,
        @Param('cardId', ParseIntPipe) cardId: number,
        @Body() data: CommentDtoRequest
    ): Promise<CommentDtoResponse> {
            return this.commentService.create(userCreds, cardId, data)
    }

    @UseGuards(JwtAuthGuard)
    @Get('cards/:cardId/comments')
    async getAllByCardId(
        @Param('cardId', ParseIntPipe) cardId: number
    ): Promise<CommentDtoResponse[]> {
        return this.commentService.getAllByCardId(cardId)
    }

    @UseGuards(JwtAuthGuard)
    @Get('cards/:cardId/comments/:commentId')
    async getById(
        @Param('cardId', ParseIntPipe) cardId: number,
        @Param('commentId', ParseIntPipe) commentId: number
    ): Promise<CommentDtoResponse> {
        return this.commentService.getById(cardId, commentId)
    }

    @UseGuards(JwtAuthGuard)
    @Put('cards/:cardId/comments/:commentId')
    async update(
        @Param('cardId', ParseIntPipe) cardId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
        @Body() data: CommentDtoRequest
    ): Promise<CommentDtoResponse> {
        return this.commentService.update(cardId, commentId, data)
    }

    @UseGuards(JwtAuthGuard)
    @Delete('cards/:cardId/comments/:commentId')
    async delete(
        @Param('cardId', ParseIntPipe) cardId: number,
        @Param('commentId', ParseIntPipe) commentId: number
    ) {
        return this.commentService.delete(cardId, commentId)
    }

}
