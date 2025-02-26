// entities 是封装对应数据库表的实体。
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

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
    })
    name: string;

    @Column({
        comment: "性别",
    })
    sex: number;

    @Column({
        comment: "手机",
    })
    phone: string;

    @Column({
        comment: "用户状态",
    })
    status: number;

    @Column({
        comment: "用户角色",
    })
    role: number;

    @Column({
        comment: "备注",
    })
    remark: string;

    // @Column({
    //     comment: '头像',
    // })
    // avatar: string;

    @CreateDateColumn({
        comment: "创建时间",
    })
    createTime: Date;

    @CreateDateColumn({
        comment: "创建时间",
    })
    startTime: Date;

    @CreateDateColumn({
        comment: "创建时间",
    })
    endTime: Date;

    @UpdateDateColumn({
        comment: "更新时间",
    })
    updateTime: Date;
}
