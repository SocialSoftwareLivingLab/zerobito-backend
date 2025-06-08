import { UsuariosService } from '@/app/usuarios/usuarios.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CriarUsuarioRequestDto,
  CriarUsuarioResponseDto,
} from './dtos/criar-usuario.dto';
import { PerfilUsuario } from './enums/perfil-usuario.enum';
import { Permissao } from './decorators/permissao.decorator';
import { PermissaoEnum } from './enums/permissoes.enum';
import {
  UsuarioAutenticado,
  usuarioTemPermissao,
  obterPermissoesUsuario,
} from '@/auth/decorators/usuario-autenticado.decorator';
import { Protegido } from '@/auth/decorators/protegido.decorator';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';

// TODO: Adicionar funcionalidade de cadastro quando o admin conseguir criar usuários na plataforma
// @ApiBearerAuth()
@ApiTags('Usuarios')
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
  // @Protegido()
  // @Perfil(PerfilUsuario.ADMIN) // Antigo sistema baseado em enum
  @Permissao(PermissaoEnum.SISTEMA_CRIAR_ADMIN) // Novo sistema RBAC específico
  public async adicionar(
    @Body() body: CriarUsuarioRequestDto,
  ): Promise<CriarUsuarioResponseDto> {
    const { id, nome, email, dataCriacao } =
      await this.usuarioService.adicionar(body, PerfilUsuario.USER);

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
      perfil: usuario.perfil,
      perfilDetalhado: usuario.perfilDetalhado,
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
}
