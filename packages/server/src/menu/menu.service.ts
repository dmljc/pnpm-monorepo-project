import { HttpException, Injectable } from "@nestjs/common";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Menu } from "./entities/menu.entity";
import { User } from "../user/entities/user.entity";
import { Role } from "../role/entities/role.entity";

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Menu)
        private readonly menuRepository: Repository<Menu>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}

    async create(createMenuDto: CreateMenuDto) {
        const existingMenu = await this.menuRepository.findOne({
            where: { label: createMenuDto.label },
        });
        // 仅类型为目录和菜单时候才需要判断
        if (existingMenu && ["catalog", "menu"].includes(createMenuDto.type)) {
            throw new HttpException("目录/菜单名称已存在", 400);
        }

        let parent = null;
        if (createMenuDto.parentId) {
            parent = await this.menuRepository.findOne({
                where: { id: createMenuDto.parentId },
            });
        }

        const menu = this.menuRepository.create({
            ...createMenuDto,
            parent: parent || null,
        });

        return await this.menuRepository.save(menu);
    }

    // 查询树形菜单
    async findAllAsTree(): Promise<Menu[]> {
        // 通过 manager 获取 TreeRepository 实例
        const treeRepo = this.menuRepository.manager.getTreeRepository(Menu);
        this.menuRepository.manager.getRepository(Menu).find({});
        return treeRepo.findTrees();
    }

    async findOne(id: number) {
        return await this.menuRepository.findOneBy({ id });
    }

    async update(updateMenuDto: UpdateMenuDto) {
        // 对树形实体，不能直接使用 update，否则不会维护闭包表，
        // 进而导致后续 findAncestors/findTrees 等操作异常。
        const { id, parentId, ...rest } = updateMenuDto as any;

        const treeRepo = this.menuRepository.manager.getTreeRepository(Menu);
        const entity = await this.menuRepository.findOne({ where: { id } });
        if (!entity) {
            throw new HttpException("菜单不存在", 404);
        }

        // 自指校验
        if (parentId && Number(parentId) === Number(id)) {
            throw new HttpException("父级不能为自身", 400);
        }

        // 变更父级时做环路校验
        if (typeof parentId !== "undefined") {
            if (parentId === null) {
                entity.parent = null as any;
                (entity as any).parentId = null;
            } else {
                const newParent = await this.menuRepository.findOne({
                    where: { id: Number(parentId) },
                });
                if (!newParent) {
                    throw new HttpException("父级菜单不存在", 400);
                }
                // 环路校验：newParent 不能是当前节点的子孙
                const descendants = await treeRepo.findDescendants(entity);
                if (descendants.some((d) => d.id === newParent.id)) {
                    throw new HttpException(
                        "不允许将父级设置为自身的子孙节点",
                        400,
                    );
                }
                entity.parent = newParent;
                (entity as any).parentId = newParent.id;
            }
        }

        // 同步其余可更新字段
        Object.assign(entity, rest);

        // 使用 save 以便正确维护树形闭包关系
        return await this.menuRepository.save(entity);
    }

    async remove(id: number) {
        return await this.menuRepository.delete(id);
    }

    // 根据一组菜单/按钮ID，补全路径上的父级，并组装为树返回
    async buildTreeWithAncestorsByIds(ids: number[]): Promise<Menu[]> {
        if (!ids || ids.length === 0) return [];

        // 先把目标节点查出来
        const targets = await this.menuRepository.find({
            where: { id: In(ids) },
        });
        if (targets.length === 0) return [];

        // 不依赖闭包表，基于 parentId 逐级向上补全祖先
        const allNodesMap = new Map<number, Menu>();
        const tryAdd = (m?: Menu | null) => {
            if (m && !allNodesMap.has(m.id)) allNodesMap.set(m.id, m);
        };

        for (const node of targets) {
            tryAdd(node);
            // 逐级查找父级
            let currentParentId =
                (node as any).parentId ?? (node as any).parent?.id ?? null;
            const visited = new Set<number>([node.id]);
            while (currentParentId) {
                // 防环路保护
                if (visited.has(currentParentId)) break;
                visited.add(currentParentId);

                const parent = await this.menuRepository.findOne({
                    where: { id: currentParentId },
                });
                if (!parent) break;
                tryAdd(parent);
                currentParentId =
                    (parent as any).parentId ??
                    (parent as any).parent?.id ??
                    null;
            }
        }

        const uniqueNodes = Array.from(allNodesMap.values());

        // 以内存方式组装树（基于 parentId 关联）
        const nodeMap = new Map<number, any>();
        uniqueNodes.forEach((n) => nodeMap.set(n.id, { ...n, children: [] }));

        const roots: any[] = [];
        uniqueNodes.forEach((n) => {
            const node = nodeMap.get(n.id);
            const parentId = (n as any).parentId ?? (n as any).parent?.id;
            if (parentId && nodeMap.has(parentId)) {
                nodeMap.get(parentId).children.push(node);
            } else {
                roots.push(node);
            }
        });

        return roots;
    }

    // 根据当前用户的角色配置（Role.permission 为菜单/按钮ID数组），返回补全祖先后的完整菜单树
    async findCurrentUserMenuTree(userId: number): Promise<Menu[]> {
        if (!userId) return [];

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) return [];

        // user.role 可能是 角色编码/名称/ID，支持逗号分隔多值
        const roleTokens = (user.role || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        if (roleTokens.length === 0) return [];

        const roleIdTokens = roleTokens
            .map((t) => Number(t))
            .filter((n) => !Number.isNaN(n));
        const roleStrTokens = roleTokens.filter((t) => isNaN(Number(t)));

        const rolesSet = new Map<number, Role>();

        if (roleStrTokens.length > 0) {
            const rolesByCode = await this.roleRepository.find({
                where: { code: In(roleStrTokens) },
            });
            for (const r of rolesByCode) rolesSet.set(r.id, r);

            const rolesByName = await this.roleRepository.find({
                where: { name: In(roleStrTokens) },
            });
            for (const r of rolesByName) rolesSet.set(r.id, r);
        }

        if (roleIdTokens.length > 0) {
            const rolesById = await this.roleRepository.find({
                where: { id: In(roleIdTokens) },
            });
            for (const r of rolesById) rolesSet.set(r.id, r);
        }

        const roles = Array.from(rolesSet.values());
        if (!roles || roles.length === 0) return [];

        const idSet = new Set<number>();
        for (const r of roles) {
            let perms: any = (r as any).permission;
            // 兼容逗号分隔字符串、JSON 数组字符串、直接数组
            if (typeof perms === "string") {
                const raw = perms.trim();
                if (raw.startsWith("[") && raw.endsWith("]")) {
                    try {
                        const parsed = JSON.parse(raw);
                        if (Array.isArray(parsed)) perms = parsed;
                    } catch {
                        // ignore json parse error
                    }
                } else {
                    perms = raw
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                }
            }
            if (Array.isArray(perms)) {
                for (const pid of perms) {
                    const n = Number(pid);
                    if (!Number.isNaN(n)) idSet.add(n);
                }
            }
        }

        const ids = Array.from(idSet);
        return this.buildTreeWithAncestorsByIds(ids);
    }
}
