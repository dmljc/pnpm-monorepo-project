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

@Injectable()
export class LoginGuard implements CanActivate {
    @Inject(JwtService)
    private jwtService: JwtService;

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        const authorization = request.header("Authorization");

        const bearer = authorization?.split(" ");

        // 登录接口不需要登录
        if (["/api/user/login"].includes(request.route.path)) {
            return true;
        }

        if (!bearer || bearer?.length < 2) {
            throw new HttpException("登录 token 错误", HttpStatus.UNAUTHORIZED);
        }

        const token = bearer[1];

        try {
            const info = this.jwtService?.verify(token);
            (request as any).user = info?.user;
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
