import { CardEntity } from "../card.entity";

export class CardDtoResponse {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    userId: number;
    columnId: number;

    constructor(card: CardEntity, userId: number, columnId: number) {
            this.id = card.id;
            this.title = card.title;
            this.description = card.description;
            this.createdAt = card.createdAt;
            this.userId = userId;
            this.columnId = columnId;
    }
}
