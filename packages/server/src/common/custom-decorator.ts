import { SetMetadata } from "@nestjs/common";

// 我们需要区分哪些接口需要登录，哪些接口不需要。这时候就可以用 SetMetadata 了。
export const RequireLogin = (bool = true) => {
    return SetMetadata("require-login", bool);
};
