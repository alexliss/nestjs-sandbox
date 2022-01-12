import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "../user.entity";

export class UserDtoResponse {

    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly email: string;

    constructor(user: UserEntity) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
    }
}
