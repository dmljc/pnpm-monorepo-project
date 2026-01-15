import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
} from "typeorm";

@Entity()
@Tree("closure-table")
export class Menu {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ comment: "菜单类型" })
    type: string;

    @Column({ comment: "菜单名称" })
    label: string;

    @Column({ comment: "菜单路由", nullable: true })
    path?: string;

    @Column({ comment: "父级菜单ID", nullable: true })
    parentId?: number;

    @Column({ comment: "菜单图标", nullable: true })
    icon?: string;

    @Column({ comment: "菜单编码", nullable: true })
    code?: string;

    @Column({ comment: "组件路径", nullable: true })
    component?: string;

    @TreeChildren()
    children?: Menu[];

    @TreeParent()
    parent?: Menu;
}
