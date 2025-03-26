// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy'; // 👈 importa el strategy

@Module({
  imports: [
    UsersModule,
    PassportModule, // 👈 habilita Passport
    JwtModule.register({
      secret: 'jwt_secreto_super_secreto', // en producción usar .env
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy], // 👈 registra el strategy
  controllers: [AuthController],
  exports: [JwtModule], // 👈 útil si luego necesitas firmar tokens en otros módulos
})
export class AuthModule {}
