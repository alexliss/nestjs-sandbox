import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ColumnModule } from './column/column.module';
import { CardModule } from './card/card.module';
import { CommentModule } from './comment/comment.module';
import { AuthenticationModule } from './authentication/authentication.module';
import ormConfig from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    UserModule,
    ColumnModule,
    CardModule,
    CommentModule,
    AuthenticationModule
  ]
})
export class AppModule {}
