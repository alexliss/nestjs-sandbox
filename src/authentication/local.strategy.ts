import { UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthenticationService } from "./authentication.service";
import { UserCredentials } from "./user.credentials";

export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthenticationService) {
        super({ emailField: 'email' });
    }

    async validate(email: string, password: string): Promise<UserCredentials> {
        const user = await this.authService.validateUser(email, password);
        return user;
    }
}
