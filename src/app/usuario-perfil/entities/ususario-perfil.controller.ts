import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Protegido } from '@/auth/decorators/protegido.decorator';
import UsuarioPerfilEntity from './usuario-perfil.entity';
import { UsuarioPerfilService } from './usuario-perfil.service';
import { UsuarioAutenticado } from '@/auth/decorators/usuario-autenticado.decorator';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';

@ApiBearerAuth()
@Protegido()
@ApiTags('Perfis de Usuário')
@Controller('/api/v1/perfis-usuario')
export class UsuarioPerfilController {
  constructor(private readonly perfilUsuarioService: UsuarioPerfilService) {}

  @ApiOperation({
    summary: 'Listar perfis de um usuário',
    description: 'Lista todos os perfis associados a um usuário.',
  })
  @ApiOkResponse({
    description: 'Perfis do usuário',
    type: UsuarioPerfilEntity,
    isArray: true,
  })
  @Get('/usuario')
  public async listarPerfisDoUsuario(
    @UsuarioAutenticado() usuarioAutenticado: UsuarioAutenticadoDto,
  ): Promise<UsuarioPerfilEntity[]> {
    return this.perfilUsuarioService.listarPerfisDoUsuario(usuarioAutenticado.id);
  }

  @ApiOperation({
    summary: 'Obter permissões de um usuário em um caso',
    description:
      'Retorna a lista de permissões que o usuário possui em um caso específico.',
  })
  @ApiOkResponse({
    description: 'Permissões do usuário no caso',
    type: String,
    isArray: true,
  })
  @Get('/usuario/caso/:idCaso/permissoes')
  public async obterPermissoesUsuarioNoCaso(
    @UsuarioAutenticado() usuarioAutenticado: UsuarioAutenticadoDto,
    @Param('idCaso') idCaso: number,
  ): Promise<string[]> {
    return this.perfilUsuarioService.obterPermissoesUsuarioNoCaso(
      usuarioAutenticado.id,
      idCaso,
    );
  }
}
