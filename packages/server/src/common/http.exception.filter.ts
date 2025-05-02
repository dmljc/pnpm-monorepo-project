import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        // const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const message = exception.message;

        // 自定义 返回的 messgae 为 @IsNotEmpty ({ message: '账号不为空' }) 等装饰器中的 message 信息
        const res = exception.getResponse() as {
            message: string[] | string;
            code: number;
            statusCode: number;
            error: string;
            timestamp: string;
        };

        response.status(status).json({
            code: res.statusCode || status,
            message: res?.message || res?.message?.[0] || message,
            success: false,
            timestamp: new Date().toLocaleString(),
            // path: request.url,
        });
    }
}
