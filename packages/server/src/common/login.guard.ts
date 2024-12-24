import { JwtService } from "@nestjs/jwt";
import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";

declare module "express" {
    interface Request {
        user: {
            username: string;
            // roles: Role[]
        };
    }
}

@Injectable()
export class LoginGuard implements CanActivate {
    @Inject(JwtService)
    private jwtService: JwtService;

    @Inject()
    private reflector: Reflector;

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        const authorization = request.header("Authorization");

        const requireLogin = this.reflector.getAllAndOverride("require-login", [
            context.getClass(),
            context.getHandler(),
        ]);

        if (!requireLogin) return true;
        if (!authorization) {
            throw new HttpException("用户未登录", HttpStatus.UNAUTHORIZED);
        }

        try {
            const token = authorization.split(" ")[1];
            const info = this.jwtService.verify(token);
            request.user = info.user;
            return true;
        } catch (e) {
            console.log("登录守卫异常信息e：", e);
            throw new HttpException(
                "登录 token 失效，请重新登录",
                HttpStatus.UNAUTHORIZED,
            );
        }
    }
}
