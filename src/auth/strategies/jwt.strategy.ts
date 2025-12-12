import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../dtos/jwt-payload.dto';
import { UsuarioAutenticadoDto } from '../dtos/usuario-autenticado.dto';

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
    const dadosCompletos = await this.authService.buscarDadosCompletosUsuario(
      payload.sub,
    );
    return {
      id: payload.sub,
      nome: payload.nome,
      email: payload.email
    };
  }
}
