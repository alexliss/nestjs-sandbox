import { IsNotEmpty, IsNumber } from "class-validator";

export class CardDtoRequest {
    @IsNumber()
    userId: number; // author, NOT column's owner. Column's owner's id in params!
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    description: string;
}
