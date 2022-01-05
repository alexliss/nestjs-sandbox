import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { ColumnController } from './column.controller';
import { ColumnEntity } from './column.entity';
import { ColumnService } from './column.service';

@Module({
    providers: [ColumnService],
    imports: [TypeOrmModule.forFeature([ColumnEntity, UserEntity])],
    controllers: [ColumnController]
})
export class ColumnModule {}
