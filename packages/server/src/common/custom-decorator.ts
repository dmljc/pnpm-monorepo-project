import { SetMetadata } from "@nestjs/common";

// 我们需要区分哪些接口需要登录，哪些接口不需要。这时候就可以用 SetMetadata 了。
export const RequireLogin = (bool = true) => {
    return SetMetadata("require-login", bool);
};

// 比如 jwt 的 Guard，现在需要在每个 controller 上手动应用，我想通过一个 @IsPublic 的装饰器来标识，
// 如果有 @IsPublic 的装饰器就不需要身份认证，否则就需要。
export const IS_PUBLIC_KEY = "isPublic";
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);

// 接口权限
export const RequirePermission = (...permissions: string[]) =>
    SetMetadata("require-permission", permissions);
