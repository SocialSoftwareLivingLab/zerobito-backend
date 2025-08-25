import { Protegido } from '@/auth/decorators/protegido.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Permissao } from '../usuarios/decorators/permissao.decorator';
import { PermissaoEnum } from '../usuarios/enums/permissoes.enum';
import { CoordenadoresService } from './coordenadores.service';
import ConsultarCoordenadoresResponseDto from './payloads/consulta/consultar-coordenadores.response';

@Protegido()
@ApiBearerAuth()
@ApiTags('Coordenadores')
@Controller('/api/v1/coordenadores')
export class CoordenadoresController {
  constructor(private readonly coordenadoresService: CoordenadoresService) {}

  @Get()
  @ApiOperation({
    description: 'Busca os coordenadores cadastrados na plataforma',
    summary: 'Consultar coordenadores',
  })
  @ApiQuery({
    name: 'nome',
    description: 'Nome do coordenador',
    required: false,
  })
  @Permissao(PermissaoEnum.COORDENADORES_VISUALIZAR)
  public async buscarCoordenadores(
    @Query('nome')
    nome: string,
  ) {
    const result = await this.coordenadoresService.buscarCoordenadores({
      nome,
    });

    return result.map((coordenador) =>
      ConsultarCoordenadoresResponseDto.fromEntity(coordenador),
    );
  }
}
