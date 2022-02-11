import { ApiProperty } from "@nestjs/swagger";
import { ColumnEntity } from "../column.entity";

export class ColumnDtoResponse {
    
    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly userId: number;

    @ApiProperty()
    readonly createdAt: Date;

    constructor(column: ColumnEntity) {
        this.id = column.id;
        this.name = column.name;
        this.userId = column.userId;
        this.createdAt = column.createdAt;
    }
}
