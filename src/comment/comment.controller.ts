import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwt.auth.guard';
import { UserCredentials } from 'src/authentication/user.credentials';
import { User } from 'src/authentication/user.decorator';
import { CommentService } from './comment.service';
import { CommentDtoRequest } from './dto/comment.dto.request';
import { CommentDtoResponse } from './dto/comment.dto.response';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardDtoResponse } from 'src/card/dto/card.dto.response';
import { CommentOwnerGuard } from './comment-owner.guard';

@ApiTags('comments')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('user-token')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post('cards/:cardId/comments')
    @ApiCreatedResponse( { type: CardDtoResponse } )
    @ApiOperation({ summary: 'Create new comment in card' })
    async create(
        @User() userCreds: UserCredentials,
        @Param('cardId', ParseIntPipe) cardId: number,
        @Body() data: CommentDtoRequest
    ): Promise<CommentDtoResponse> {
            return this.commentService.create(userCreds, cardId, data)
    }

    @Get('cards/:cardId/comments')
    @ApiOkResponse( { type: [CommentDtoResponse] } )
    @ApiOperation({ summary: "Get all card's comments" })
    async getAllByCardId(
        @Param('cardId', ParseIntPipe) cardId: number
    ): Promise<CommentDtoResponse[]> {
        return this.commentService.getAllByCardId(cardId)
    }

    @Get('comments/:commentId')
    @ApiOkResponse( { type: CommentDtoResponse } )
    @ApiOperation({ summary: 'Get comment by id' })
    async getById(
        @Param('commentId', ParseIntPipe) commentId: number
    ): Promise<CommentDtoResponse> {
        return this.commentService.getById(commentId)
    }

    @UseGuards(CommentOwnerGuard)
    @Put('comments/:commentId')
    @ApiOkResponse( { type: CommentDtoResponse } )
    @ApiOperation({ summary: 'Edit your comment' })
    async update(
        @Param('commentId', ParseIntPipe) commentId: number,
        @Body() data: CommentDtoRequest
    ): Promise<CommentDtoResponse> {
        return this.commentService.update(commentId, data)
    }

    @UseGuards(CommentOwnerGuard)
    @Delete('comments/:commentId')
    @ApiOperation({ summary: 'Delete your comment' })
    async delete(
        @Param('commentId', ParseIntPipe) commentId: number
    ) {
        return this.commentService.delete(commentId)
    }

}
