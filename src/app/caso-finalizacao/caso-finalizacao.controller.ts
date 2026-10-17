import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { CasoFinalizacaoService } from './services/caso-finalizacao.service';
import { AtualizarAtorRelatorioDto } from './dtos/relatorio-finalizacao.dto';

@Controller('/api/v1/casos/:casoId/finalizacao')
export class CasoFinalizacaoController {
  constructor(private readonly finalizacaoService: CasoFinalizacaoService) {}

  /* =====================================================
      BUSCAR RELATÓRIO DE FINALIZAÇÃO
  ===================================================== */

  @Get('relatorio')
  async buscarRelatorio(@Param('casoId', ParseIntPipe) casoId: number) {
    return this.finalizacaoService.buscarOuCriarRelatorio(casoId);
  }

  /* =====================================================
      ATUALIZAR ATOR DO RELATÓRIO
  ===================================================== */

  @Patch('relatorio/atores/:atorId')
  async atualizarAtor(
    @Param('casoId', ParseIntPipe) casoId: number,
    @Param('atorId', ParseIntPipe) atorId: number,
    @Body() dto: AtualizarAtorRelatorioDto,
  ) {
    return this.finalizacaoService.atualizarAtor(casoId, atorId, dto);
  }

  /* =====================================================
      SUBMETER RELATÓRIO AO GT
  ===================================================== */

  @Post('relatorio/submeter-gt')
  async submeterAoGT(@Param('casoId', ParseIntPipe) casoId: number) {
    return this.finalizacaoService.submeterAoGT(casoId);
  }
}
