import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "string",
        });
    }

    async validate(payload: any) {
        // 登录时写入的 payload 结构为 { user: { id, username, ... } }
        // 这里需要把 user 透传出来，框架会把该返回值赋给 req.user
        if (payload && payload.user) {
            return {
                id: payload.user.id,
                username: payload.user.username,
                ...payload.user,
            };
        }
        return payload;
    }
}
