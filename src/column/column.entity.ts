import { CardEntity } from "src/card/card.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('columns')
export class ColumnEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(type => UserEntity, user => user.columns, {
        onDelete: 'CASCADE'
    })
    user: UserEntity

    @OneToMany(type => CardEntity, cards => cards.column)
    cards: CardEntity[];
}
