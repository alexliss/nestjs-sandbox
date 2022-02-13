import { Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserService } from "src/user/user.service";
import { UserCredentials } from "./user.credentials";

export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject(UserService) private readonly userService: UserService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string): Promise<UserCredentials> {
        return await this.userService.validateUser(email, password);
    }
}
