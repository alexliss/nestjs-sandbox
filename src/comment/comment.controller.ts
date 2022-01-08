import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDtoRequest } from './dto/comment.dto.request';
import { CommentDtoResponse } from './dto/comment.dto.response';

@Controller()
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post('cards/:cardId/comments')
    async create(
        @Param('cardId', ParseIntPipe) cardId: number,
        @Body() data: CommentDtoRequest
    ): Promise<CommentDtoResponse> {
            return this.commentService.create(cardId, data)
        }

    @Get('cards/:cardId/comments')
    async getAllByCardId(
        @Param('cardId', ParseIntPipe) cardId: number
    ): Promise<CommentDtoResponse[]> {
        return this.commentService.getAllByCardId(cardId)
    }

    @Get('cards/:cardId/comments/:commentId')
    async getById(
        @Param('cardId', ParseIntPipe) cardId: number,
        @Param('commentId', ParseIntPipe) commentId: number
    ): Promise<CommentDtoResponse> {
        return this.commentService.getById(cardId, commentId)
    }

    @Put('cards/:cardId/comments/:commentId')
    async update(
        @Param('cardId', ParseIntPipe) cardId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
        @Body() data: CommentDtoRequest
    ): Promise<CommentDtoResponse> {
        return this.commentService.update(cardId, commentId, data)
    }

    @Delete('cards/:cardId/comments/:commentId')
    async delete(
        @Param('cardId', ParseIntPipe) cardId: number,
        @Param('commentId', ParseIntPipe) commentId: number
    ) {
        return this.commentService.delete(cardId, commentId)
    }

}
