import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    Logger,
    NestInterceptor,
} from "@nestjs/common";
import { Request, Response } from "express";
import { tap } from "rxjs";
import * as requestIp from "request-ip";
import { HttpService } from "@nestjs/axios";
import * as iconv from "iconv-lite";

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
    private readonly logger = new Logger(RequestLogInterceptor.name);

    @Inject(HttpService)
    private httpService: HttpService;

    async ipToCity(ip: string) {
        try {
            const response = await this.httpService.axiosRef(
                `https://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`,
                {
                    responseType: "arraybuffer",
                    timeout: 3000, // 减少超时时间到3秒
                    transformResponse: [
                        function (data) {
                            const str = iconv.decode(data, "gbk");
                            return JSON.parse(str);
                        },
                    ],
                },
            );
            return response.data.addr;
        } catch (error) {
            // 如果IP查询失败，返回默认值，不影响主流程
            this.logger.warn(`IP地址查询失败: ${ip}, 错误: ${error.message}`);
            return "未知地区";
        }
    }

    async intercept(context: ExecutionContext, next: CallHandler<any>) {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();

        const userAgent = request.headers["user-agent"];

        const { ip, method, path } = request;

        const clientIp = requestIp.getClientIp(request) || ip;

        // 异步获取IP地址信息，不阻塞主流程
        this.ipToCity(clientIp)
            .then((city) => {
                this.logger.debug(`${clientIp}: ${city}`);
            })
            .catch((error) => {
                this.logger.warn(`获取IP地址信息失败: ${error.message}`);
            });

        this.logger.debug(
            `${method} ${path} ${clientIp} ${userAgent}: ${
                context.getClass().name
            } ${context.getHandler().name} invoked...`,
        );

        const now = Date.now();

        return next.handle().pipe(
            tap((res) => {
                this.logger.debug(
                    `${method} ${path} ${clientIp} ${userAgent}: ${response.statusCode}: ${Date.now() - now}ms`,
                );
                this.logger.debug(`Response: ${JSON.stringify(res)}`);
            }),
        );
    }
}
