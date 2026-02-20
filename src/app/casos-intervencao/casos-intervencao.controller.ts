import { Protegido } from '@/auth/decorators/protegido.decorator';
import { Body, Controller, Get, Logger, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CasosIntervencaoService } from './casos-intervencao.service';
import { MarcarReuniaoPlanejamentoRequest } from './payloads/marcar-reuniao.payload';
import { UsuarioAutenticado } from '@/auth/decorators/usuario-autenticado.decorator';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { ReuniaoResponse } from './usecases/buscar-agendamentos/buscar-agendamentos.usecase';
import { AcaoIntervencaoResponse } from './payloads/acao-intervencao.payload';
import { CriarAcaoIntervencaoRequest, EditarAcaoIntervencaoRequest } from './payloads/criar-editar-acao-intervencao.payload';

@Protegido()
@ApiBearerAuth()
@ApiTags('Casos')
@Controller('/api/v1')
export class CasosIntervencaoController {
  private readonly logger = new Logger(CasosIntervencaoController.name);
  constructor(
    private readonly casosIntervencaoService: CasosIntervencaoService,
  ) { }

  @ApiOperation({
    summary: 'Busca reuniões da intervenção',
    description:
      'Busca reuniões de intervenção para o grupo de trabalho do caso atual',
  })
  @ApiCreatedResponse({
    description: 'Reuniões buscadas com sucesso.',
  })
  @Get('/casos/:id/intervencao/reunioes/listar')
  async buscarReuniao(
    @Param('id') idCaso: number,
  ): Promise<ReuniaoResponse[]> {
    const response =  await this.casosIntervencaoService.buscarReuniaoIntervencao(
      idCaso,
    );

    return response;
  }

  @ApiOperation({
    summary: 'Marcar uma nova reunião de intervenção',
    description:
      'Marca uma nova reunião de intervenção para o grupo de trabalho do caso atual',
  })
  @ApiCreatedResponse({
    description: 'Reunião marcada com sucesso',
  })
  @Post('/casos/:id/intervencao/reunioes')
  async adicionarNotificacao(
    @Param('id') idCaso: number,
    @Body() payload: MarcarReuniaoPlanejamentoRequest,
    @UsuarioAutenticado() usuarioAutenticado: UsuarioAutenticadoDto,
  ): Promise<void> {
    return await this.casosIntervencaoService.agendarReuniaoIntervencao(
      payload.data,
      idCaso,
      usuarioAutenticado
    );
  }

  @ApiOperation({
    summary: 'Iniciar Intervenção',
    description:
      'Inicia a intervenção de um caso específico',
  })
  @Protegido()
  @Post('casos/:idCaso/intervencao/iniciar')
  public async iniciarIntervencao(
    @Param('idCaso')
    idCaso: number,
  ) {
    await this.casosIntervencaoService.iniciarIntervencao(idCaso);
  }

  @ApiOperation({
    summary: 'Listar ações de intervenção do caso',
    description:
      'Lista todas as ações de intervenção de um caso específico',
  })
  @ApiCreatedResponse({
    description: 'Ações listadas com sucesso.',
    type: [AcaoIntervencaoResponse]
  })
  @Get('casos/:id/intervencao/acoes')
  public async listarAcoesCaso(
    @Param('id') idCaso: number,
  ): Promise<AcaoIntervencaoResponse[]> {
    return await this.casosIntervencaoService.listarAcoesCaso(idCaso);
  }

  @ApiOperation({
    summary: 'Listar ações de intervenção de um membro',
    description:
      'Lista todas as ações de intervenção de um membro específico em um caso',
  })
  @ApiCreatedResponse({
    description: 'Ações do membro listadas com sucesso.',
    type: [AcaoIntervencaoResponse]
  })
  @Get('casos/:id/intervencao/membros/:idMembro/acoes')
  public async listarAcoesMembro(
    @Param('id') idCaso: number,
    @Param('idMembro') idMembro: number,
  ): Promise<AcaoIntervencaoResponse[]> {
    return await this.casosIntervencaoService.listarAcoesMembro(idCaso, idMembro);
  }

  @ApiOperation({
    summary: 'Criar ação de intervenção',
    description:
      'Cria uma nova ação de intervenção para um caso específico',
  })
  @ApiCreatedResponse({
    description: 'Ação criada com sucesso.',
  })
  @Post('casos/:id/intervencao/acoes')
  public async criarAcao(
    @Param('id') idCaso: number,
    @Body() payload: CriarAcaoIntervencaoRequest,
  ): Promise<void> {
    return await this.casosIntervencaoService.criarAcao(idCaso, payload);
  }

  @ApiOperation({
    summary: 'Editar ação de intervenção',
    description:
      'Edita uma ação de intervenção existente',
  })
  @ApiCreatedResponse({
    description: 'Ação editada com sucesso.',
  })
  @Put('casos/:id/intervencao/acoes/:idAcao')
  public async editarAcao(
    @Param('id') idCaso: number,
    @Param('idAcao') idAcao: number,
    @Body() payload: EditarAcaoIntervencaoRequest,
  ): Promise<void> {
    return await this.casosIntervencaoService.editarAcao(idCaso, idAcao, payload);
  }

  @ApiOperation({
    summary: 'Finalizar Intervenção',
    description:
      'Finaliza a intervenção de um caso específico. Requer pelo menos uma ação concluída com êxito ou satisfatória.',
  })
  @ApiCreatedResponse({
    description: 'Intervenção finalizada com sucesso.',
  })
  @Post('casos/:id/intervencao/finalizar')
  public async finalizarIntervencao(
    @Param('id') idCaso: number,
  ): Promise<void> {
    return await this.casosIntervencaoService.finalizarIntervencao(idCaso);
  }


}
