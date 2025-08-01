import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    // UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
// import { Permission } from "../user/entities/permission.entity";
import { RedisService } from "../redis/redis.service";
import { RoleService } from "../role/role.service";

@Injectable()
export class PermissionGuard implements CanActivate {
    @Inject(RedisService)
    private redisService: RedisService;

    @Inject(RoleService)
    private roleService: RoleService;

    @Inject(Reflector)
    private reflector: Reflector;

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        if (!request.user) {
            return true;
        }

        // const roles = await this.roleService.findRolesByIds([1]);

        // const permissions: Permission[] = roles.reduce((total, current) => {
        //     total.push(...current.permissions);
        //     return total;
        // }, []);

        // const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
        //     "require-permission",
        //     [context.getClass(), context.getHandler()],
        // );

        // for (let i = 0; i < requiredPermissions.length; i++) {
        //     const curPermission = requiredPermissions[i];
        //     const found = permissions.find(
        //         (item) => item.name === curPermission,
        //     );
        //     if (!found) {
        //         throw new UnauthorizedException("您没有访问该接口的权限");
        //     }
        // }

        return true;
    }
}
