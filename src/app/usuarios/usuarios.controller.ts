import { UsuariosService } from '@/app/usuarios/usuarios.service';
import { Protegido } from '@/auth/decorators/protegido.decorator';
import {
  obterPermissoesUsuario,
  UsuarioAutenticado,
  usuarioTemPermissao,
} from '@/auth/decorators/usuario-autenticado.decorator';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Permissao } from './decorators/permissao.decorator';
import {
  CriarUsuarioAdminRequestDto,
  CriarUsuarioComumRequestDto,
  CriarUsuarioResponseDto,
} from './dtos/criar-usuario.dto';
import { PerfilUsuario } from './enums/perfil-usuario.enum';
import { PermissaoEnum } from './enums/permissoes.enum';
import { RedefinirSenhaDto } from './dtos/redefinir-senha.dto';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('/api/v1/usuarios')
export class UsuariosController {
  constructor(private readonly usuarioService: UsuariosService) {}

  @Post()
  @ApiOperation({
    description: 'Adiciona um novo usuário na plataforma',
    summary: 'Adicionar novo usuário',
  })
  @ApiCreatedResponse({
    type: CriarUsuarioResponseDto,
    description: 'Usuário criado',
  })
  public async adicionar(
    @Body() body: CriarUsuarioComumRequestDto,
  ): Promise<CriarUsuarioResponseDto> {
    const { id, nome, email, dataCriacao } =
      await this.usuarioService.adicionar(body, PerfilUsuario.USER);

    return { id, nome, email, dataCriacao };
  }

  @Post('/admin')
  @ApiOperation({
    description: 'Adiciona um novo usuário na plataforma',
    summary: 'Adicionar novo usuário',
  })
  @ApiCreatedResponse({
    type: CriarUsuarioResponseDto,
    description: 'Usuário criado',
  })
  @Protegido()
  @Permissao(PermissaoEnum.SISTEMA_CRIAR_ADMIN)
  public async adicionarQualquerUsuario(
    @Body() body: CriarUsuarioAdminRequestDto,
  ): Promise<CriarUsuarioResponseDto> {
    const { id, nome, email, dataCriacao } =
      await this.usuarioService.adicionar(body, PerfilUsuario[body.perfil]);

    return { id, nome, email, dataCriacao };
  }

  @Get('/perfil')
  @ApiOperation({
    description: 'Retorna os dados do perfil do usuário autenticado',
    summary: 'Obter perfil do usuário',
  })
  @ApiBearerAuth()
  @Protegido()
  public async obterPerfil(
    @UsuarioAutenticado() usuario: UsuarioAutenticadoDto,
  ) {
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfis: usuario.perfis ?? [],
    };
  }

  @Get('/permissoes')
  @ApiOperation({
    description: 'Retorna as permissões do usuário autenticado',
    summary: 'Obter permissões do usuário',
  })
  @ApiBearerAuth()
  @Protegido()
  public async obterPermissoes(
    @UsuarioAutenticado() usuario: UsuarioAutenticadoDto,
  ) {
    const permissoes = obterPermissoesUsuario(usuario);
    const temPermissaoAdmin = usuarioTemPermissao(
      usuario,
      PermissaoEnum.SISTEMA_CRIAR_ADMIN,
    );

    return {
      permissoes,
      temPermissaoAdmin,
      quantidadePermissoes: permissoes.length,
    };
  }
  @Post('redefinir-email')
  @ApiOperation({
    description: 'Manda e-mail para redefinição de senha',
    summary: 'Manda-email para redefinição de senha',
  })
  @ApiCreatedResponse({
    description: 'Usuário criado',
  })
  // @Protegido()
  // @Perfil(PerfilUsuario.ADMIN)
  public async emailRedefinicao(
  @Body('email') email: string,
): Promise<{ mensagem: string }> {
  await this.usuarioService.enviarEmailRedefinicaoSenha(email);
  return { mensagem: 'E-mail de redefinição enviado com sucesso' };
}

@Post('redefinir')
@ApiOperation({
  description: 'Redefine a senha do usuário com base em um token',
  summary: 'Redefinir senha do usuário',
})
@ApiCreatedResponse({
  description: 'Senha redefinida com sucesso',
})
public async redefinirSenha(
  @Body() body: RedefinirSenhaDto,
): Promise<{ mensagem: string }> {
  const sucesso = await this.usuarioService.redefinirSenha(body.token, body.senha);

  return { mensagem: 'Senha redefinida com sucesso' };
}
}
