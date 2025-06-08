import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { UsuarioAutenticadoDto } from '../dtos/usuario-autenticado.dto';
import { UsuarioEntity } from '@/app/usuarios/usuarios.entity';
import { JwtPayload } from '../dtos/jwt-payload.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<UsuarioAutenticadoDto> {
    if (payload.perfil) {
      return {
        id: payload.sub,
        nome: payload.nome,
        email: payload.email,
        perfil: payload.perfil,
      };
    }

    const dadosCompletos = await this.authService.buscarDadosCompletosUsuario(
      payload.sub,
    );

    return dadosCompletos;
  }
}
