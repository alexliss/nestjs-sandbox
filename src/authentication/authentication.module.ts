import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [AuthenticationService, JwtStrategy],
  controllers: [AuthenticationController],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    JwtModule.register({
      secret: 'p0947nvq8ualksdjfo8qvr3pvopve',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  exports: [AuthenticationService]
})
export class AuthenticationModule {}
