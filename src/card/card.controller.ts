import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CardService } from './card.service';
import { CardDtoRequest } from './dto/card.dto.request';
import { CardDtoResponse } from './dto/card.dto.response';

@Controller()
export class CardController {
    constructor(private readonly cardService: CardService) {}

    @Post('columns/:columnId/cards')
    async create(
        @Param('columnId', ParseIntPipe) columnId: number,
        @Body() data: CardDtoRequest
    ): Promise<CardDtoResponse> {
        return this.cardService.create(columnId, data)
    } 

    @Get('columns/:columnId/cards')
    async getAllByColumnId(
        @Param('columnId', ParseIntPipe) columnId: number
    ): Promise<CardDtoResponse[]> {
        return this.cardService.getAllByColumnId(columnId)
    }

    @Get('columns/:columnId/cards/:cardId')
    async getById(
        @Param('columnId', ParseIntPipe) columnId: number,
        @Param('cardId', ParseIntPipe) cardId
    ): Promise<CardDtoResponse> {
        return this.cardService.getById(columnId, cardId)
    }

    @Put('columns/:columnId/cards/:cardId')
    async update(
        @Param('columnId', ParseIntPipe) columnId: number,
        @Param('cardId', ParseIntPipe) cardId,
        @Body() data: CardDtoRequest
    ) {
        return this.cardService.update(columnId, cardId, data)
    }
    
    @Delete('columns/:columnId/cards/:cardId')
    async delete(
        @Param('columnId', ParseIntPipe) columnId: number,
        @Param('cardId', ParseIntPipe) cardId
    ) {
        return this.cardService.delete(columnId, cardId)
    }
}
