import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ColumnService } from './column/column.service';
import { CardService } from './card/card.service';
import { CommentService } from './comment/comment.service';
import { ColumnController } from './column/column.controller';
import { ColumnModule } from './column/column.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'abobus',
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    UserModule,
    ColumnModule
  ],
  controllers: [AppController],
  providers: [AppService, CardService, CommentService],
})
export class AppModule {}
