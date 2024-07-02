import { Protegido } from '@/auth/decorators/protegido.decorator';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CasosNotificacoesService } from './casos-notificacoes.service';
import { TipoNotificacaoResponse } from './payloads/tipo-notificacao.payload';
import {
  CriarNotificacaoRequest,
  CriarNotificacaoResponse,
} from './payloads/nova-notificacao.payload';
import { UsuarioAutenticado } from '@/auth/decorators/usuario-autenticado.decorator';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import {
  NotificacaoCasoResponse,
} from './payloads/notificacoes.payload';

@Protegido()
@ApiBearerAuth()
@ApiTags('Notificacoes')
@Controller('/api/v1')
export class CasosNotificacoesController {
  constructor(
    private readonly casosNotificacoesService: CasosNotificacoesService,
  ) {}

  @ApiOperation({
    summary: 'Buscar todos os tipos de notificações',
    description:
      'Retorna a listagem de todos os tipos de notificações registrados na base e disponíveis para uso',
  })
  @ApiOkResponse({
    description: 'Tipo de notificação registrado',
    type: TipoNotificacaoResponse,
    isArray: true,
  })
  @Get('/notificacoes/tipos')
  async buscarTiposNotificacoes(): Promise<TipoNotificacaoResponse[]> {
    return this.casosNotificacoesService.buscarTiposNotificacoes();
  }

  @ApiOperation({
    summary: 'Adicionar uma notificação a um caso',
    description:
      'Adiciona uma nova notificação a um caso específico, identificado pelo ID do caso fornecido',
  })
  @ApiCreatedResponse({
    description: 'Notificação adicionada com sucesso',
    type: CriarNotificacaoResponse,
  })
  @Post('/casos/:id/notificacoes')
  async adicionarNotificacao(
    @Param('id') id: number,
    @Body() payload: CriarNotificacaoRequest,
    @UsuarioAutenticado() usuarioAutenticado: UsuarioAutenticadoDto,
  ): Promise<CriarNotificacaoResponse> {
    return this.casosNotificacoesService.adicionarNotificacao(
      id,
      payload,
      usuarioAutenticado,
    );
  }

  @ApiOperation({
    summary: 'Buscar notificações de um caso',
    description:
      'Retorna a listagem de todas as notificações associadas a um caso específico, identificado pelo ID do caso fornecido',
  })
  @ApiOkResponse({
    description: 'Notificações associadas ao caso',
    type: NotificacaoCasoResponse,
    isArray: true,
  })
  @Get('/casos/:id/notificacoes')
  async buscarNotificacoesPorCaso(
    @Param('id') id: number,
  ): Promise<NotificacaoCasoResponse[]> {
    return this.casosNotificacoesService.buscarNotificacoesPorCaso(id);
  }

  @ApiOperation({
    summary: 'Editar Notificacao',
    description: 'Edita uma notificação de um caso',
  })
  @Put('/casos/:id/notificacoes/')
  public async editarNotificacao(
    @Param('id') id: number,
    @Body() payload: CriarNotificacaoRequest,
  ) {
    await this.casosNotificacoesService.editarNotificacao(
      id,
      payload,
    );
  }
}
