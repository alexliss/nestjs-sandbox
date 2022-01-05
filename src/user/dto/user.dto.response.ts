import { UserEntity } from "../user.entity";

export class UserDtoResponse {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly password: string;

    constructor(user: UserEntity) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.password = user.password;
    }
}
