import { HttpException, HttpStatus } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserCredentials } from "./user.credentials";

export class JwtStrategy extends PassportStrategy(Strategy){
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'p0947nvq8ualksdjfo8qvr3pvopve'
        })
    }

    async validate(request: any): Promise<UserCredentials> {
        const payloadData = new UserCredentials(request.payload.sub);
        if (!payloadData) 
            throw new HttpException('Invalid payload', HttpStatus.NOT_ACCEPTABLE);
        return payloadData;
    }
}
