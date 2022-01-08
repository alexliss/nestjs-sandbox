import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnEntity } from 'src/column/column.entity';
import { UserEntity } from 'src/user/user.entity';
import { CardController } from './card.controller';
import { CardEntity } from './card.entity';
import { CardService } from './card.service';

@Module({
  providers: [CardService],
  controllers: [CardController],
  imports: [TypeOrmModule.forFeature([CardEntity, ColumnEntity, UserEntity])],
})
export class CardModule {}
