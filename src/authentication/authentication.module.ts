import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './jwt.strategy';
import { JWT_SECRET, JWT_EXPIRE } from 'src/config';
import { LocalStrategy } from './local.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [AuthenticationService, JwtStrategy, LocalStrategy],
  controllers: [AuthenticationController],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRE },
    }),
  ],
  exports: [AuthenticationService]
})
export class AuthenticationModule {}
