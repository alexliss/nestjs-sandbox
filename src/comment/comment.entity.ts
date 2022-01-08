import { CardEntity } from "src/card/card.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CommentDtoRequest } from "./dto/comment.dto.request";

@Entity('comment')
export class CommentEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    text: string;

    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(type => UserEntity, user => user.comments)
    user: UserEntity;

    @ManyToOne(type => CardEntity, card => card.comments)
    card: CardEntity;

    constructor(data: CommentDtoRequest) {
        this.text = data.text;
    }
}
