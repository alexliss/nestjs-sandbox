import { ApiProperty } from "@nestjs/swagger";

export class LoginDtoResponse {

    @ApiProperty()
    readonly token: string

    constructor(token: string) {
        this.token = token;
    }
}
