import { IsNotEmpty, IsNumber } from "class-validator";

export class CommentDtoRequest {
    @IsNumber()
    readonly userId: number;
    @IsNotEmpty()
    readonly text: string;

    constructor(userId: number, text: string) {
        this.text = text;
    }
}
