import { IsNotEmpty } from "class-validator";

export class ColumnDtoRequest {
    @IsNotEmpty()
    name: string;
}
