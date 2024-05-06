import { ApiProperty } from '@nestjs/swagger';
import { EmpresaDto } from './info/empresa.dto';
import { FonteOcorrenciaDto } from './info/fonte.dto';
import { LocalOcorrenciaDto } from './info/local.dto';
import { VitimaDto } from './info/vitima.dto';
import StatusOcorrencia from './status.dto';
import { UsuarioApiResponse } from '@/app/usuarios/dtos/usuario.dto';

export class OcorrenciaDto {
  @ApiProperty({ description: 'ID da ocorrência' })
  id: number;

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

  @ApiProperty({ description: 'Usuário que criou a ocorrência' })
  relator: UsuarioApiResponse;

  @ApiProperty({ description: 'Status da ocorrência' })
  status: StatusOcorrencia;

  @ApiProperty({ description: 'Local da ocorrência' })
  local: LocalOcorrenciaDto;

  @ApiProperty({ description: 'Vítima da ocorrência' })
  vitima: VitimaDto;

  @ApiProperty({ description: 'Empresa que houve a ocorrência' })
  empresa: EmpresaDto;

  @ApiProperty({ description: 'Fonte da ocorrência' })
  fonte: FonteOcorrenciaDto;

  @ApiProperty({
    description: 'Data de criação da ocorrência',
    format: 'date-time',
  })
  dataCriacao: Date;

  @ApiProperty({
    description: 'Data de alteração da ocorrência',
    format: 'date-time',
  })
  dataAlteracao: Date;
}
