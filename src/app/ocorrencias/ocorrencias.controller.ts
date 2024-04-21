import { Protegido } from '@/auth/decorators/protegido.decorator';
import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FiltroConsultarOcorrenciasDto } from './dtos/filtro-ocorrencias.dto';
import { OcorrenciaDto } from './dtos/ocorrencia.dto';
import { OcorrenciasService } from './ocorrencias.service';
import { CriarOcorrenciaRequest } from './dtos/criar-ocorrencia.dto';
import { Request } from 'express';
import { UsuarioAutenticado } from '@/auth/decorators/usuario-autenticado.decorator';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { AceitarOcorrenciaRequest } from './dtos/aceitar/aceitar-ocorrencia.dto';

@Protegido()
@ApiBearerAuth()
@ApiTags('Ocorrencias')
@Controller('/api/v1/ocorrencias')
export class OcorrenciasController {
  constructor(private readonly ocorrenciasService: OcorrenciasService) {}

  @ApiOperation({
    summary: 'Cria uma nova ocorrência',
    description: 'Cria uma nova ocorrência na plataforma para ser analisado',
  })
  @ApiCreatedResponse({
    description: 'Ocorrência registrada',
  })
  @Post()
  public async criarOcorrencia(
    @Body() ocorrencia: CriarOcorrenciaRequest,
    @UsuarioAutenticado() usuarioAutenticado: UsuarioAutenticadoDto,
  ): Promise<void> {
    this.ocorrenciasService.registrar(ocorrencia, usuarioAutenticado);
  }

  @ApiOperation({
    summary: 'Consulta ocorrências',
    description: 'Consulta ocorrências com base em um filtro',
  })
  @ApiOkResponse({
    type: OcorrenciaDto,
    isArray: true,
    description: 'Ocorrências encontradas',
  })
  @Get()
  public consultarPorFiltro(
    @Query() filtro: FiltroConsultarOcorrenciasDto,
  ): Promise<OcorrenciaDto[]> {
    return this.ocorrenciasService.consultarComFiltro(filtro);
  }

  @ApiOperation({
    summary: 'Consulta ocorrência por ID',
    description: 'Consulta uma ocorrência por ID',
  })
  @ApiOkResponse({
    type: OcorrenciaDto,
    description: 'Ocorrência encontrada',
  })
  @Get('/:id')
  public consultarPorId(@Param('id') id: number): Promise<OcorrenciaDto> {
    return this.ocorrenciasService.consultarPorId(id);
  }

  @ApiOperation({
    summary: 'Aceitar ocorrência',
    description: 'Aceita uma ocorrência',
  })
  @Post('/:id/aceitar')
  public aceitar(
    @Param('id') id: number,
    @UsuarioAutenticado() usuario: UsuarioAutenticadoDto,
    @Body() dados: AceitarOcorrenciaRequest,
  ) {
    return this.ocorrenciasService.aceitar(id, dados, usuario);
  }
}
