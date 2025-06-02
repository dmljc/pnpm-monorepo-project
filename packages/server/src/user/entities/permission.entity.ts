import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50,
    })
    name: string;

    @Column({
        length: 100,
        nullable: true,
    })
    desc: string;

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
}
