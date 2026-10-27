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
import { PermissaoCaso } from '@/app/casos/decorators/permissao-caso.decorator';
import { PermissaoEnum } from '@/app/usuarios/enums/permissoes.enum';

import { CasoFinalizacaoService } from './services/caso-finalizacao.service';
import {
  AtualizarAtorRelatorioDto,
  SalvarComentarioAtorDto,
} from './dtos/relatorio-finalizacao.dto';

// O parâmetro se chama idCaso porque é dele que o PermissaoCasoGuard lê o caso.
@Protegido()
@Controller('/api/v1/casos/:idCaso/finalizacao')
export class CasoFinalizacaoController {
  constructor(private readonly finalizacaoService: CasoFinalizacaoService) {}

  /* =====================================================
      BUSCAR RELATÓRIO DE FINALIZAÇÃO
  ===================================================== */

  @Get('relatorio')
  @PermissaoCaso(PermissaoEnum.CASOS_VISUALIZAR_RELATORIO_FINALIZACAO)
  async buscarRelatorio(
    @Param('idCaso', ParseIntPipe) casoId: number,
    @UsuarioAutenticado() usuario: UsuarioAutenticadoDto,
  ) {
    return this.finalizacaoService.buscarOuCriarRelatorio(casoId, usuario.id);
  }

  /* =====================================================
      ATUALIZAR ATOR DO RELATÓRIO
  ===================================================== */

  @Patch('relatorio/atores/:atorId')
  @PermissaoCaso(PermissaoEnum.CASOS_EDITAR_RELATORIO_FINALIZACAO)
  async atualizarAtor(
    @Param('idCaso', ParseIntPipe) casoId: number,
    @Param('atorId', ParseIntPipe) atorId: number,
    @Body() dto: AtualizarAtorRelatorioDto,
  ) {
    return this.finalizacaoService.atualizarAtor(casoId, atorId, dto);
  }

  /* =====================================================
      SUBMETER RELATÓRIO AO GT
  ===================================================== */

  @Post('relatorio/submeter-gt')
  @PermissaoCaso(PermissaoEnum.CASOS_EDITAR_RELATORIO_FINALIZACAO)
  async submeterAoGT(@Param('idCaso', ParseIntPipe) casoId: number) {
    return this.finalizacaoService.submeterAoGT(casoId);
  }

  /* =====================================================
      LISTAR COMENTÁRIOS DO RELATÓRIO
  ===================================================== */

  @Get('relatorio/comentarios')
  @PermissaoCaso(PermissaoEnum.CASOS_VISUALIZAR_RELATORIO_FINALIZACAO)
  async listarComentarios(
    @Param('idCaso', ParseIntPipe) casoId: number,
    @UsuarioAutenticado() usuario: UsuarioAutenticadoDto,
  ) {
    return this.finalizacaoService.listarComentarios(casoId, usuario.id);
  }

  /* =====================================================
      SALVAR MEU COMENTÁRIO EM UM ATOR
  ===================================================== */

  @Put('relatorio/atores/:atorId/comentario')
  @PermissaoCaso(PermissaoEnum.CASOS_COMENTAR_RELATORIO_FINALIZACAO)
  async salvarComentario(
    @Param('idCaso', ParseIntPipe) casoId: number,
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
