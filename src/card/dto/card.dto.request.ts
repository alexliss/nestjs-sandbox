import { IsNotEmpty, IsNumber } from "class-validator";

export class CardDtoRequest {
    @IsNumber()
    columnId: number;
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    description: string;
}
