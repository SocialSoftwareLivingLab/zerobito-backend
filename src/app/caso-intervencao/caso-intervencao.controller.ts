import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { CasoIntervencaoService } from './services/caso-intervencao.service';
import {
  CreateCasoIntervencaoDto,
  UpdateIntervencaoDto,
} from './dtos/caso-intervencao.dto';

@Controller('casos/:casoId/intervencoes')
export class CasoIntervencaoController {
  constructor(
    private readonly intervencaoService: CasoIntervencaoService,
  ) {}

  /* =====================================================
      CRIAR INTERVENÇÃO
  ===================================================== */

  @Post()
  async create(
    @Param('casoId', ParseIntPipe) casoId: number,
    @Body() dto: CreateCasoIntervencaoDto,
  ) {
    return this.intervencaoService.create({
      ...dto,
      casoId,
    });
  }

  /* =====================================================
      LISTAR TODAS DO CASO
  ===================================================== */

  @Get()
  async findAll(
    @Param('casoId', ParseIntPipe) casoId: number,
  ) {
    return this.intervencaoService.findAllByCaso(casoId);
  }

  /* =====================================================
      AGRUPAR POR AUTOR
  ===================================================== */

  @Get('agrupado-por-autor')
  async agrupadoPorAutor(
    @Param('casoId', ParseIntPipe) casoId: number,
  ) {
    return this.intervencaoService.listarAgrupadoPorAutor(casoId);
  }

  /* =====================================================
      CALENDÁRIO
  ===================================================== */

  @Get('calendario')
  async calendario(
    @Param('casoId', ParseIntPipe) casoId: number,
  ) {
    return this.intervencaoService.listarParaCalendario(casoId);
  }

  /* =====================================================
      PODE FINALIZAR INTERVENÇÃO
  ===================================================== */

  @Get('pode-finalizar')
  async podeFinalizar(
    @Param('casoId', ParseIntPipe) casoId: number,
  ) {
    const pode =
      await this.intervencaoService.podeFinalizarIntervencao(casoId);

    return { podeFinalizar: pode };
  }

  /* =====================================================
      EDITAR INTERVENÇÃO
  ===================================================== */

  @Patch(':intervencaoId')
  async update(
    @Param('casoId', ParseIntPipe) casoId: number,
    @Param('intervencaoId', ParseIntPipe) intervencaoId: number,
    @Body() dto: UpdateIntervencaoDto,
  ) {
    return this.intervencaoService.update(
      intervencaoId,
      dto,
      casoId,
    );
  }

  /* =====================================================
      ANEXAR DOCUMENTO
  ===================================================== */

  @Post(':intervencaoId/anexos')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAnexo(
    @Param('casoId', ParseIntPipe) casoId: number,
    @Param('intervencaoId', ParseIntPipe) intervencaoId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.intervencaoService.anexarArquivo(
      casoId,
      intervencaoId,
      file,
    );
  }

  /* =====================================================
      LISTAR ANEXOS
  ===================================================== */

  @Get(':intervencaoId/anexos')
  async listarAnexos(
    @Param('casoId', ParseIntPipe) casoId: number,
    @Param('intervencaoId', ParseIntPipe) intervencaoId: number,
  ) {
    return this.intervencaoService.listarArquivosDaIntervencao(
      casoId,
      intervencaoId,
    );
  }

  /* =====================================================
      DOWNLOAD DE ANEXO
  ===================================================== */

  @Get(':intervencaoId/anexos/:arquivoId')
  async downloadAnexo(
    @Param('casoId', ParseIntPipe) casoId: number,
    @Param('intervencaoId', ParseIntPipe) intervencaoId: number,
    @Param('arquivoId') arquivoId: string,
    @Res() res: Response,
  ) {
    const { buffer, mimeType, filename } =
      await this.intervencaoService.downloadAnexo(
        casoId,
        intervencaoId,
        arquivoId,
      );

    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    res.send(buffer);
  }

  /* =====================================================
      REMOVER ANEXO
  ===================================================== */

  @Delete(':intervencaoId/anexos/:arquivoId')
  async removerAnexo(
    @Param('casoId', ParseIntPipe) casoId: number,
    @Param('intervencaoId', ParseIntPipe) intervencaoId: number,
    @Param('arquivoId') arquivoId: string,
  ) {
    return this.intervencaoService.removerAnexo(
      casoId,
      intervencaoId,
      arquivoId,
    );
  }
}