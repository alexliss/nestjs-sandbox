import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDtoRequest } from './dto/comment.dto.request';
import { CommentDtoResponse } from './dto/comment.dto.response';

@Controller()
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post('columns/:columnId/cards/:cardId')
    async create(
        @Param('columnId', ParseIntPipe) columnId: number,
        @Param('cardId', ParseIntPipe) cardId: number,
        @Body() data: CommentDtoRequest): Promise<CommentDtoResponse> {
            return this.commentService.create(columnId, cardId, data)
        }

    @Get('columns/:columnId/cards/:cardId/comments')
    async getAllByCardId(
        @Param('columnId', ParseIntPipe) columnId: number,
        @Param('cardId', ParseIntPipe) cardId: number
    ): Promise<CommentDtoResponse[]> {
        return this.commentService.getAllByCardId(columnId, cardId)
    }

    @Get('columns/:columnId/cards/:cardId/comments/:commentId')
    async getById(
        @Param('columnId', ParseIntPipe) columnId: number,
        @Param('cardId', ParseIntPipe) cardId: number,
        @Param('commentId', ParseIntPipe) commentId: number
    ): Promise<CommentDtoResponse> {
        return this.commentService.getById(columnId, cardId, commentId)
    }

    @Put('columns/:columnId/cards/:cardId/comments/:commentId')
    async update(
        @Param('columnId', ParseIntPipe) columnId: number,
        @Param('cardId', ParseIntPipe) cardId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
        @Body() data: CommentDtoRequest
    ): Promise<CommentDtoResponse> {
        return this.commentService.update(columnId, cardId, commentId, data)
    }

    @Delete('columns/:columnId/cards/:cardId/comments/:commentId')
    async delete(
        @Param('columnId', ParseIntPipe) columnId: number,
        @Param('cardId', ParseIntPipe) cardId: number,
        @Param('commentId', ParseIntPipe) commentId: number
    ) {
        return this.commentService.delete(columnId, cardId, commentId)
    }

}
