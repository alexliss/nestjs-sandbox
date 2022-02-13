import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserCredentials } from "./user.credentials";
import { JWT_SECRET } from "src/config";
import { UserService } from "src/user/user.service";

export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(@Inject(UserService) private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JWT_SECRET
        })
    }

    async validate(request: any): Promise<UserCredentials> {
        const payloadData = new UserCredentials(request.payload.sub);

        if (!payloadData) 
            throw new HttpException('Invalid payload', HttpStatus.NOT_ACCEPTABLE);
        try {
            await this.userService.findById(payloadData.userId)
        } catch(error) {
            throw new HttpException('Invalid payload', HttpStatus.NOT_ACCEPTABLE)
        }
        return payloadData;
    }
}
