import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UsuariosModule } from '@/app/usuarios/usuarios.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtGuard } from './guards/jwt-auth.guard';
import { ProtegidoGuard } from './guards/protegido.guard';
import { PerfilGuard } from './guards/perfil.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsuariosModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtGuard,
    ProtegidoGuard,
    PerfilGuard,
  ],
  controllers: [AuthController],
  exports: [JwtGuard, ProtegidoGuard, PerfilGuard, AuthService],
})
export class AuthModule {}
