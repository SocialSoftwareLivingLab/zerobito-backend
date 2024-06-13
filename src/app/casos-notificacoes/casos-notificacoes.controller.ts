import { Protegido } from '@/auth/decorators/protegido.decorator';
import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CasosNotificacoesService } from './casos-notificacoes.service';
import { TipoNotificacaoResponse } from './payloads/tipo-notificacao.payload';

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
  async buscarTiposNotificacoes() {
    return this.casosNotificacoesService.buscarTiposNotificacoes();
  }
}
