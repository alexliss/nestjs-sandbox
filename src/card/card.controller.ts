import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CardService } from './card.service';
import { CardDtoRequest } from './dto/card.dto.request';
import { CardDtoResponse } from './dto/card.dto.response';

@Controller()
export class CardController {
    constructor(private readonly cardService: CardService) {}

    @Post('users/:userId/columns/:columnId/cards')
    async create(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('columnId', ParseIntPipe) columnId: number,
        @Body() data: CardDtoRequest): Promise<CardDtoResponse> {
            return this.cardService.create(userId, columnId, data)
        } 

    @Get('users/:userId/columns/:columnId/cards')
    async getAllByColumnId(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('columnId', ParseIntPipe) columnId: number): Promise<CardDtoResponse[]> {
            return this.cardService.getAllByColumnId(userId, columnId)
        }

    @Get('users/:userId/columns/:columnId/cards/:cardId')
    async getById(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('columnId', ParseIntPipe) columnId: number,
        @Param('cardId', ParseIntPipe) cardId): Promise<CardDtoResponse> {
            return this.cardService.getById(userId, columnId, cardId)
        }

    @Put('users/:userId/columns/:columnId/cards/:cardId')
    async update(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('columnId', ParseIntPipe) columnId: number,
        @Param('cardId', ParseIntPipe) cardId,
        @Body() data: CardDtoRequest) {
            return this.cardService.update(userId, columnId, cardId, data)
        }
    
    @Delete('users/:userId/columns/:columnId/cards/:cardId')
    async delete(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('columnId', ParseIntPipe) columnId: number,
        @Param('cardId', ParseIntPipe) cardId) {
            return this.cardService.delete(userId, columnId, cardId)
        }
}
