import { ApiProperty } from "@nestjs/swagger";
import { CardEntity } from "../card.entity";

export class CardDtoResponse {

    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    columnId: number;

    constructor(card: CardEntity, userId: number, columnId: number) {
            this.id = card.id;
            this.title = card.title;
            this.description = card.description;
            this.createdAt = card.createdAt;
            this.updatedAt = card.updatedAt;
            this.userId = userId;
            this.columnId = columnId;
    }
}
