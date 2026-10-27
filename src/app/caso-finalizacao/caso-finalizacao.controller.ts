import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { Protegido } from '@/auth/decorators/protegido.decorator';
import { UsuarioAutenticado } from '@/auth/decorators/usuario-autenticado.decorator';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';

import { CasoFinalizacaoService } from './services/caso-finalizacao.service';
import {
  AtualizarAtorRelatorioDto,
  SalvarComentarioAtorDto,
} from './dtos/relatorio-finalizacao.dto';

@Controller('/api/v1/casos/:casoId/finalizacao')
export class CasoFinalizacaoController {
  constructor(private readonly finalizacaoService: CasoFinalizacaoService) {}

  /* =====================================================
      BUSCAR RELATÓRIO DE FINALIZAÇÃO
  ===================================================== */

  @Protegido()
  @Get('relatorio')
  async buscarRelatorio(
    @Param('casoId', ParseIntPipe) casoId: number,
    @UsuarioAutenticado() usuario: UsuarioAutenticadoDto,
  ) {
    return this.finalizacaoService.buscarOuCriarRelatorio(casoId, usuario.id);
  }

  /* =====================================================
      ATUALIZAR ATOR DO RELATÓRIO
  ===================================================== */

  @Protegido()
  @Patch('relatorio/atores/:atorId')
  async atualizarAtor(
    @Param('casoId', ParseIntPipe) casoId: number,
    @Param('atorId', ParseIntPipe) atorId: number,
    @UsuarioAutenticado() usuario: UsuarioAutenticadoDto,
    @Body() dto: AtualizarAtorRelatorioDto,
  ) {
    return this.finalizacaoService.atualizarAtor(
      casoId,
      atorId,
      usuario.id,
      dto,
    );
  }

  /* =====================================================
      SUBMETER RELATÓRIO AO GT
  ===================================================== */

  @Protegido()
  @Post('relatorio/submeter-gt')
  async submeterAoGT(
    @Param('casoId', ParseIntPipe) casoId: number,
    @UsuarioAutenticado() usuario: UsuarioAutenticadoDto,
  ) {
    return this.finalizacaoService.submeterAoGT(casoId, usuario.id);
  }

  /* =====================================================
      LISTAR COMENTÁRIOS DO RELATÓRIO
  ===================================================== */

  @Protegido()
  @Get('relatorio/comentarios')
  async listarComentarios(
    @Param('casoId', ParseIntPipe) casoId: number,
    @UsuarioAutenticado() usuario: UsuarioAutenticadoDto,
  ) {
    return this.finalizacaoService.listarComentarios(casoId, usuario.id);
  }

  /* =====================================================
      SALVAR MEU COMENTÁRIO EM UM ATOR
  ===================================================== */

  @Protegido()
  @Put('relatorio/atores/:atorId/comentario')
  async salvarComentario(
    @Param('casoId', ParseIntPipe) casoId: number,
    @Param('atorId', ParseIntPipe) atorId: number,
    @UsuarioAutenticado() usuario: UsuarioAutenticadoDto,
    @Body() dto: SalvarComentarioAtorDto,
  ) {
    return this.finalizacaoService.salvarComentario(
      casoId,
      atorId,
      usuario.id,
      dto,
    );
  }
}
