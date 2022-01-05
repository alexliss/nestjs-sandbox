import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('comment')
export class CommentEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;
}
