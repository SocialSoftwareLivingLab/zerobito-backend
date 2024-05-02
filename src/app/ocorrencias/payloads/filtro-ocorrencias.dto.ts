import { ApiProperty } from '@nestjs/swagger';
import { StatusOcorrenciaEnum } from '../enums/status-ocorrencia.enum';

export class FiltroConsultarOcorrenciasDto {
  @ApiProperty({
    description: 'Status da ocorrência',
    example: 'AGUARDANDO_ANALISE',
    enum: StatusOcorrenciaEnum,
  })
  status: StatusOcorrenciaEnum;
}
