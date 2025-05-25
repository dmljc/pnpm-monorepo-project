// entities 是封装对应数据库表的实体。
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { Permission } from "src/user/entities/permission.entity";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        comment: "角色名称",
    })
    name: string;

    @Column({
        comment: "角色编码",
    })
    code: string;

    @Column({
        comment: "角色状态",
    })
    status: number;

    @Column({
        comment: "备注",
        nullable: true,
    })
    remark: string;

    @CreateDateColumn({
        comment: "创建时间",
    })
    createTime: Date;

    @UpdateDateColumn({
        comment: "更新时间",
    })
    updateTime: Date;

    @ManyToMany(() => Permission)
    @JoinTable({
        name: "role_permission_relation",
    })
    permissions: Permission[];
}
