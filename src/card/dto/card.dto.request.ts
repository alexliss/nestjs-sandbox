import { IsNotEmpty, IsNumber } from "class-validator";

export class CardDtoRequest {
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    description: string;
}
