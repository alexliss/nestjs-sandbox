import { IsNotEmpty, IsNumber } from "class-validator";

export class CommentDtoRequest {
    @IsNotEmpty()
    readonly text: string;

    constructor(text: string) {
        this.text = text;
    }
}
