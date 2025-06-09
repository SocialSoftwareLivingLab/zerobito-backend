import { Protegido } from '@/auth/decorators/protegido.decorator';
import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CasosPlanejamentoService } from './casos-planejamento.service';
import { MarcarReuniaoPlanejamentoRequest } from './payloads/marcar-reuniao.payload';
import { UsuarioAutenticado } from '@/auth/decorators/usuario-autenticado.decorator';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { ReuniaoResponse } from './usecases/buscar-agendamentos/buscar-agendamentos.usecase';

@Protegido()
@ApiBearerAuth()
@ApiTags('Casos')
@Controller('/api/v1')
export class CasosPlanejamentoController {
  private readonly logger = new Logger(CasosPlanejamentoController.name);
  constructor(
    private readonly casosPlanejamentoService: CasosPlanejamentoService,
  ) { }

  @ApiOperation({
    summary: 'Busca reuniões do planejamento',
    description:
      'Busca reuniões de planejamento para o grupo de trabalho do caso atual',
  })
  @ApiCreatedResponse({
    description: 'Reuniões buscadas com sucesso.',
  })
  @Get('/casos/:id/planejamento/reunioes/listar')
  async buscarReuniao(
    @Param('id') idCaso: number,
  ): Promise<ReuniaoResponse[]> {
    const response =  await this.casosPlanejamentoService.buscarReuniaoPlanejamento(
      idCaso,
    );

    return response;
  }

  @ApiOperation({
    summary: 'Marcar uma nova reunião de planejamento',
    description:
      'Marca uma nova reunião de planejamento para o grupo de trabalho do caso atual',
  })
  @ApiCreatedResponse({
    description: 'Reunião marcada com sucesso',
  })
  @Post('/casos/:id/planejamento/reunioes')
  async adicionarNotificacao(
    @Param('id') idCaso: number,
    @Body() payload: MarcarReuniaoPlanejamentoRequest,
    @UsuarioAutenticado() usuarioAutenticado: UsuarioAutenticadoDto,
  ): Promise<void> {
    return await this.casosPlanejamentoService.agendarReuniaoPlanejamento(
      payload.data,
      idCaso,
      usuarioAutenticado
    );
  }

  @ApiOperation({
    summary: "Buscar agendamentos marcados",
    description: "Retorna a lista de reuniões agendadas para o caso. A ordenação está definida pela data da reunião, em ordem crescente."
  })
  @Get('/casos/:id/planejamento/reunioes')
  async buscarReunioesAgendadas(
    @Param('id') idCaso: number,
  ) {
    return await this.casosPlanejamentoService.buscarAgendamentos(idCaso);
  }

}
