import { ColumnEntity } from "src/column/column.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('cards')
export class CardEntity {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(type => ColumnEntity, column => column.cards)
    column: ColumnEntity;

    @ManyToOne(type => UserEntity, user => user.cards)
    user: UserEntity;

    constructor(title: string, description: string) {
        this.title = title;
        this.description = description;
    }
    
}
