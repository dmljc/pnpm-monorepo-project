import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { VerifiedCallback } from "passport-jwt";

// socks-proxy-agent 翻墙代理工具
import { SocksProxyAgent } from "socks-proxy-agent";

const agent = new SocksProxyAgent(
    process.env.SOCKS_PROXY || "socks5://127.0.0.1:7897",
);

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor() {
        super({
            clientID:
                "994701689620-91u2vlf8q94hkjj91s4742oieu64369h.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:3000/api/auth/google/callback",
            scope: ["email", "profile"], // 必须包含 email 以获取用户信息
        });
        this._oauth2.setAgent(agent);
    }

    validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifiedCallback,
    ) {
        const { name, emails, photos } = profile;
        try {
            const user = {
                email: emails[0].value,
                firstName: name.givenName,
                lastName: name.familyName,
                picture: photos[0].value,
                accessToken, // 可选返回 accessToken
            };
            done(null, user); // 必须调用 done 或 return user
        } catch (error) {
            done(error, null); // 错误必须通过 done 传递
        }
    }
}
