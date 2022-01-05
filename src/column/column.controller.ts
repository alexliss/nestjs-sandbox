import { Body, Controller, Post } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnDtoRequest } from './dto/column.dto.request';
import { ColumnDtoResponse } from './dto/column.dto.response';

@Controller('column')
export class ColumnController {
    constructor(private readonly columnService: ColumnService) {}
    
    @Post()
    async create(@Body() data: ColumnDtoRequest): Promise<ColumnDtoResponse> {
        return this.columnService.createColumn(data);
    }
}
