import { UserEntity } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('columns')
export class ColumnEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;

    @ManyToOne(type => UserEntity, user => user.columns)
    user: UserEntity
    
}
