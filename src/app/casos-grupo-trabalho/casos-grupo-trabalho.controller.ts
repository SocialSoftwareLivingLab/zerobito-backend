import { Protegido } from '@/auth/decorators/protegido.decorator';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CasosGrupoTrabalhoService } from './casos-grupo-trabalho.service';
import { MembroGrupoTrabalhoResponse } from './payloads/membro-grupo-trabalho.payload';
import { UsuarioAutenticado } from '@/auth/decorators/usuario-autenticado.decorator';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { ConvidarMembroGrupoTrabalhoRequest } from './payloads/convidar-membro.payload';

@Protegido()
@ApiBearerAuth()
@ApiTags('Grupo de trabalho')
@Controller('/api/v1/casos')
export class CasosGrupoTrabalhoController {
  constructor(
    private readonly casoGrupoTrabalhoService: CasosGrupoTrabalhoService,
  ) {}

  @ApiOperation({
    summary: 'Listar todos os membros do grupo de trabalho',
    description:
      'Retorna a relação de membros presentes no grupo de trabalho de um caso. Cada membro aparece de acordo com um convite' +
      'realizado pelo coordenador.',
  })
  @ApiOkResponse({
    description: 'Tipo de notificação registrado',
    type: MembroGrupoTrabalhoResponse,
    isArray: true,
  })
  @Get('/:idCaso/grupo-trabalho/membros')
  public async listarMembrosGrupo(
    @Param('idCaso')
    idCaso: number,
  ) {
    const response = await this.casoGrupoTrabalhoService.listar(idCaso);

    return response.membros.map((membro) => {
      const membroResponse = new MembroGrupoTrabalhoResponse();
      membroResponse.identificador = membro.identificador;
      membroResponse.nome = membro.nome;
      membroResponse.email = membro.email;
      membroResponse.status = membro.status;

      return membroResponse;
    });
  }

  @ApiOperation({
    summary: 'Criar um novo convite para o grupo de trabalho',
    description:
      'Emite um novo convite de participação no grupo de trabalho, para que o convidado consiga ingressar por conta própria',
  })
  @Post('/:idCaso/grupo-trabalho/convite')
  public async enviarConvite(
    @Param('idCaso')
    idCaso: number,
    @UsuarioAutenticado() criador: UsuarioAutenticadoDto,
    @Body() payload: ConvidarMembroGrupoTrabalhoRequest,
  ) {
    await this.casoGrupoTrabalhoService.enviarConvite(idCaso, criador, payload);
  }

  @ApiOperation({
    summary: 'Aceitar um convite para o grupo de trabalho',
    description:
      'Aceita um convite para ingressar no grupo de trabalho de um caso específico',
  })
  @ApiNoContentResponse({
    description: 'Convite aceito com sucesso',
  })
  @Post('/grupo-trabalho/convite/:identificador/aceitar')
  public async aceitarConvite(
    @Param('identificador')
    identificadorConvite: string,
    @UsuarioAutenticado() usuarioAutenticado: UsuarioAutenticadoDto,
  ) {
    await this.casoGrupoTrabalhoService.aceitarConvite(
      identificadorConvite,
      usuarioAutenticado,
    );
  }
}
