import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('cards')
export class CardEntity {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;
    
}
