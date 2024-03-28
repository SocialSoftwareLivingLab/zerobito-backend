import { UsuarioEntity } from '@/app/usuarios/usuarios.entity';
import { UsuariosService } from '@/app/usuarios/usuarios.service';
import { CriptografiaHelper } from '@/helpers/criptografia.helper';
import { MensagensHelper } from '@/helpers/mensagens.helper';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from './dtos/jwt-payload.dto';
import { LoginResponse } from './dtos/login.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  public async gerarTokenAutenticacao(req: Request): Promise<LoginResponse> {
    const user = req.user;

    const jwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      nome: user.nome,
      role: user.perfil,
    };

    const token = this.jwtService.sign(jwtPayload);

    return {
      token,
      usuario: user,
    } as LoginResponse;
  }

  /**
   * Validar a autenticação de um usuário na plataforma
   *
   * @param email endereço de e-mail do usuáripo
   * @param senha senha de acesso na plataforma
   * @returns Usuario encontrado caso as validações sejam bem sucedidas
   * @throws NotFoundException caso o e-mail ou senha do usuário sejam inválidas
   */
  public async validarUsuario(
    email: string,
    senha: string,
  ): Promise<UsuarioEntity> {
    const resultUsuario = await this.usuariosService.buscarUsuario({
      email,
    });

    const usuario: UsuarioEntity = resultUsuario.orElseThrow(
      () =>
        new NotFoundException(
          MensagensHelper.Usuario.LOGIN_USUARIO_NAO_ENCONTRADO,
        ),
    );

    const senhaValida: boolean = CriptografiaHelper.validarHash(
      senha,
      usuario.senha,
    );

    if (!senhaValida) {
      throw new NotFoundException(
        MensagensHelper.Usuario.LOGIN_USUARIO_NAO_ENCONTRADO,
      );
    }

    return usuario;
  }

  public async validarUsuarioPorId(id: number): Promise<UsuarioEntity> {
    const resultado = await this.usuariosService.buscarUsuario({ id });

    const usuario: UsuarioEntity = resultado.orElseThrow(
      () =>
        new ForbiddenException(MensagensHelper.Usuario.USUARIO_NAO_ENCONTRADO),
    );

    return usuario;
  }
}
