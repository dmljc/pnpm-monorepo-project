// i18n.filter.ts

// import { Request } from "express";
import { I18nValidationExceptionFilter } from "nestjs-i18n";

export class CustomI18nValidationFilter extends I18nValidationExceptionFilter {
    constructor() {
        super({
            //返回简单的格式形式
            detailedErrors: false,
            // 自定义body返回的格式
            responseBodyFormatter: (host, _, errors: any) => {
                // 参数三：errors 就是我们上面看到的数组
                // const ctx = host.switchToHttp();
                // const request = ctx.getRequest<Request>();

                return {
                    success: false,
                    // timestamp: new Date().toISOString(),
                    message: errors[0], // 转化成字符串
                    code: 400,
                };
            },
        });
    }
}
