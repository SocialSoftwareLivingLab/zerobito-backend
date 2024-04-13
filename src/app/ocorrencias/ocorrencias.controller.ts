import { Protegido } from '@/auth/decorators/protegido.decorator';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CriarOcorrenciaRequest } from './dtos/criar-ocorrencia.dto';
import { FiltroConsultarOcorrenciasDto } from './dtos/filtro-ocorrencias.dto';
import { OcorrenciaDto } from './dtos/ocorrencia.dto';
import { OcorrenciasService } from './ocorrencias.service';

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
  ): Promise<void> {
    this.ocorrenciasService.registrar(ocorrencia);
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
}
