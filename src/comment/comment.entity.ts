import { CardEntity } from "src/card/card.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('comments')
export class CommentEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    text: string;

    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(type => UserEntity, user => user.comments, {
        onDelete: 'CASCADE'
    })
    user: UserEntity;

    @ManyToOne(type => CardEntity, card => card.comments, {
        onDelete: 'CASCADE'
    })
    card: CardEntity;

    constructor(text: string) {
        this.text = text
    }
}
