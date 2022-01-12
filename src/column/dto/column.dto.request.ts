import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ColumnDtoRequest {

    @ApiProperty()
    @IsNotEmpty()
    name: string;

}
