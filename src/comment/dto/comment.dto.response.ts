export class CommentDtoResponse {
    constructor(
        readonly id: number,
        readonly userId: number,
        readonly text: string,
        readonly createdAt: Date,
        readonly updatedAt: Date) {}
}
