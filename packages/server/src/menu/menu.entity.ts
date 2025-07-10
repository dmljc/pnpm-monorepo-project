// ... existing code ...
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from "typeorm";

@Entity()
export class Menu {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    parentId?: string;

    @ManyToOne(() => Menu, (menu) => menu.children, { nullable: true })
    @JoinColumn({ name: "parentId" })
    parent?: Menu;

    @OneToMany(() => Menu, (menu) => menu.parent)
    children?: Menu[];

    @Column({ nullable: true })
    url?: string;
    @Column({ nullable: true })
    icon?: string;
    @Column({ nullable: true })
    code?: string;
    @Column({ nullable: true })
    component?: string;
}
