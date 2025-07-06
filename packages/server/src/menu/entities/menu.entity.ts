import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Menu {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        comment: "菜单类型",
    })
    type: string;

    @Column({
        comment: "菜单名称",
    })
    name: string;

    @Column({
        comment: "菜单路由",
    })
    url: string;
}
