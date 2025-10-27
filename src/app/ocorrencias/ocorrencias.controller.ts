import { Protegido } from '@/auth/decorators/protegido.decorator';
import { UsuarioAutenticado } from '@/auth/decorators/usuario-autenticado.decorator';
import { UsuarioAutenticadoDto } from '@/auth/dtos/usuario-autenticado.dto';
import { Body, Controller, Get, Param, Post, Query, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Permissao } from '../usuarios/decorators/permissao.decorator';
import { PermissaoEnum } from '../usuarios/enums/permissoes.enum';
import { OcorrenciasService } from './ocorrencias.service';
import { AceitarOcorrenciaRequest } from './payloads/aceitar/aceitar-ocorrencia.dto';
import { CriarOcorrenciaRequest } from './payloads/criar-ocorrencia.dto';
import { FiltroConsultarOcorrenciasDto } from './payloads/filtro-ocorrencias.dto';
import { OcorrenciaDto } from './payloads/ocorrencia.dto';
import { VincularOcorrenciaCasoPayload } from './payloads/vincular/vincular-ocorrencia-caso.payload';
import { AtualizarOcorrenciaRequest } from './payloads/editar-ocorrencia.dto';

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
  @Permissao(PermissaoEnum.OCORRENCIAS_CRIAR)
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
  @Permissao(PermissaoEnum.OCORRENCIAS_VISUALIZAR_TODOS)
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
  @Permissao(PermissaoEnum.OCORRENCIAS_VISUALIZAR)
  public consultarPorId(@Param('id') id: number): Promise<OcorrenciaDto> {
    return this.ocorrenciasService.consultarPorId(id);
  }

  @ApiOperation({
    summary: 'Aceitar ocorrência',
    description: 'Aceita uma ocorrência',
  })
  @Post('/:id/aceitar')
  @Permissao(PermissaoEnum.OCORRENCIAS_ACEITAR)
  public aceitar(
    @Param('id') id: number,
    @UsuarioAutenticado() usuario: UsuarioAutenticadoDto,
    @Body() dados: AceitarOcorrenciaRequest,
  ) {
    return this.ocorrenciasService.aceitar(id, dados, usuario);
  }

  @ApiOperation({
    summary: 'Vincular ocorrência a um caso',
    description: 'Vincula uma ocorrência a um caso existente',
  })
  @Post('/:id/vincular')
  @Permissao(PermissaoEnum.OCORRENCIAS_ACEITAR)
  public async vincular(
    @Param('id') idOcorrencia: number,
    @Body() payload: VincularOcorrenciaCasoPayload,
  ) {
    return this.ocorrenciasService.vincular(idOcorrencia, payload.idCaso);
  }

  @ApiOperation({
    summary: 'Atualizar ocorrência',
    description: 'Atualiza os dados de uma ocorrência existente',
  })
  @ApiOkResponse({
    type: OcorrenciaDto,
    description: 'Ocorrência atualizada com sucesso',
  })
  @Patch('/:id')
  public async atualizarOcorrencia(
    @Param('id') idOcorrencia: number,
    @Body() dadosAtualizacao: AtualizarOcorrenciaRequest,
  ): Promise<OcorrenciaDto> {
    return this.ocorrenciasService.atualizar(idOcorrencia, dadosAtualizacao);
  }
}
