import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwt.auth.guard';
import { UserCredentials } from 'src/authentication/user.credentials';
import { User } from 'src/authentication/user.decorator';
import { CardService } from './card.service';
import { CardDtoRequest } from './dto/card.dto.request';
import { CardDtoResponse } from './dto/card.dto.response';

@Controller()
export class CardController {
    constructor(private readonly cardService: CardService) {}

    @UseGuards(JwtAuthGuard)
    @Post('columns/:columnId/cards')
    async create(
        @User() userCreds: UserCredentials,
        @Param('columnId', ParseIntPipe) columnId: number,
        @Body() data: CardDtoRequest
    ): Promise<CardDtoResponse> {
        return this.cardService.create(userCreds, columnId, data)
    } 

    @UseGuards(JwtAuthGuard)
    @Get('columns/:columnId/cards')
    async getAllByColumnId(
        @Param('columnId', ParseIntPipe) columnId: number
    ): Promise<CardDtoResponse[]> {
        return this.cardService.getAllByColumnId(columnId)
    }

    @UseGuards(JwtAuthGuard)
    @Get('columns/:columnId/cards/:cardId')
    async getById(
        @Param('columnId', ParseIntPipe) columnId: number,
        @Param('cardId', ParseIntPipe) cardId
    ): Promise<CardDtoResponse> {
        return this.cardService.getById(columnId, cardId)
    }

    @UseGuards(JwtAuthGuard)
    @Put('columns/:columnId/cards/:cardId')
    async update(
        @Param('columnId', ParseIntPipe) columnId: number,
        @Param('cardId', ParseIntPipe) cardId,
        @Body() data: CardDtoRequest
    ) {
        return this.cardService.update(columnId, cardId, data)
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete('columns/:columnId/cards/:cardId')
    async delete(
        @Param('columnId', ParseIntPipe) columnId: number,
        @Param('cardId', ParseIntPipe) cardId
    ) {
        return this.cardService.delete(columnId, cardId)
    }
}
