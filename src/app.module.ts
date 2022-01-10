import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ColumnModule } from './column/column.module';
import { CardModule } from './card/card.module';
import { CommentModule } from './comment/comment.module';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    ColumnModule,
    CardModule,
    CommentModule,
    AuthenticationModule
  ]
})
export class AppModule {}
