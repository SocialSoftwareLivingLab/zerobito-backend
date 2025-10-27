import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';
import { EmpresaDto } from './info/empresa.dto';
import { FonteOcorrenciaDto } from './info/fonte.dto';
import { LocalOcorrenciaDto } from './info/local.dto';
import { VitimaDto } from './info/vitima.dto';

export class AtualizarOcorrenciaRequest {
  @ApiProperty({
    example: 'Descrição da ocorrência atualizada',
    description: 'Descrição da ocorrência',
    required: false,
  })
  @IsOptional()
  descricao?: string;

  @ApiProperty({
    example: 'Título da ocorrência atualizado',
    description: 'Título da ocorrência',
    required: false,
  })
  @IsOptional()
  titulo?: string;

  @ApiProperty({
    description: 'Data que aconteceu a ocorrência',
    example: '2021-10-10T00:00:00',
    type: Date,
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  data?: Date;

  @ApiProperty({ 
    description: 'Local da ocorrência',
    required: false,
  })
  @IsOptional()
  local?: LocalOcorrenciaDto;

  @ApiProperty({ 
    description: 'Vítima da ocorrência',
    required: false,
  })
  @IsOptional()
  vitima?: VitimaDto;

  @ApiProperty({ 
    description: 'Empresa que houve a ocorrência',
    required: false,
  })
  @IsOptional()
  empresa?: EmpresaDto;

  @ApiProperty({ 
    description: 'Fonte da ocorrência',
    required: false,
  })
  @IsOptional()
  fonte?: FonteOcorrenciaDto;
}