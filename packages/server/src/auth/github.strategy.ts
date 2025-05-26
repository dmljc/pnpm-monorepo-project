import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-github2";
// socks-proxy-agent 翻墙代理工具
// import { SocksProxyAgent } from "socks-proxy-agent";

// const agent = new SocksProxyAgent(
//     process.env.SOCKS_PROXY || "socks5://127.0.0.1:7897",
// );
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
    constructor() {
        super({
            clientID: "Ov23liJbxFckXcyyUGLN",
            clientSecret: "f4fb07b5d44b1e94d19e736ab6045b7b78b46e1b",
            callbackURL: "http://localhost:3000/api/auth/github/callback",
            scope: ["public_profile", "user:email"], // 是请求的数据的范围。
            // scope: ["email", "profile"],
            passReqToCallback: true,
        });
        // this._oauth2.setAgent(agent);
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ) {
        return profile;
    }
}
