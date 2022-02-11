import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/jwt.auth.guard';
import { UserCredentials } from 'src/authentication/user.credentials';
import { User } from 'src/authentication/user.decorator';
import { CardService } from './card.service';
import { CardDtoRequest } from './dto/card.dto.request';
import { CardDtoResponse } from './dto/card.dto.response';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardUpdateDtoRequest } from './dto/card.update.dto.request';
import { CardOwnerGuard } from './card-owner.guard';

@ApiTags('cards')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('user-token')
export class CardController {
    constructor(private readonly cardService: CardService) {}

    @Post('columns/:columnId/cards')
    @ApiCreatedResponse( { type: CardDtoResponse } )
    @ApiOperation({ summary: 'Create new card in column' })
    async create(
        @User() userCreds: UserCredentials,
        @Param('columnId', ParseIntPipe) columnId: number,
        @Body() data: CardDtoRequest
    ): Promise<CardDtoResponse> {
        return this.cardService.create(userCreds, columnId, data)
    } 

    @Get('columns/:columnId/cards')
    @ApiOkResponse( { type: [CardDtoResponse] } )
    @ApiOperation({ summary: "Get all column's cards" })
    async getAllByColumnId(
        @Param('columnId', ParseIntPipe) columnId: number
    ): Promise<CardDtoResponse[]> {
        return this.cardService.getAllByColumnId(columnId)
    }

    @Get('cards/:cardId')
    @ApiOkResponse( { type: CardDtoResponse } )
    @ApiOperation({ summary: 'Get card by id' })
    async getById(
        @Param('cardId', ParseIntPipe) cardId: number
    ): Promise<CardDtoResponse> {
        return this.cardService.getById(cardId)
    }

    @UseGuards(CardOwnerGuard)
    @Put('cards/:cardId')
    @ApiOkResponse( { type: CardDtoResponse } )
    @ApiOperation({ summary: 'Edit your card' })
    async update(
        @User() userCreds: UserCredentials,
        @Param('cardId', ParseIntPipe) cardId: number,
        @Body() data: CardUpdateDtoRequest
    ): Promise<CardDtoResponse> {
        return this.cardService.update(userCreds, cardId, data)
    }
    
    @UseGuards(CardOwnerGuard)
    @Delete('cards/:cardId')
    @ApiOperation({ summary: 'Delete your card' })
    async delete(
        @User() userCreds: UserCredentials,
        @Param('cardId', ParseIntPipe) cardId: number
    ) {
        return this.cardService.delete(userCreds, cardId)
    }
}
