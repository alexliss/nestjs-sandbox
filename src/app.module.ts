import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ColumnModule } from './column/column.module';
import { CardModule } from './card/card.module';
import { CommentModule } from './comment/comment.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { DB_NAME, DB_PASS, DB_USERNAME, DB_HOST } from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_HOST,
      port: 5432,
      username: DB_USERNAME,
      password: DB_PASS,
      database: DB_NAME,
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    UserModule,
    ColumnModule,
    CardModule,
    CommentModule,
    AuthenticationModule
  ]
})
export class AppModule {}
