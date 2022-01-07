import { IsEmail, IsNotEmpty } from "class-validator";

export class UserDtoRegisterRequest {
    @IsNotEmpty()
    readonly name: string;
    @IsEmail()
    readonly email: string;
    @IsNotEmpty()
    readonly password: string
    constructor(name: string, email: string, password: string) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
