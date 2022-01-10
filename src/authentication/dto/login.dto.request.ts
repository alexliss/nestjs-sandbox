import { IsNotEmpty } from "class-validator";

export class LoginDtoRequest {
    @IsNotEmpty()
    readonly email: string;
    @IsNotEmpty()
    readonly password: string;
}
