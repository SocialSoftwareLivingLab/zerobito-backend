import { Protegido } from '@/auth/decorators/protegido.decorator';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CriarOcorrenciaRequest } from './dtos/criar-ocorrencia.dto';
import { OcorrenciasService } from './ocorrencias.service';
import { FiltroConsultarOcorrenciasDto } from './dtos/filtro-ocorrencias.dto';
import { OcorrenciaDto } from './dtos/ocorrencia.dto';

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
}
