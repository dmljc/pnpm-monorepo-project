// entities 是封装对应数据库表的实体。
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    // ManyToMany,
    // JoinTable,
} from "typeorm";
// import { Role } from "src/role/entities/role.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        comment: "头像",
        nullable: true, // 添加这行
    })
    avatar: string;

    @Column({
        length: 50,
        comment: "账号",
    })
    username: string;

    @Column({
        length: 50,
        comment: "密码",
    })
    password: string;

    @Column({
        comment: "姓名",
        unique: true,
    })
    name: string;

    @Column({
        comment: "手机",
    })
    phone: string;

    @Column({
        comment: "邮箱",
    })
    email: string;

    @Column({
        comment: "用户状态",
    })
    status: number;

    @Column({
        comment: "用户角色",
    })
    role: string;

    @Column({
        comment: "备注",
        nullable: true,
    })
    remark: string;

    // @Column({
    //     comment: '头像',
    // })
    // avatar: string;

    @CreateDateColumn({
        comment: "创建时间",
    })
    startTime: Date;

    @CreateDateColumn({
        comment: "创建时间",
    })
    endTime: Date;

    @CreateDateColumn({
        transformer: {
            to(value: Date): Date {
                return value;
            },
            from(value: Date): string {
                return value.toLocaleString();
            },
        },
    })
    createTime: string;

    @UpdateDateColumn({
        transformer: {
            to(value: Date): Date {
                return value;
            },
            from(value: Date): string {
                return value.toLocaleString();
            },
        },
    })
    updateTime: string;

    // @ManyToMany(() => Role)
    // @JoinTable({
    //     name: "user_role_relation",
    // })
    // roles: Role[];
}
