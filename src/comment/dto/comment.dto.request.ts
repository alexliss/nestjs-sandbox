import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CommentDtoRequest {

    @ApiProperty()
    @IsNotEmpty()
    readonly text: string;

    constructor(text: string) {
        this.text = text;
    }
}
