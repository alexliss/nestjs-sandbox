export class UserDtoRegisterRequest {
    constructor(
        readonly name: string,
        readonly email: string,
        readonly password: string
        ) {}
}
