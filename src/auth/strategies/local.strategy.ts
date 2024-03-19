import { UsuarioEntity } from '@/app/usuarios/usuarios.entity';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UsuarioAutenticadoDto } from '../dtos/usuario-autenticado.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'senha' });
  }

  async validate(email: string, senha: string): Promise<UsuarioAutenticadoDto> {
    const resultado: UsuarioEntity = await this.authService.validarUsuario(
      email,
      senha,
    );

    return {
      id: resultado.id,
      nome: resultado.nome,
      email: resultado.email,
      perfil: resultado.permissao,
    };
  }
}
