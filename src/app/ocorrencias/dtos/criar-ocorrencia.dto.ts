import { ApiProperty } from '@nestjs/swagger';
import { VitimaDto } from './info/vitima.dto';
import { LocalOcorrenciaDto } from './info/local.dto';
import { EmpresaDto } from './info/empresa.dto';
import { FonteOcorrenciaDto } from './info/fonte.dto';

export class CriarOcorrenciaRequest {
  @ApiProperty({
    example: 'Descrição da ocorrência',
    description: 'Descrição da ocorrência',
  })
  descricao: string;

  @ApiProperty({
    description: 'Data que aconteceu a ocorrência',
    example: '2021-10-10T00:00:00',
    type: Date,
    format: 'date-time',
  })
  data: Date;

  @ApiProperty({ description: 'Local da ocorrência' })
  local: LocalOcorrenciaDto;

  @ApiProperty({ description: 'Vítima da ocorrência' })
  vitima: VitimaDto;

  @ApiProperty({ description: 'Empresa que houve a ocorrência' })
  empresa: EmpresaDto;

  @ApiProperty({ description: 'Fonte da ocorrência' })
  fonte: FonteOcorrenciaDto;
}
