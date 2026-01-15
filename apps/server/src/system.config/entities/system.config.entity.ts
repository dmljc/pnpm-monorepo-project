import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("system_config")
export class SystemConfig {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: "logo",
        type: "varchar",
        length: 500,
        comment: "系统图标URL",
    })
    logo: string;

    @Column({ name: "name", type: "varchar", length: 50, comment: "系统名称" })
    name: string;

    @Column({
        name: "description",
        type: "varchar",
        length: 200,
        comment: "系统描述",
    })
    description: string;

    @Column({
        name: "copyright",
        type: "varchar",
        length: 200,
        comment: "版权说明",
    })
    copyright: string;

    @Column({ name: "icp", type: "varchar", length: 100, comment: "ICP备案号" })
    icp: string;

    @CreateDateColumn({ name: "created_at", comment: "创建时间" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", comment: "更新时间" })
    updatedAt: Date;
}
