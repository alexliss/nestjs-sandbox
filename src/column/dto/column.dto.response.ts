export class ColumnDtoResponse {
    constructor(
    readonly id: number,
    readonly name: string,
    readonly userId: number,
    readonly createdAt: Date,) {}
}
