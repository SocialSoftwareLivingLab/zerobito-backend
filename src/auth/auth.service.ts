import { UsuarioEntity } from '@/app/usuarios/usuarios.entity';
import { UsuariosService } from '@/app/usuarios/usuarios.service';
import { PerfisService } from '@/app/usuarios/services/perfis.service';
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

    const dadosUsuarioCompletos = await this.buscarDadosCompletosUsuario(
      user.id,
    );

    const jwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      nome: user.nome,
      perfil: dadosUsuarioCompletos.perfil,
    };

    const token = this.jwtService.sign(jwtPayload);

    return {
      token,
      usuario: user,
    } as LoginResponse;
  }

  /**
   * Busca os dados completos do usuário incluindo perfil e permissões
   */
  public async buscarDadosCompletosUsuario(usuarioId: number) {
    const resultUsuario = await this.usuariosService.buscarUsuario({
      id: usuarioId,
    });

    const usuario: UsuarioEntity = resultUsuario.orElseThrow(
      () =>
        new ForbiddenException(MensagensHelper.Usuario.USUARIO_NAO_ENCONTRADO),
    );

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: {
        codigo: usuario.perfil?.codigo,
        nome: usuario.perfil?.nome,
        permissoes: usuario.perfil?.permissoes.map((p) => p.codigo),
      },
    };
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
