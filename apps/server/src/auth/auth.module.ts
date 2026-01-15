import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { GithubStrategy } from "./github.strategy";
import { GoogleStrategy } from "./google.strategy";

@Module({
    imports: [PassportModule, UserModule],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        GithubStrategy,
        GoogleStrategy,
    ],
})
export class AuthModule {}
