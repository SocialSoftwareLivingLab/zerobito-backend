import { Protegido } from '@/auth/decorators/protegido.decorator';
import { UsuarioAutenticado } from '@/auth/decorators/usuario-autenticado.decorator';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Permissao } from '@/app/usuarios/decorators/permissao.decorator';
import { PermissaoEnum } from '@/app/usuarios/enums/permissoes.enum';
import { CasosPermissaoService } from '@/app/casos/services/casos-permissao.service';
import { AtribuirPerfilMembroRequest } from '../payloads/atribuir-perfil-membro.payload';
import { PerfilCasoResponse } from '../payloads/perfil-caso.response';

@Protegido()
@ApiBearerAuth()
@ApiTags('Membros - Perfis')
@Controller('/api/v1/casos')
export class MembrosPerfilController {
  constructor(private readonly casosPermissaoService: CasosPermissaoService) {}

  @ApiOperation({
    summary: 'Listar perfis disponíveis para casos',
    description:
      'Retorna todos os perfis que podem ser atribuídos a membros de casos',
  })
  @ApiOkResponse({
    description: 'Perfis disponíveis para casos',
    type: PerfilCasoResponse,
    isArray: true,
  })
  @Get('/perfis-caso')
  @Permissao(PermissaoEnum.CASOS_ENVIAR_CONVITE_MEMBRO)
  public async listarPerfisParaCasos(): Promise<PerfilCasoResponse[]> {
    const perfis = await this.casosPermissaoService.listarPerfisParaCasos();

    return perfis.map((perfil) => ({
      id: perfil.id,
      codigo: perfil.codigo,
      nome: perfil.nome,
      descricao: perfil.descricao,
      permissoes: perfil.permissoes.map((p) => p.codigo),
    }));
  }

  @ApiOperation({
    summary: 'Atribuir perfil a membro do caso',
    description:
      'Atribui um perfil específico a um membro do grupo de trabalho do caso',
  })
  @Post('/:idCaso/grupo-trabalho/membros/:idMembro/perfil')
  @Permissao(PermissaoEnum.CASOS_ENVIAR_CONVITE_MEMBRO)
  public async atribuirPerfilMembro(
    @Param('idCaso') idCaso: number,
    @Param('idMembro') idMembro: number,
    @Body() payload: AtribuirPerfilMembroRequest,
    @UsuarioAutenticado() usuario: UsuarioAutenticadoDto,
  ): Promise<void> {
    await this.casosPermissaoService.atribuirPerfilMembro(
      idMembro,
      payload.idPerfil,
    );
  }

  @ApiOperation({
    summary: 'Remover perfil de membro do caso',
    description: 'Remove o perfil atribuído a um membro do grupo de trabalho',
  })
  @Delete('/:idCaso/grupo-trabalho/membros/:idMembro/perfil')
  @Permissao(PermissaoEnum.CASOS_ENVIAR_CONVITE_MEMBRO)
  public async removerPerfilMembro(
    @Param('idCaso') idCaso: number,
    @Param('idMembro') idMembro: number,
    @UsuarioAutenticado() usuario: UsuarioAutenticadoDto,
  ): Promise<void> {
    await this.casosPermissaoService.removerPerfilMembro(idMembro);
  }

  @ApiOperation({
    summary: 'Obter permissões do usuário no caso',
    description:
      'Retorna as permissões que o usuário possui no caso específico',
  })
  @ApiOkResponse({
    description: 'Permissões do usuário no caso',
    type: [String],
  })
  @Get('/:idCaso/minhas-permissoes')
  public async obterMinhasPermissoes(
    @Param('idCaso') idCaso: number,
    @UsuarioAutenticado() usuario: UsuarioAutenticadoDto,
  ): Promise<{ permissoes: string[] }> {
    const permissoes =
      await this.casosPermissaoService.obterPermissoesUsuarioNoCaso(
        usuario.id,
        idCaso,
      );

    return { permissoes };
  }
}
