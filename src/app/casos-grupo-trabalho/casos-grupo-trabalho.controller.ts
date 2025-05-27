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
import { RegistarAtaRequest } from './payloads/registrar-ata.payload';
import { emailConviteResponse } from './payloads/email-convite.payload';

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
    type: emailConviteResponse,
    isArray: true,
  })
  @Protegido()
  @Get('/:idCaso/grupo-trabalho/membros')
  public async listarMembrosGrupo(
    @Param('idCaso')
    idCaso: number,
  ) {
    const response = await this.casoGrupoTrabalhoService.listar(idCaso);

    return response.membros.map((membro) => {
      const membroResponse = new MembroGrupoTrabalhoResponse();
      membroResponse.id = membro.id;
      membroResponse.identificador = membro.identificador;
      membroResponse.instituicao = membro.instituicao;
      membroResponse.nome = membro.nome;
      membroResponse.email = membro.email;
      membroResponse.status = membro.status;

      return membroResponse;
    });
  }

  @ApiOperation({
    summary: 'Obter email de convite',
    description:
      'Retorna o email do convidado dado um token de convite.',
  })
  @ApiOkResponse({
    description: 'Email encontrado',
    type: MembroGrupoTrabalhoResponse,
    isArray: true,
  })
  @Get('/grupo-trabalho/convite/:identificador/email')
  public async emailConvite(
    @Param('identificador')
    identificador: string,
  ) {
    const response = await this.casoGrupoTrabalhoService.emailConvite(identificador);

    const emailResponse = new emailConviteResponse();
    emailResponse.email = response

    return emailResponse;
  }

  @ApiOperation({
      summary: 'Registra ata',
      description: 'Registra ata de uma reunião.',
    })
  @Protegido()
  @Post('/:idCaso/grupo-trabalho/ata')
  public async registrarAta(
    @Param('idCaso') idCaso: number,
    @Body() payload: RegistarAtaRequest,
  ) {
    await this.casoGrupoTrabalhoService.registrarAta(
      idCaso,
      payload.conteudo,
    );
  }

  @ApiOperation({
    summary: 'Criar um novo convite para o grupo de trabalho',
    description:
      'Emite um novo convite de participação no grupo de trabalho, para que o convidado consiga ingressar por conta própria',
  })
  @Protegido()
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
  @Protegido()
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
  
  @ApiOperation({
    summary: 'Iniciar Planejamento',
    description:
      'Inicia o planejamento de um caso específico',
  })
  @Protegido()
  @Post('/:idCaso/planejamento/iniciar')
  public async iniciarPlanejamento(
    @Param('idCaso')
    idCaso: number,
  ) {
    await this.casoGrupoTrabalhoService.IniciarPlanejamento(idCaso);
  }

}
