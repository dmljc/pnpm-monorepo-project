import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50,
        comment: '名称',
    })
    name: string;

    @Column({
        length: 50,
        comment: '字',
    })
    word: string;

    @Column({
        comment: '简介',
    })
    description: string;

    @Column({
        comment: '头像',
    })
    avatar: string;
}
