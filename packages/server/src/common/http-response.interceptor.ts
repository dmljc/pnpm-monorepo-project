/* 
 响应拦截器

rxjs 是一个处理异步逻辑的库，它的特点就是 operator 多，你可以通过组合 operator 来完成逻辑，不需要自己写。
nest 的 interceptor 就用了 rxjs 来处理响应，但常用的 operator 也就这么几个：

- tap: 不修改响应数据，执行一些额外逻辑，比如记录日志、更新缓存等
- map：对响应数据做修改，一般都是改成 {code, data, message} 的格式
- catchError：在 exception filter 之前处理抛出的异常，可以记录或者抛出别的异常
- timeout：处理响应超时的情况，抛出一个 TimeoutError，配合 catchErrror 可以返回超时的响应

总之，rxjs 的 operator 多，但是适合在 nest interceptor 里用的也不多。
此外，interceptor 也是可以注入依赖的，你可以通过注入模块内的各种 provider。
全局 interceptor 可以通过 APP_INTERCEPTOR 的 token 声明，这种能注入依赖，比 app.useGlobalInterceptors 更好。
interceptor 是 nest 必用功能，还是要好好掌握的。
*/
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class HttpResppnseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                return {
                    code: 200,
                    data,
                    success: true,
                    message: '成功',
                };
            }),
        );
    }
}
